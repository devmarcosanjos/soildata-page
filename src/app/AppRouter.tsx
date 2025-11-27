import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { appRoutes } from './routes';

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
}
