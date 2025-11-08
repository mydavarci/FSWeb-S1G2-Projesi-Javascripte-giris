import { useState, useEffect } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import TaskPanel from './components/TaskPanel';
import CodeEditor from './components/CodeEditor';
import ConsolePanel from './components/ConsolePanel';
import ApiKeyModal from './components/ApiKeyModal';
import LoadingOverlay from './components/LoadingOverlay';
import './App.css';

function App() {
  const { apiKey } = useStore();
  const [showApiModal, setShowApiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // İlk yüklemede API anahtarı yoksa modal'ı göster
    if (!apiKey) {
      setShowApiModal(true);
    }
  }, [apiKey]);

  return (
    <div className="app">
      <Header onSettingsClick={() => setShowApiModal(true)} />

      <div className="main-container">
        <TaskPanel setIsLoading={setIsLoading} />
        <CodeEditor />
        <ConsolePanel />
      </div>

      {showApiModal && (
        <ApiKeyModal onClose={() => setShowApiModal(false)} />
      )}

      {isLoading && <LoadingOverlay />}
    </div>
  );
}

export default App;
