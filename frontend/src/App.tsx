import { useState } from 'react';
import { ToastProvider, DesignSystemShowcase, Button } from './design-system';
import { Layout } from './components/layout';
import { HomePage } from './components/home';

export function App() {
  const [viewMode, setViewMode] = useState<'homepage' | 'design-system'>('homepage');

  return (
    <ToastProvider>
      {viewMode === 'design-system' ? (
        <div>
          <div className="bg-[#2A1E17] text-[#FAF6F0] p-3 text-center text-xs font-semibold flex items-center justify-center gap-4">
            <span>Viewing Design System Tokens & Components</span>
            <Button
              variant="gold"
              size="sm"
              onClick={() => setViewMode('homepage')}
            >
              Switch to Luxury Homepage →
            </Button>
          </div>
          <DesignSystemShowcase />
        </div>
      ) : (
        <Layout>
          <HomePage />
        </Layout>
      )}
    </ToastProvider>
  );
}

export default App;
