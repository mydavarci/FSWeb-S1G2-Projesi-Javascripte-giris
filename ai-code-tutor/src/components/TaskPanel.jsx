import { useState } from 'react';
import { FiRefreshCw, FiHelpCircle } from 'react-icons/fi';
import useStore from '../store/useStore';
import geminiService from '../services/geminiService';
import './TaskPanel.css';

function TaskPanel({ setIsLoading }) {
  const {
    apiKey,
    currentTopic,
    currentLevel,
    currentExercise,
    setCurrentExercise,
    addExerciseToPool,
    getNextExercise,
    useHint,
    addConsoleOutput
  } = useStore();

  const [loading, setLoading] = useState(false);

  const loadNewExercise = async () => {
    if (!apiKey) {
      alert('Lütfen önce API anahtarını ayarlayın!');
      return;
    }

    setLoading(true);
    setIsLoading(true);

    try {
      let exercise = getNextExercise();

      if (!exercise) {
        addConsoleOutput({ message: `Seviye ${currentLevel} için yeni egzersizler yükleniyor...`, type: 'info' });

        const exercises = await geminiService.generateExercises(
          apiKey,
          currentTopic,
          currentLevel,
          10,
          1
        );

        addExerciseToPool(currentTopic, `level${currentLevel}`, exercises);
        exercise = exercises[0];
      }

      setCurrentExercise(exercise);
      addConsoleOutput({ message: 'Yeni egzersiz yüklendi!', type: 'success' });
    } catch (error) {
      addConsoleOutput({ message: `Hata: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (!currentExercise) {
      alert('Önce bir egzersiz yükleyin!');
      return;
    }

    setLoading(true);

    try {
      const hint = await geminiService.getHint(apiKey, currentExercise, '');
      addConsoleOutput({ message: '💡 İpucu: ' + hint, type: 'warning' });
      useHint();
    } catch (error) {
      addConsoleOutput({ message: `İpucu alınamadı: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel task-panel">
      <div className="panel-header">
        <h2>📝 Görev</h2>
        {currentExercise && (
          <div className="difficulty-badge">
            <span>{currentExercise.difficulty}</span>
            <span>+{currentExercise.points} puan</span>
          </div>
        )}
      </div>

      <div className="panel-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>AI görev hazırlıyor...</p>
          </div>
        ) : currentExercise ? (
          <div className="task-content">
            <h3>{currentExercise.title}</h3>
            <p className="description">{currentExercise.description}</p>

            <div className="requirements">
              <h4>Gereksinimler:</h4>
              <ul>
                {currentExercise.requirements && currentExercise.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {currentExercise.starterCode && (
              <div className="starter-code">
                <h4>Başlangıç Kodu:</h4>
                <pre><code>{currentExercise.starterCode}</code></pre>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>Henüz egzersiz yüklenmedi.</p>
            <p>Başlamak için "Yeni Egzersiz" butonuna tıklayın!</p>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <button
          className="btn btn-primary"
          onClick={loadNewExercise}
          disabled={loading}
        >
          <FiRefreshCw /> Yeni Egzersiz
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleGetHint}
          disabled={loading || !currentExercise}
        >
          <FiHelpCircle /> İpucu (-2p)
        </button>
      </div>
    </div>
  );
}

export default TaskPanel;
