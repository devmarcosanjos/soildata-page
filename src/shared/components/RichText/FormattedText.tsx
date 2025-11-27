import type { TextPart } from './types';
import { SOILDATA_LINK_CLASSES } from './constants';

interface FormattedTextProps {
  text: string | TextPart[];
}

export function FormattedText({ text }: FormattedTextProps) {
  if (typeof text === 'string') {
    return <>{text}</>;
  }
  
  return (
    <>
      {text.map((part, index) => {
        if (part.type === 'bold') {
          return <strong key={index}>{part.content}</strong>;
        }
        if (part.type === 'link') {
          return (
            <a
              key={index}
              href={part.href}
              target={part.target || '_blank'}
              rel={part.target === '_blank' ? 'noopener noreferrer' : undefined}
              className={SOILDATA_LINK_CLASSES}
            >
              {part.content}
            </a>
          );
        }
        if (part.type === 'colored') {
          return (
            <span key={index} style={{ color: part.color }}>
              {part.content}
            </span>
          );
        }
        return <span key={index}>{part.content}</span>;
      })}
    </>
  );
}

