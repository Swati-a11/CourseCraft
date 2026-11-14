import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <button className="cc-theme" type="button" onClick={toggleTheme} aria-label={label} title={label}>
      {isLight ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}
    </button>
  );
}
