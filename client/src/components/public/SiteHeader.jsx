import { BookOpen, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function SiteHeader({ showAccountLinks = false }) {
  const { isLight, toggleTheme } = useTheme();

  return (
    <header className="cc-header">
      <div className="cc-container cc-header-row">
        <Link className="cc-brand" to="/">
          <span className="cc-brand-icon"><BookOpen size={20} aria-hidden="true" /></span>
          CourseCraft
        </Link>
        <nav aria-label="Main navigation" className="cc-nav">
          {showAccountLinks && <a className="cc-nav-feature" href="#features">Features</a>}
          {showAccountLinks && <Link to="/login">Sign in</Link>}
          <button className="cc-theme" type="button" onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}>
            {isLight ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
