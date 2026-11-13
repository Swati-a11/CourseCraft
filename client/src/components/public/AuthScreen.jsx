import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from './SiteHeader';

export default function AuthScreen({ title, description, fields, values, onChange, onSubmit, error, busy, action, pendingAction, prompt, alternatePath, alternateAction }) {
  return (
    <div className="cc-public">
      <SiteHeader />
      <main className="cc-container cc-auth">
        <div className="cc-auth-panel">
          <h2>Your next lesson starts here.</h2>
          <ul>
            <li><CalendarDays size={22} aria-hidden="true" /> Make a plan that fits your week</li>
            <li><BookOpen size={22} aria-hidden="true" /> Keep lessons and notes together</li>
            <li><ClipboardList size={22} aria-hidden="true" /> Practice and track your progress</li>
          </ul>
        </div>
        <div className="cc-auth-card">
          <Link className="cc-back" to="/"><ArrowLeft size={17} aria-hidden="true" /> Back to home</Link>
          <h1>{title}</h1>
          <p>{description}</p>
          <form onSubmit={onSubmit}>
            {fields.map(({ name, label, type, autoComplete }) => (
              <label key={name} className="cc-field">
                {label}
                <input name={name} type={type} autoComplete={autoComplete} value={values[name]} onChange={onChange} required />
              </label>
            ))}
            {error && <p role="alert" className="cc-form-error">{error}</p>}
            <button type="submit" className="cc-primary" disabled={busy}>
              {busy ? pendingAction : action} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>
          <p className="cc-auth-switch">{prompt} <Link to={alternatePath}>{alternateAction}</Link></p>
        </div>
      </main>
    </div>
  );
}
