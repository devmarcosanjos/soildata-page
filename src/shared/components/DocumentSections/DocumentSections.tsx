import { Section as RichTextSection } from '@/shared/components/RichText';
import type { Section as RichTextSectionType } from '@/shared/components/RichText/types';

const joinClasses = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface DocumentSectionsProps {
  sections: RichTextSectionType[];
  containerClassName?: string;
}

export function DocumentSections({ sections, containerClassName }: DocumentSectionsProps) {
  return (
    <div className={joinClasses('space-y-9', containerClassName)}>
      {sections.map((section, sectionIndex) => (
        <RichTextSection key={section.title ?? `section-${sectionIndex}`} section={section} sectionIndex={sectionIndex} />
      ))}
    </div>
  );
}
