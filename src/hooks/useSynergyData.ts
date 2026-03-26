import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface SynergyStats {
  primary?: any;
  count: number;
  extra: number;
  revenue?: number;
  label: string;
  extraLabel: string;
  message?: string;
}

export function useSynergyData() {
  const { activeRole, profile } = useAuth();
  const [data, setData] = useState<SynergyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/synergy-stats?role=${activeRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeRole, profile?.id]);

  return { data, loading, error, refetch: fetchStats };
}
