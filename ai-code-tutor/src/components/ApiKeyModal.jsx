import { useState, useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import useStore from '../store/useStore';
import './ApiKeyModal.css';

function ApiKeyModal({ onClose }) {
  const { apiKey, setApiKey } = useStore();
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = useCallback(() => {
    if (!inputValue.trim()) {
      alert('Lütfen geçerli bir API anahtarı girin!');
      return;
    }
    setApiKey(inputValue.trim());
    onClose();
  }, [inputValue, setApiKey, onClose]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  }, [handleSave]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>🔐 API Anahtarı Ayarları</h2>
          <button className="btn-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Google Gemini API anahtarınızı girin. Bu anahtarı
            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              {' '}buradan{' '}
            </a>
            alabilirsiniz.
          </p>

          <div className="input-group">
            <label htmlFor="api-key">API Anahtarı:</label>
            <div className="input-wrapper">
              <input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="sk-..."
                className="input"
              />
              <button
                type="button"
                className="btn-toggle"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? '🙈' : '👁'}
              </button>
            </div>
            {inputValue && (
              <p className="api-key-hint">
                ✓ Anahtarın ilk 20 karakteri: {inputValue.substring(0, 20)}...
              </p>
            )}
          </div>

          <div className="modal-warning">
            <strong>⚠️ Güvenlik Uyarısı:</strong>
            <p>API anahtarınızı asla birisiyle paylaşmayın veya herkese açık bir yere koymayın.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            İptal
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
