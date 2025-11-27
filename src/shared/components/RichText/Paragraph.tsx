import { FormattedText } from './FormattedText';
import type { TextPart } from './types';

interface ParagraphProps {
  children?: string | TextPart[];
  text?: string | TextPart[];
  className?: string;
  itemNumber?: string;
}

const baseTextStyle = { fontFamily: "'Lato', sans-serif" };

export function Paragraph({ children, text, className = '', itemNumber }: ParagraphProps) {
  const content = children || text || '';
  
  return (
    <p
      className={`text-base text-gray-500 leading-relaxed ${className}`}
      style={baseTextStyle}
    >
      {itemNumber && <span className="font-semibold mr-2">{itemNumber}</span>}
      {typeof content === 'string' ? content : <FormattedText text={content} />}
    </p>
  );
}

