import { Section } from './Section';
import type { Section as SectionType } from './types';

interface ContentRendererProps {
  sections: SectionType[];
  className?: string;
}

export function ContentRenderer({ sections, className = '' }: ContentRendererProps) {
  return (
    <div className={`max-w-5xl mx-auto ${className}`}>
      <div className="pt-0 space-y-9">
        {sections.map((section, sectionIndex) => (
          <Section key={sectionIndex} section={section} sectionIndex={sectionIndex} />
        ))}
      </div>
    </div>
  );
}

