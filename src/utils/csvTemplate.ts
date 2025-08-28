// CSV template utilities for prospect import

export const csvHeaders = [
  'firstName',
  'lastName', 
  'company',
  'position',
  'email',
  'phone',
  'linkedinUrl',
  'location',
  'notes'
];

export const csvTemplateData = [
  {
    firstName: 'John',
    lastName: 'Smith',
    company: 'Tech Corp',
    position: 'Software Engineer',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    location: 'San Francisco, CA',
    notes: 'Met at tech conference'
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    company: 'StartupXYZ',
    position: 'Marketing Manager',
    email: 'sarah@startupxyz.com',
    phone: '+1 (555) 987-6543',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    location: 'Austin, TX',
    notes: 'Interested in our product demo'
  }
];

export const downloadCsvTemplate = () => {
  // Create CSV content
  const csvContent = [
    csvHeaders.join(','),
    ...csvTemplateData.map(row => 
      csvHeaders.map(header => {
        const value = row[header as keyof typeof row] || '';
        // Escape commas and quotes in CSV
        return `"${value?.toString().replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'prospects_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file must contain at least a header row and one data row'));
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const prospects = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const prospect: any = {};
          
          headers.forEach((header, index) => {
            prospect[header] = values[index] || '';
          });
          
          // Validate required fields
          const isValid = prospect.firstName && prospect.lastName && prospect.company;
          prospect.status = isValid ? 'valid' : 'error';
          if (!isValid) {
            prospect.error = 'Missing required fields (firstName, lastName, company)';
          }
          
          prospects.push(prospect);
        }
        
        resolve(prospects);
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};