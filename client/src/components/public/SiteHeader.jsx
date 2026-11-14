import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

export default function SiteHeader({ showAccountLinks = false }) {
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
