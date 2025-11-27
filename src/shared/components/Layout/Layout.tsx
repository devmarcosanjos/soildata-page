import { type ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-[65px]">
        <div className="max-w-[1920px] mx-auto w-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
