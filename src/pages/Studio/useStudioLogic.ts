import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { networkingService } from '../../services/networkingService';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';

export function useStudioLogic() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'manage'>('browse');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewRoom, setShowReviewRoom] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSession, setActiveSession] = useState<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    urgency: 'all',
    maturity: 'all',
    budgetMin: 0
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [talent, setTalent] = useState<any[]>([]);
  const [loadingTalent, setLoadingTalent] = useState(true);

  const userRoles = profile?.roles || [];
  const isClient = userRoles.includes('client') || userRoles.includes('admin');
  const isExecutor = userRoles.includes('executor') || userRoles.includes('admin');
  const hasSynergyCE = isClient && isExecutor;

  // 1. Fetch Real Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.urgency !== 'all') params.append('urgency', filters.urgency);
      if (filters.maturity !== 'all') params.append('maturity', filters.maturity);
      if (filters.budgetMin > 0) params.append('budgetMin', filters.budgetMin.toString());

      const response = await apiClient.get(`/v1/studio/projects?${params.toString()}`);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    async function fetchTalent() {
      try {
        setLoadingTalent(true);
        const data = await networkingService.searchProfiles('');
        setTalent(data);
      } catch (error) {
        console.error("Failed to fetch talent:", error);
      } finally {
        setLoadingTalent(false);
      }
    }
    fetchTalent();
  }, []);

  const filteredProjects = projects;

  const handleApply = async (data: { coverLetter: string, bid: number, days: number }) => {
    try {
      if (!selectedProject) return;
      await apiClient.post('/v1/studio/applications', {
        projectId: selectedProject.id,
        ...data
      });
      setShowApplyModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Bid submission failed:", error);
    }
  };

  return {
    t, lang, profile, activeTab, setActiveTab,
    selectedProject, setSelectedProject,
    showApplyModal, setShowApplyModal,
    showCheckout, setShowCheckout,
    searchQuery, setSearchQuery,
    showFilters, setShowFilters,
    filters, setFilters,
    showReviewRoom, setShowReviewRoom,
    showCreateModal, setShowCreateModal,
    activeSession, setActiveSession,
    isClient, isExecutor, hasSynergyCE,
    talent, loadingTalent, loadingProjects, filteredProjects, handleApply
  };
}
