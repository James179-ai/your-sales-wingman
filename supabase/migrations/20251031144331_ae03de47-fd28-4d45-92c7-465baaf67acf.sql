-- Create prospects table
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  linkedin_url TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  title TEXT,
  company TEXT,
  status TEXT DEFAULT 'new',
  ai_summary TEXT,
  last_action TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Create policies for prospects
CREATE POLICY "Authenticated users can view prospects"
  ON public.prospects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert prospects"
  ON public.prospects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update prospects"
  ON public.prospects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete prospects"
  ON public.prospects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linkedin_url TEXT NOT NULL UNIQUE,
  name TEXT,
  industry TEXT,
  company_size TEXT,
  description TEXT,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Authenticated users can view companies"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert companies"
  ON public.companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies"
  ON public.companies
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create company_analysis table
CREATE TABLE public.company_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  pain_points TEXT[],
  decision_makers TEXT[],
  sales_angles TEXT[],
  key_insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Enable RLS
ALTER TABLE public.company_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for company_analysis
CREATE POLICY "Authenticated users can view company analysis"
  ON public.company_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert company analysis"
  ON public.company_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update company analysis"
  ON public.company_analysis
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add company_id to prospects table
ALTER TABLE public.prospects ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_analysis_updated_at
  BEFORE UPDATE ON public.company_analysis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();