import type { ReactNode } from 'react';
import { Title } from './Title';

interface ContentSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  sectionNumber?: string;
}

export function ContentSection({ title, children, className = '', sectionNumber }: ContentSectionProps) {
  return (
    <article className={`space-y-8 ${title ? 'pt-8' : ''} ${className}`}>
      {title && <Title sectionNumber={sectionNumber}>{title}</Title>}
      <div className="space-y-4">
        {children}
      </div>
    </article>
  );
}

