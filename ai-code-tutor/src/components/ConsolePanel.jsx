import { useCallback } from 'react';
import { FiPlay, FiSend, FiTrash2 } from 'react-icons/fi';
import useStore from '../store/useStore';
import geminiService from '../services/geminiService';
import './ConsolePanel.css';

function ConsolePanel() {
  const {
    currentCode,
    consoleOutput,
    addConsoleOutput,
    clearConsole,
    currentExercise,
    apiKey,
    addScore,
    completeExercise
  } = useStore();

  const runCode = useCallback(() => {
    if (!currentCode.trim()) {
      addConsoleOutput({ message: 'Çalıştırılacak kod yok!', type: 'warning' });
      return;
    }

    clearConsole();
    addConsoleOutput({ message: '▶ Kod çalıştırılıyor...', type: 'info' });

    try {
      // Konsolu yakala
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      let hasError = false;

      console.log = (...args) => {
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addConsoleOutput({ message, type: 'log' });
      };

      console.error = (...args) => {
        hasError = true;
        const message = args.map(arg => String(arg)).join(' ');
        addConsoleOutput({ message, type: 'error' });
      };

      console.warn = (...args) => {
        const message = args.map(arg => String(arg)).join(' ');
        addConsoleOutput({ message, type: 'warning' });
      };

      // Kodu çalıştır
      eval(currentCode);

      // Konsolü restore et
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      if (!hasError) {
        addConsoleOutput({ message: '✓ Kod başarıyla çalıştırıldı', type: 'success' });
      }
    } catch (error) {
      addConsoleOutput({ message: `❌ Hata: ${error.message}`, type: 'error' });
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }
  }, [currentCode, addConsoleOutput, clearConsole]);

  const sendToAI = useCallback(async () => {
    if (!apiKey) {
      addConsoleOutput({ message: '⚠ Lütfen önce API anahtarını ayarlayın!', type: 'warning' });
      return;
    }

    if (!currentExercise) {
      addConsoleOutput({ message: '⚠ Lütfen önce bir egzersiz yükleyin!', type: 'warning' });
      return;
    }

    if (!currentCode.trim()) {
      addConsoleOutput({ message: '⚠ Lütfen önce kod yazın!', type: 'warning' });
      return;
    }

    addConsoleOutput({ message: '🤖 AI değerlendirme başladı...', type: 'info' });

    try {
      const consoleText = consoleOutput
        .map(output => output.message)
        .join('\n');

      const hasError = consoleOutput.some(output => output.type === 'error');

      const result = await geminiService.evaluateCode(
        apiKey,
        currentExercise,
        currentCode,
        consoleText,
        hasError
      );

      addConsoleOutput({ message: '--- AI DEĞERLENDİRMESİ ---', type: 'info' });
      addConsoleOutput({ message: result.feedback, type: 'log' });
      addConsoleOutput({ message: `Puan: ${result.score}/100`, type: 'success' });

      if (result.score >= 70) {
        addScore(currentExercise.points || 10);
        completeExercise(currentExercise.id, result.score);
        addConsoleOutput({ message: `✨ +${currentExercise.points || 10} puan kazandınız!`, type: 'success' });
      }
    } catch (error) {
      addConsoleOutput({ message: `❌ Değerlendirme hatası: ${error.message}`, type: 'error' });
    }
  }, [apiKey, currentExercise, currentCode, consoleOutput, addConsoleOutput, addScore, completeExercise]);

  const handleClearConsole = useCallback(() => {
    clearConsole();
  }, [clearConsole]);

  return (
    <div className="panel console-panel">
      <div className="panel-header">
        <h2>🖥 Konsol</h2>
        <button
          className="btn btn-sm btn-ghost"
          onClick={handleClearConsole}
          title="Konsolu temizle"
        >
          <FiTrash2 /> Temizle
        </button>
      </div>

      <div className="console-output">
        {consoleOutput.length === 0 ? (
          <div className="console-empty">
            <p>Konsol çıktısı burada görünecek...</p>
          </div>
        ) : (
          consoleOutput.map((output, idx) => (
            <div key={idx} className={`console-line console-${output.type}`}>
              <span className="console-time">{output.timestamp}</span>
              <span className="console-message">{output.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="panel-footer">
        <button
          className="btn btn-primary"
          onClick={runCode}
          title="Kodu çalıştır (F5)"
        >
          <FiPlay /> Çalıştır
        </button>
        <button
          className="btn btn-success"
          onClick={sendToAI}
          title="Kodunuzu AI'ya gönder ve değerlendir"
        >
          <FiSend /> AI'ya Gönder
        </button>
      </div>
    </div>
  );
}

export default ConsolePanel;
