import { FiSettings, FiStar, FiTrendingUp } from 'react-icons/fi';
import useStore from '../store/useStore';
import './Header.css';

function Header({ onSettingsClick }) {
  const { totalScore, currentLevel, userStats } = useStore();

  const getLevelName = (level) => {
    const levels = ['Başlangıç', 'Gelişen', 'Orta', 'İleri', 'Yüksek', 'Uzman', 'Master', 'Efsane', 'Usta', 'Guru'];
    return levels[level - 1] || 'Başlangıç';
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="robot-icon">🤖</span>
          <h1>AI Kod Öğretmen</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="stat">
          <FiStar />
          <span>{totalScore} Puan</span>
        </div>
        <div className="stat">
          <FiTrendingUp />
          <span>Seviye {currentLevel} - {getLevelName(currentLevel)}</span>
        </div>
        <div className="stat">
          <span>🔥 {userStats.streak} Seri</span>
        </div>
        <button className="settings-btn" onClick={onSettingsClick}>
          <FiSettings />
        </button>
      </div>
    </header>
  );
}

export default Header;
