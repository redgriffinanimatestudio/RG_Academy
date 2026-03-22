export interface Report {
  id: string;
  reporterId: string;
  reporter: {
    displayName: string;
  };
  targetType: string;
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export const moderationService = {
  async getReports(status?: string): Promise<Report[]> {
    const url = status ? `/api/v1/moderation/reports?status=${status}` : '/api/v1/moderation/reports';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  async resolveReport(id: string, status: 'resolved' | 'dismissed'): Promise<void> {
    const response = await fetch(`/api/v1/moderation/reports/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to resolve report');
  },

  async createReport(report: Omit<Report, 'id' | 'status' | 'createdAt' | 'reporter'>): Promise<Report> {
    const response = await fetch('/api/v1/moderation/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    if (!response.ok) throw new Error('Failed to create report');
    return response.json();
  }
};
