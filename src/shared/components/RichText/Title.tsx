import type { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  className?: string;
  sectionNumber?: string;
}

const baseTextStyle = { fontFamily: "'Lato', sans-serif" };

export function Title({ children, className = '', sectionNumber }: TitleProps) {
  return (
    <h2 
      className={`text-2xl md:text-3xl font-bold text-gray-800 ${className}`}
      style={baseTextStyle}
    >
      {sectionNumber && <span className="mr-2">{sectionNumber}.</span>}
      {children}
    </h2>
  );
}

