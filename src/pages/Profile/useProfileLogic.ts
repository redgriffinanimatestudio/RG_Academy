import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Rocket, Sparkles, User } from 'lucide-react';
import { networkingService, Profile } from '../../services/networkingService';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../components/Alert';

export type ProfileTab = 'about' | 'portfolio' | 'experience' | 'education' | 'reviews';

export function useProfileLogic() {
  const { id, lang } = useParams();
  const { t } = useTranslation();
  const { user, profile: currentUserProfile, loading: authLoading } = useAuth();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio/');

  const [activeTab, setActiveTab] = useState<ProfileTab>('about');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const handleStartChat = async () => {
    if (!user || !id) {
      alert.showAlert({ type: 'error', message: 'Please login to send messages' });
      return;
    }

    try {
      setIsValidating(true);
      const token = localStorage.getItem("rg_token");
      const validation = await networkingService.validateChatAccess(id, token);

      if (!validation.canMessage) {
        alert.showAlert({ type: 'error', message: validation.error || 'Access denied' });
        return;
      }

      const prefix = isStudio ? '/studio' : '/aca';
      navigate(`${prefix}/${lang || 'eng'}/messages?userId=${id}`);
    } catch (e) {
      alert.showAlert({ type: 'error', message: 'Failed to validate messaging rights' });
    } finally {
      setIsValidating(false);
    }
  };

  const synergyBadges = useMemo(() => {
    if (!profile) return [];
    const roles = profile.roles || [];
    const badges = [];

    const isL = roles.includes('lecturer') || roles.includes('admin');
    const isE = roles.includes('executor') || roles.includes('admin');
    const isC = roles.includes('client') || roles.includes('admin');
    const isS = roles.includes('student');

    if (isL && isE) badges.push({ id: 'practicing_mentor', label: 'Practicing Mentor', icon: GraduationCap, color: 'bg-indigo-500', synergy: 'le' });
    if (isC && isE) badges.push({ id: 'ecosystem_partner', label: 'Ecosystem Partner', icon: Rocket, color: 'bg-sky-500', synergy: 'ce' });
    if (isS && isE) badges.push({ id: 'rising_specialist', label: 'Rising Specialist', icon: Sparkles, color: 'bg-emerald-500', synergy: 'se' });
    
    if (badges.length === 0 && roles.length > 0) {
      const primary = roles[0];
      badges.push({ id: primary, label: primary.replace('_', ' '), icon: User, color: 'bg-white/10', synergy: null });
    }

    return badges;
  }, [profile]);

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;
      const currentUid = currentUserProfile?.id || currentUserProfile?.uid;
      
      if (currentUserProfile && id === currentUid) {
        setProfile({
          id: currentUid,
          userId: currentUid,
          bio: (currentUserProfile as any).bio || t('default_bio', 'Professional CG Specialist in the Red Griffin Ecosystem.'),
          location: currentUserProfile.country || 'Remote',
          skills: [],
          portfolio: [],
          roles: currentUserProfile.roles || [],
          user: {
            displayName: currentUserProfile.displayName || 'User',
            photoURL: currentUserProfile.photoURL || undefined
          },
          country: currentUserProfile.country,
          citizenship: currentUserProfile.citizenship,
          linkedInUrl: currentUserProfile.linkedInUrl,
          telegramHandle: currentUserProfile.telegramHandle,
          portfolioUrl: currentUserProfile.portfolioUrl,
          gender: currentUserProfile.gender,
          dateOfBirth: currentUserProfile.dateOfBirth
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        try {
          const data = await networkingService.getProfile(id);
          if (data) setProfile(data);
          else throw new Error('Not found');
        } catch (err) {
          const response = await fetch(`/api/users/${id}`);
          if (response.ok) {
            const resData = await response.json();
            const userData = resData.data || resData;
            let userRoles = ['student'];
            if (userData.roles) {
              userRoles = Array.isArray(userData.roles) ? userData.roles : JSON.parse(userData.roles);
            }
            setProfile({
              id: userData.id,
              userId: userData.id,
              bio: userData.bio || '',
              location: 'Remote',
              skills: [],
              portfolio: [],
              roles: userRoles,
              user: { displayName: userData.displayName || 'User', photoURL: userData.photoURL || undefined }
            });
          } else setProfile(null);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setProfile(null);
      } finally { setLoading(false); }
    }
    fetchProfile();
  }, [id, currentUserProfile, t]);

  return {
    id, lang, t, user, profile, loading, authLoading, 
    activeTab, setActiveTab, isValidating, 
    handleStartChat, synergyBadges, isStudio
  };
}
