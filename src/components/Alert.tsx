import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default';

interface AlertOptions {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  isSoft?: boolean;
}

interface AlertContextType {
  showAlert: (options: Omit<AlertOptions, 'id'>) => void;
  hideAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertOptions[]>([]);

  const showAlert = useCallback((options: Omit<AlertOptions, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert = { ...options, id };
    setAlerts((prev) => [...prev, newAlert]);

    if (options.duration !== 0) {
      setTimeout(() => {
        hideAlert(id);
      }, options.duration || 5000);
    }
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-md pointer-events-none">
        <AnimatePresence>
          {alerts.map((alert) => (
            <AlertComponent key={alert.id} alert={alert} onClose={() => hideAlert(alert.id)} />
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};

const AlertComponent: React.FC<{ alert: AlertOptions; onClose: () => void }> = ({ alert, onClose }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'success': return <CheckCircle2 className="size-5" />;
      case 'error': return <AlertCircle className="size-5" />;
      case 'warning': return <AlertTriangle className="size-5" />;
      case 'info': return <Info className="size-5" />;
      default: return <Info className="size-5" />;
    }
  };

  const getAlertClass = () => {
    const base = 'alert shadow-lg pointer-events-auto relative overflow-hidden';
    const soft = alert.isSoft ? 'alert-soft' : '';
    const type = alert.type !== 'default' ? `alert-${alert.type}` : '';
    return `${base} ${soft} ${type} flex items-start gap-4 p-4`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      layout
      className={getAlertClass()}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {alert.title && <h5 className="text-sm font-black uppercase tracking-widest">{alert.title}</h5>}
        <p className="text-sm font-medium opacity-90">{alert.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
      
      {/* Progress bar for auto-hide */}
      {alert.duration !== 0 && (
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (alert.duration || 5000) / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
        />
      )}
    </motion.div>
  );
};
