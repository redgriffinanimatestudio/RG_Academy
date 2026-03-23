import React from 'react';
import i18n from '../i18n';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = i18n.t('error_occurred');
      
      try {
        // Check if error message is a JSON string from handleFirestoreError
        const errInfo = JSON.parse(this.state.error?.message || "");
        if (errInfo && errInfo.error) {
          errorMessage = `Firestore Error: ${errInfo.error} (${errInfo.operationType} on ${errInfo.path})`;
        }
      } catch (e) {
        // Not a JSON string, use default or error message
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 max-w-md">
            <h2 className="text-xl font-bold mb-2">{i18n.t('app_error')}</h2>
            <p className="text-sm opacity-90">{errorMessage}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-neutral-900 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            {i18n.t('reload_app')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
