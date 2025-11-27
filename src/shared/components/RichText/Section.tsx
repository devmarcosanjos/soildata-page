import { Paragraph } from './Paragraph';
import { Subtitle } from './Subtitle';
import { List } from './List';
import type { Section as SectionType } from './types';

interface SectionProps {
  section: SectionType;
  sectionIndex: number;
}

const baseTextStyle = { fontFamily: "'Lato', sans-serif" };

export function Section({ section, sectionIndex }: SectionProps) {
  const sectionKey = section.title ?? `section-${sectionIndex}`;

  return (
    <article key={sectionKey} className="space-y-4">
      {section.title && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800" style={baseTextStyle}>
          {section.title}
        </h2>
      )}

      <div className="space-y-4">
        {section.items.map((item, itemIndex) => {
          const itemKey = `${sectionIndex}-${itemIndex}`;

          if (item.type === 'paragraph') {
            return <Paragraph key={`paragraph-${itemKey}`} text={item.text} />;
          }

          if (item.type === 'subtitle') {
            return <Subtitle key={`subtitle-${itemKey}`} text={item.text} />;
          }

          return <List key={`list-${itemKey}`} items={item.items} />;
        })}
      </div>
    </article>
  );
}

