import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prospectId, companyLinkedinUrl } = await req.json();

    if (!companyLinkedinUrl) {
      return new Response(
        JSON.stringify({ error: 'Company LinkedIn URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');

    if (!openaiApiKey || !unipileApiKey) {
      return new Response(
        JSON.stringify({ error: 'API keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching company data from Unipile for:', companyLinkedinUrl);

    // Fetch company data from Unipile API
    const unipileResponse = await fetch('https://api.unipile.com/api/v1/companies/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${unipileApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkedin_url: companyLinkedinUrl,
      }),
    });

    if (!unipileResponse.ok) {
      const errorText = await unipileResponse.text();
      console.error('Unipile API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch company data from Unipile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyData = await unipileResponse.json();
    console.log('Company data received:', companyData);

    // Upsert company data into database
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .upsert({
        linkedin_url: companyLinkedinUrl,
        name: companyData.name || null,
        industry: companyData.industry || null,
        company_size: companyData.company_size || null,
        description: companyData.description || null,
        raw_data: companyData,
      }, {
        onConflict: 'linkedin_url',
      })
      .select()
      .single();

    if (companyError) {
      console.error('Error upserting company:', companyError);
      return new Response(
        JSON.stringify({ error: 'Failed to save company data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Company saved:', company);

    // Run AI analysis using OpenAI
    const analysisPrompt = `Analyze this company for B2B sales outreach:

Company Name: ${company.name || 'Unknown'}
Industry: ${company.industry || 'Unknown'}
Company Size: ${company.company_size || 'Unknown'}
Description: ${company.description || 'No description available'}

Please provide:
1. Three key pain points this company likely faces (as a JSON array)
2. Three types of decision makers to target (as a JSON array)
3. Three sales angles that would resonate (as a JSON array)
4. A brief key insights summary (as a string)

Return ONLY a JSON object with this exact structure:
{
  "pain_points": ["point1", "point2", "point3"],
  "decision_makers": ["role1", "role2", "role3"],
  "sales_angles": ["angle1", "angle2", "angle3"],
  "key_insights": "summary text"
}`;

    console.log('Running AI analysis...');

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: 'You are a B2B sales analysis expert. Always respond with valid JSON only.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const analysisText = openaiData.choices[0].message.content;
    console.log('AI analysis received:', analysisText);

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save analysis to database
    const { data: savedAnalysis, error: analysisError } = await supabase
      .from('company_analysis')
      .upsert({
        company_id: company.id,
        pain_points: analysis.pain_points,
        decision_makers: analysis.decision_makers,
        sales_angles: analysis.sales_angles,
        key_insights: analysis.key_insights,
      }, {
        onConflict: 'company_id',
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error saving analysis:', analysisError);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis saved:', savedAnalysis);

    // Link prospect to company if prospectId provided
    if (prospectId) {
      const { error: linkError } = await supabase
        .from('prospects')
        .update({ company_id: company.id })
        .eq('id', prospectId);

      if (linkError) {
        console.error('Error linking prospect to company:', linkError);
      } else {
        console.log('Prospect linked to company');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        company, 
        analysis: savedAnalysis 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-company function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});