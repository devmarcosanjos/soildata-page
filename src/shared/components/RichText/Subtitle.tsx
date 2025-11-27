import { FormattedText } from './FormattedText';
import type { TextPart } from './types';

interface SubtitleProps {
  children?: string | TextPart[];
  text?: string | TextPart[];
  className?: string;
}

const baseTextStyle = { fontFamily: "'Lato', sans-serif" };

export function Subtitle({ children, text, className = '' }: SubtitleProps) {
  const content = children || text || '';
  
  return (
    <h3
      className={`text-lg md:text-xl font-semibold text-gray-700 ${className}`}
      style={baseTextStyle}
    >
      {typeof content === 'string' ? content : <FormattedText text={content} />}
    </h3>
  );
}

