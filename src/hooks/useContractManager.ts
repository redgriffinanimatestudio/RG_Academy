import { useState, useEffect } from 'react';
import { studioService, Contract } from '../services/studioService';
import { userService, UserProfile } from '../services/userService';

export function useContractManager(user: any) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [partners, setPartners] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile(user.id || user.uid);
        setUserProfile(profile);

        if (profile) {
          const uid = user.id || user.uid;
          const clientContracts = profile.roles.includes('client') ? await studioService.getContracts(uid, 'client') : [];
          const executorContracts = profile.roles.includes('executor') ? await studioService.getContracts(uid, 'executor') : [];
          
          // Combine and sort by date
          const allContracts = [...clientContracts, ...executorContracts].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

          // Remove duplicates
          const uniqueContracts = Array.from(new Map(allContracts.map(c => [c.id, c])).values());
          setContracts(uniqueContracts);

          // Fetch partner profiles
          const partnerIds = Array.from(new Set(uniqueContracts.map(c => c.clientId === uid ? c.executorId : c.clientId)));
          
          // userService.getUsers needs implementation if missing, but we'll fetch individually if needed
          // Assuming userService.getUsers exists based on current Contracts.tsx logic
          const profiles = await Promise.all(partnerIds.map(id => userService.getProfile(id)));
          const profileMap = profiles.reduce((acc, p) => p ? { ...acc, [p.id || p.uid]: p } : acc, {});
          setPartners(profileMap);
        }
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return {
    contracts,
    selectedContract,
    setSelectedContract,
    partners,
    loading,
    userProfile
  };
}
