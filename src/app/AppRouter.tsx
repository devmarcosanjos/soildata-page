import { Suspense } from 'react';
import { LanguageRouter } from './LanguageRouter';

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <LanguageRouter />
    </Suspense>
  );
}
