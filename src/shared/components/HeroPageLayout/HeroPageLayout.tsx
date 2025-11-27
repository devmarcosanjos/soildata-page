import { type ReactNode } from 'react';
import soloImage from '@/assets/solo.png';

interface HeroPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function HeroPageLayout({ title, children }: HeroPageLayoutProps) {
  return (
    <div className="relative">
      {/* Background com altura máxima de 500px */}
      <div 
        className="h-[500px] w-full relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${soloImage})` }}
      >
        {/* Overlay semi-transparente */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      </div>
      
      {/* Container central com caixa branca semi-transparente - posicionado sobre o background */}
      <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 lg:px-8 -mt-[400px] relative z-10 mb-8 min-h-0">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Título acima da caixa branca */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4" 
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {title}
          </h1>
          
          {/* Linha decorativa abaixo do título */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-white rotate-45"></div>
            <div className="h-px bg-white flex-1 max-w-4xl mx-2"></div>
            <div className="w-2 h-2 bg-white rotate-45"></div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 md:p-12 lg:p-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
