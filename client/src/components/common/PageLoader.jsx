import { BookOpen } from 'lucide-react';

export default function PageLoader({ text = 'Preparing your learning space…' }) {
  return (
    <div className="cc-page-loader" role="status" aria-live="polite">
      <div className="cc-loader-art" aria-hidden="true">
        <span className="cc-loader-halo" />
        <span className="cc-loader-orbit cc-loader-orbit-outer" />
        <span className="cc-loader-orbit cc-loader-orbit-inner" />
        <span className="cc-loader-mark"><BookOpen size={25} strokeWidth={1.7} /></span>
      </div>
      <div className="cc-loader-copy">
        <span className="cc-loader-label">COURSECRAFT</span>
        <p>{text}</p>
        <span className="cc-loader-track" aria-hidden="true"><span /></span>
      </div>
    </div>
  );
}
