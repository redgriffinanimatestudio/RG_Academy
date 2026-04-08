import apiClient from './apiClient';

export const financeService = {
  // 1. Get My Balance (Unified Telemetry)
  async getMyBalance(): Promise<any> {
    const { data } = await apiClient.get('/v1/finance/balance');
    return data.success ? data.data : null;
  },

  // 2. Get Treasury Stats (Admin only)
  async getStats(period = '30d'): Promise<any> {
    const { data } = await apiClient.get(`/v1/finance/stats?period=${period}`);
    return data.success ? data.data : null;
  },

  // 3. Get Escrow List
  async getEscrows(status?: string): Promise<any> {
    const url = status ? `/v1/finance/escrows?status=${status}` : '/v1/finance/escrows';
    const { data } = await apiClient.get(url);
    return data.success ? data.data : [];
  },

  // 4. Release Escrow Payment
  async releasePayment(escrowId: string): Promise<any> {
    const { data } = await apiClient.post(`/v1/finance/escrows/${escrowId}/release`);
    return data.success ? data.data : null;
  },

  // 5. Request Withdrawal
  async requestWithdrawal(amount: number, method: string): Promise<any> {
    const { data } = await apiClient.post('/v1/finance/withdraw', { amount, method });
    return data.success ? data.data : null;
  }
};
