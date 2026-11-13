import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardList, FileText, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/public/SiteHeader';
import './public.css';

const features = [
  { icon: CalendarDays, title: 'Make a study plan', description: 'Turn a goal into a schedule that fits the time you have.' },
  { icon: FileText, title: 'Review your notes', description: 'Summarize videos and PDFs into notes you can come back to.' },
  { icon: ClipboardList, title: 'Test what you know', description: 'Practice with quizzes and see which topics need another look.' },
];

function WorkspacePreview() {
  return (
    <figure className="cc-preview">
      <figcaption><BookOpen size={16} aria-hidden="true" /> Example study plan</figcaption>
      <div className="cc-preview-body">
        <div className="cc-preview-title">
          <h2>JavaScript fundamentals</h2>
          <span className="cc-preview-week">Week 1</span>
        </div>
        <div className="cc-progress-label"><span>Weekly progress</span><strong>1 of 3 complete</strong></div>
        <progress max={3} value={1} aria-label="Weekly progress" />
        <ul className="cc-lessons">
          <li><span className="cc-lesson-icon cc-done"><Check size={17} aria-hidden="true" /></span><div><strong>Variables and types</strong><small>Completed</small></div></li>
          <li><span className="cc-lesson-icon cc-next"><Play size={16} aria-hidden="true" /></span><div><strong>Functions and scope</strong><small>Up next · Lesson</small></div></li>
          <li><span className="cc-lesson-icon"><ClipboardList size={17} aria-hidden="true" /></span><div><strong>Quick knowledge check</strong><small>Practice quiz</small></div></li>
        </ul>
      </div>
    </figure>
  );
}

export default function HeroPage() {
  return (
    <div className="cc-public">
      <SiteHeader showAccountLinks />
      <main>
        <section className="cc-container cc-hero">
          <div className="cc-hero-copy">
            <h1>Learn at your pace.<br /><em>Keep your place.</em></h1>
            <p>Pick a skill and build an AI study plan around your schedule. Keep lessons, notes, and quizzes together so you always know what to study next.</p>
            <div className="cc-actions">
              <Link className="cc-primary" to="/register">Get started <ArrowRight size={18} aria-hidden="true" /></Link>
              <a className="cc-secondary" href="#features">Explore features</a>
            </div>
          </div>
          <WorkspacePreview />
        </section>
        <section id="features" className="cc-container cc-features" aria-labelledby="features-title">
          <h2 id="features-title">From first lesson to final quiz</h2>
          <div className="cc-feature-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title}>
                <span className="cc-feature-icon"><Icon size={23} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="cc-container cc-footer">
        <span>CourseCraft</span>
        <Link to="/register">Create an account <ArrowRight size={16} aria-hidden="true" /></Link>
      </footer>
    </div>
  );
}
