interface SavedCampaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  language: string;
  userType: 'company' | 'freelancer';
  createdAt: string;
  prospects: number;
  connections: number;
  messages: number;
  responses: number;
  meetings: number;
  responseRate: string;
  dailyCap: number;
  weeklyCap: number;
  monthlyCap: number;
  // Store full campaign data
  campaignData?: any;
}

const CAMPAIGNS_STORAGE_KEY = 'arthur_campaigns';

export const saveCampaign = (campaignData: any, status: 'active' | 'draft' = 'active'): SavedCampaign => {
  const campaigns = getCampaigns();
  const newCampaign: SavedCampaign = {
    id: Date.now(),
    name: campaignData.name || 'Untitled Campaign',
    status,
    language: 'EN',
    userType: 'company',
    createdAt: new Date().toISOString().split('T')[0],
    prospects: Math.floor(Math.random() * 200) + 50, // Simulate prospects found
    connections: status === 'draft' ? 0 : Math.floor(Math.random() * 100) + 20,
    messages: status === 'draft' ? 0 : Math.floor(Math.random() * 50) + 10,
    responses: status === 'draft' ? 0 : Math.floor(Math.random() * 20) + 5,
    meetings: status === 'draft' ? 0 : Math.floor(Math.random() * 8) + 1,
    responseRate: status === 'draft' ? '0%' : `${(Math.random() * 20 + 10).toFixed(1)}%`,
    dailyCap: campaignData.dailyLimit || 20,
    weeklyCap: campaignData.weeklyLimit || 100,
    monthlyCap: (campaignData.weeklyLimit || 100) * 4,
    campaignData
  };

  campaigns.unshift(newCampaign); // Add to beginning
  localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  return newCampaign;
};

export const getCampaigns = (): SavedCampaign[] => {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const updateCampaign = (id: number, updates: Partial<SavedCampaign>): void => {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);
  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...updates };
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  }
};

export const deleteCampaign = (id: number): void => {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter(c => c.id !== id);
  localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(filtered));
};