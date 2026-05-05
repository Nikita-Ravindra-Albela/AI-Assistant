import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Sidebar } from './components/Sidebar';
import { NotebookView } from './views/NotebookView';
import { LineageView } from './views/LineageView';
import { DataProvider, useData } from './services/dataContext';
import { TableSchema } from './types';
import { mockUploadFile } from './services/mockApi';
import { UploadCloud, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-zinc-950 text-red-500">
          <div className="text-center p-8 border border-zinc-800 rounded-lg bg-black">
            <AlertTriangle size={48} className="mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Something went wrong.</h1>
            <p className="text-sm text-zinc-400 mb-4">The application encountered a critical error.</p>
            <pre className="text-xs bg-zinc-900 p-4 rounded text-left overflow-auto max-w-lg mx-auto">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const MainContent = () => {
  const [currentView, setCurrentView] = useState('notebook');
  const { dataState } = useData();

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} appMode="dark" />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {currentView === 'notebook' ? <NotebookView /> : <LineageView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </ErrorBoundary>
  );
}
