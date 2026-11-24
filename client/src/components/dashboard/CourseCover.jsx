import { useState } from 'react';
import { Binary, BookOpen, Braces, Database, Globe } from 'lucide-react';

function getCourseStyle(title = '') {
  const name = title.toLowerCase();
  if (/data structures|algorithm|\bdsa\b/.test(name)) return { icon: Binary, label: 'DATA & ALGORITHMS', variant: 'algorithm' };
  if (/react|javascript|typescript|frontend|front.end/.test(name)) return { icon: Braces, label: 'WEB DEVELOPMENT', variant: 'web' };
  if (/database|mongodb|sql/.test(name)) return { icon: Database, label: 'DATABASES', variant: 'database' };
  if (/web|mern|full.stack/.test(name)) return { icon: Globe, label: 'WEB DEVELOPMENT', variant: 'web' };
  return { icon: BookOpen, label: 'LEARNING JOURNEY', variant: 'general' };
}

export default function CourseCover({ title, image }) {
  const [failedImage, setFailedImage] = useState(null);
  const { icon: Icon, label, variant } = getCourseStyle(title);
  if (image && failedImage !== image) {
    return <img src={image} alt="" className="cc-course-cover-image" loading="lazy" onError={() => setFailedImage(image)} />;
  }
  return (
    <div className={`cc-course-cover cc-course-cover--${variant}`} aria-hidden="true">
      <div className="cc-cover-grid" />
      <span className="cc-cover-label">COURSECRAFT / {label}</span>
      <div className="cc-cover-art">
        <span className="cc-cover-orbit cc-cover-orbit-one" />
        <span className="cc-cover-orbit cc-cover-orbit-two" />
        <span className="cc-cover-icon"><Icon size={44} strokeWidth={1.35} /></span>
        <span className="cc-cover-spark cc-cover-spark-one">✳</span>
        <span className="cc-cover-spark cc-cover-spark-two">✦</span>
      </div>
      <span className="cc-cover-bottom">LEARN SOMETHING NEW <span>↗</span></span>
    </div>
  );
}
