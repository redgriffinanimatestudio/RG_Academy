import { useState, useEffect } from 'react';

export type SectorPath = 'ACADEMY' | 'STUDIO' | 'COMMUNITY' | 'NONE';

interface UserJourney {
  selectedPath: SectorPath;
  currentStep: number;
  lastUpdated: number;
  consentGiven: boolean;
}

const STORAGE_KEY = 'rg_academy_journey';

export const useUserJourney = () => {
  const [journey, setJourney] = useState<UserJourney>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user journey', e);
      }
    }
    return {
      selectedPath: 'NONE',
      currentStep: 0,
      lastUpdated: Date.now(),
      consentGiven: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
  }, [journey]);

  const selectPath = (path: SectorPath) => {
    setJourney(prev => ({
      ...prev,
      selectedPath: path,
      currentStep: 1,
      lastUpdated: Date.now(),
    }));
  };

  const setStep = (step: number) => {
    setJourney(prev => ({
      ...prev,
      currentStep: step,
      lastUpdated: Date.now(),
    }));
  };

  const giveConsent = () => {
    setJourney(prev => ({
      ...prev,
      consentGiven: true,
      lastUpdated: Date.now(),
    }));
  };

  const resetJourney = () => {
    setJourney({
      selectedPath: 'NONE',
      currentStep: 0,
      lastUpdated: Date.now(),
      consentGiven: false,
    });
  };

  return {
    journey,
    selectPath,
    setStep,
    giveConsent,
    resetJourney,
  };
};
