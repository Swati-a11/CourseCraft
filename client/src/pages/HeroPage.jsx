import { ArrowDown, ArrowRight, BookOpen, CalendarDays, Check, ClipboardList, FileText, Play, Sparkles, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/public/SiteHeader';
import './public.css';

const features = [
  { number: '01', icon: CalendarDays, title: 'A plan that fits you', description: 'Turn your next big goal into a study plan built around your schedule.', tag: 'PLAN YOUR PATH' },
  { number: '02', icon: FileText, title: 'Make knowledge stick', description: 'Keep notes and explore your documents when you need a little clarity.', tag: 'LEARN WITH CONTEXT' },
  { number: '03', icon: ClipboardList, title: 'See how far you’ve come', description: 'Practice what you know, track your progress, and keep moving forward.', tag: 'KEEP GROWING' },
];

function WorkspacePreview() {
  return (
    <div className="cc-stage">
      <div className="cc-stage-orbit cc-stage-orbit-one" aria-hidden="true" />
      <div className="cc-stage-orbit cc-stage-orbit-two" aria-hidden="true" />
      <div className="cc-stage-spark cc-stage-spark-one" aria-hidden="true">✦</div>
      <div className="cc-stage-spark cc-stage-spark-two" aria-hidden="true">✳</div>
      <figure className="cc-preview">
        <figcaption><span><BookOpen size={16} aria-hidden="true" /> YOUR WORKSPACE</span><span className="cc-preview-dots" aria-hidden="true"><i/><i/><i/></span></figcaption>
        <div className="cc-preview-body">
          <div className="cc-preview-welcome"><span>YOUR NEXT CHAPTER</span><Sparkles size={16} aria-hidden="true" /></div>
          <div className="cc-preview-title"><h2>JavaScript<br /><em>fundamentals.</em></h2><span className="cc-preview-week">WEEK 01</span></div>
          <p className="cc-preview-description">A little progress, every day.</p>
          <div className="cc-progress-label"><span>Your progress</span><strong>1 of 3 lessons</strong></div>
          <progress className="cc-progress" max={3} value={1} aria-label="Example progress: one of three lessons" />
          <ul className="cc-lessons">
            <li><span className="cc-lesson-icon cc-done"><Check size={17} aria-hidden="true" /></span><div><strong>Variables and types</strong><small>Completed</small></div><Check className="cc-lesson-check" size={16} aria-hidden="true" /></li>
            <li><span className="cc-lesson-icon cc-next"><Play size={16} aria-hidden="true" /></span><div><strong>Functions and scope</strong><small>Up next · Lesson</small></div><ArrowRight className="cc-lesson-check" size={16} aria-hidden="true" /></li>
            <li><span className="cc-lesson-icon"><ClipboardList size={17} aria-hidden="true" /></span><div><strong>Quick knowledge check</strong><small>Practice quiz</small></div></li>
          </ul>
        </div>
      </figure>
      <div className="cc-float-note" aria-hidden="true"><span><WandSparkles size={17}/></span><div><strong>Made for your goals</strong><small>Your learning, your pace.</small></div></div>
      <div className="cc-stage-caption">A LITTLE PREVIEW OF WHAT'S POSSIBLE</div>
    </div>
  );
}

export default function HeroPage() {
  return (
    <div className="cc-public cc-landing">
      <SiteHeader showAccountLinks />
      <main>
        <div className="cc-hero-band">
          <section className="cc-container cc-hero">
            <div className="cc-hero-copy">
              <div className="cc-hero-kicker"><span className="cc-kicker-dot" /> A MORE THOUGHTFUL WAY TO LEARN <Sparkles size={13} aria-hidden="true" /></div>
              <h1>Curiosity<br />looks good <em>on you.</em></h1>
              <p>Big goals start with small steps. Create an AI study plan, keep your notes together, and make progress at your own pace.</p>
              <div className="cc-actions"><Link className="cc-primary" to="/register">Start learning <ArrowRight size={18} aria-hidden="true" /></Link><a className="cc-secondary" href="#features">See how it works <ArrowDown size={16} aria-hidden="true" /></a></div>
              <div className="cc-hero-footnote"><span className="cc-footnote-line"/> YOUR SPACE TO LEARN, GROW &amp; CREATE</div>
            </div>
            <WorkspacePreview />
          </section>
          <div className="cc-marquee" aria-hidden="true"><div><span>MAKE A PLAN <b>✳</b> FIND YOUR FOCUS <b>✳</b> KEEP GROWING <b>✳</b> LEARN SOMETHING NEW <b>✳</b></span><span>MAKE A PLAN <b>✳</b> FIND YOUR FOCUS <b>✳</b> KEEP GROWING <b>✳</b> LEARN SOMETHING NEW <b>✳</b></span></div></div>
        </div>
        <section id="features" className="cc-container cc-features" aria-labelledby="features-title">
          <div className="cc-features-heading"><div><span className="cc-section-label">THE LEARNING EXPERIENCE / 01—03</span><h2 id="features-title">A little structure.<br /><em>A lot of possibility.</em></h2></div><p>Everything you need to make learning feel a little less overwhelming, and a lot more yours.</p></div>
          <div className="cc-feature-grid">{features.map(({ number, icon: Icon, title, description, tag }) => <article key={title}><div className="cc-feature-top"><span className="cc-feature-icon"><Icon size={23} aria-hidden="true" /></span><span>{number} / 03</span></div><div><p className="cc-feature-tag">{tag}</p><h3>{title}</h3><p>{description}</p></div><ArrowRight className="cc-feature-arrow" size={18} aria-hidden="true" /></article>)}</div>
        </section>
        <section className="cc-container cc-final-wrap"><div className="cc-final"><span className="cc-section-label">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to make<br /><em>something of it?</em></h2><p>Your next favorite skill is waiting.</p><Link className="cc-primary" to="/register">Get started <ArrowRight size={18} aria-hidden="true" /></Link><span className="cc-final-spark" aria-hidden="true">✳</span></div></section>
      </main>
      <footer className="cc-container cc-footer"><span>CourseCraft <small> / MADE FOR CURIOUS MINDS</small></span><Link to="/register">Create an account <ArrowRight size={16} aria-hidden="true" /></Link></footer>
    </div>
  );
}
