import React, { useState } from 'react';
import { Shield, Eye, Globe, Lock, Check, X } from 'lucide-react';
import { useUserJourney } from '../../hooks/useUserJourney';

interface ComplianceCenterProps {
  onAccept: () => void;
}

export default function ComplianceCenter({ onAccept }: ComplianceCenterProps) {
  const { journey, giveConsent } = useUserJourney();
  const [isVisible, setIsVisible] = useState(!journey.consentGiven);

  if (!isVisible) return null;

  const handleAccept = () => {
    giveConsent();
    setIsVisible(false);
    onAccept();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-pro-max w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-white/10 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Privacy Gateway & Compliance Center
            </h2>
            <p className="text-white/60 mt-2">
              Before you synchronize with the Red Griffin Ecosystem, we must ensure full legal alignment.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-medium text-white/90">Regional Targeting</span>
              </div>
              <p className="text-xs text-white/50">
                We use geolocation to provide sector-specific production rates and legal jurisdictions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="font-medium text-white/90">Identity Analytics</span>
              </div>
              <p className="text-xs text-white/50">
                Data processing for AI-driven career trajectory mapping and industrial verification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Full GDPR & Cyber Security Alignment</h4>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  Your data is encrypted following industry standards. By selecting a path, you agree to the temporary storage of session telemetry for professional matching.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-[10px] text-white/30 max-w-xs text-center sm:text-left">
            By clicking "Accept Compliance", you confirm your identity and authorize the synchronization of your soul trajectory with RG Academy.
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-8 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept Compliance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
