import type { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto ${className}`}>
      <div className="pt-0 space-y-9">
        {children}
      </div>
    </div>
  );
}

