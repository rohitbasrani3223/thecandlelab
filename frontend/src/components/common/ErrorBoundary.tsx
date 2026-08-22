import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL [ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleClearCacheAndReset = () => {
    try {
      localStorage.removeItem('tcl_selected_product');
      localStorage.removeItem('tcl_selected_article');
      localStorage.removeItem('tcl_admin_active_tab');
      localStorage.removeItem('tcl_last_shipping_address');
    } catch {}
    window.location.hash = '#home';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF6F8] text-[#1C1217] p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#F5E8EE] shadow-card text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F4] border border-[#F9B8CA] flex items-center justify-center mx-auto text-2xl">
              🕯️
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-2xl text-[#1C1217]">
                {this.props.fallbackTitle || 'The Candle Lab'}
              </h2>
              <p className="text-xs sm:text-sm text-[#624855] leading-relaxed">
                An unexpected issue occurred while rendering this page. Your cart and stored selections are safe.
              </p>
            </div>

            {/* Error Detail Display (safe preview) */}
            {this.state.error && (
              <div className="p-3 bg-[#FFF6F8] rounded-xl border border-[#F5E8EE] text-left text-[11px] font-mono text-[#E87A96] overflow-x-auto max-h-32">
                <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#E87A96] hover:bg-[#D46581] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleClearCacheAndReset}
                className="flex-1 py-3 px-4 bg-white hover:bg-[#FAF6F8] text-[#624855] border border-[#F5E8EE] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
