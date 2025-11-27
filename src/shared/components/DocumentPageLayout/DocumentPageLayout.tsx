import type { ReactNode } from 'react';

import { HeroPageLayout } from '@/shared/components/HeroPageLayout';

const joinClassNames = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface DocumentPageLayoutProps {
  title: string;
  children: ReactNode;
  wrapperClassName?: string;
  cardClassName?: string;
}

export function DocumentPageLayout({
  title,
  children,
  wrapperClassName,
  cardClassName,
}: DocumentPageLayoutProps) {
  return (
    <HeroPageLayout title={title}>
      <div className={joinClassNames('max-w-5xl mx-auto', wrapperClassName)}>
        <section
          className={joinClassNames(
            cardClassName,
          )}
        >
          {children}
        </section>
      </div>
    </HeroPageLayout>
  );
}
