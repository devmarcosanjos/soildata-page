import { FormattedText } from './FormattedText';
import type { TextPart } from './types';

interface ListProps {
  items: (string | TextPart[])[];
  className?: string;
  parentSectionNumber?: string;
}

const baseTextStyle = { fontFamily: "'Lato', sans-serif" };

export function List({ items, className = '', parentSectionNumber }: ListProps) {
  // Se parentSectionNumber for fornecido, renderiza como parágrafos numerados
  if (parentSectionNumber) {
    return (
      <div className={`space-y-4 ${className}`} style={baseTextStyle}>
        {items.map((listItem, listIndex) => {
          const itemNumber = `${parentSectionNumber}.${listIndex + 1}`;
          return (
            <p key={listIndex} className="text-base text-gray-500 leading-relaxed">
              <span className="font-semibold mr-2">{itemNumber}</span>
              <FormattedText text={listItem} />
            </p>
          );
        })}
      </div>
    );
  }

  // Comportamento padrão: lista com bullets
  return (
    <ul
      className={`list-disc list-inside space-y-2 text-base text-gray-500 pl-4 md:pl-5 ${className}`}
      style={baseTextStyle}
    >
      {items.map((listItem, listIndex) => (
        <li key={listIndex} className="leading-relaxed">
          <FormattedText text={listItem} />
        </li>
      ))}
    </ul>
  );
}

