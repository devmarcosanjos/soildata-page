import { type ReactNode, Children, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemsPerView {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

interface CarouselProps {
  children: ReactNode;
  itemsPerView?: ItemsPerView;
  className?: string;
}

export function Carousel({ 
  children, 
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  className = '' 
}: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const getItemWidth = () => {
    const { mobile = 1, tablet = 2, desktop = 3 } = itemsPerView;
    
    const mobileWidth = mobile === 1 ? 'w-full' : `w-[calc((100%-1rem*${mobile-1})/${mobile})]`;
    
    let tabletWidth = '';
    if (tablet === 2) tabletWidth = 'md:w-[calc((100%-1rem)/2)]';
    else if (tablet === 3) tabletWidth = 'md:w-[calc((100%-2rem)/3)]';
    else if (tablet === 4) tabletWidth = 'md:w-[calc((100%-3rem)/4)]';
    else tabletWidth = `md:w-[calc((100%-1rem*${tablet-1})/${tablet})]`;
    
    let desktopWidth = '';
    if (desktop === 2) desktopWidth = 'lg:w-[calc((100%-1rem)/2)]';
    else if (desktop === 3) desktopWidth = 'lg:w-[calc((100%-2rem)/3)]';
    else if (desktop === 4) desktopWidth = 'lg:w-[calc((100%-3rem)/4)]';
    else desktopWidth = `lg:w-[calc((100%-1rem*${desktop-1})/${desktop})]`;
    
    return `${mobileWidth} ${tabletWidth} ${desktopWidth}`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const itemWidthClass = getItemWidth();
  const childrenArray = Children.toArray(children);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <button
        onClick={() => scroll('left')}
        className="btn btn-circle btn-sm shrink-0 shadow-lg transition-all duration-300 carousel-button"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div 
        ref={carouselRef}
        className="carousel carousel-center flex-1 gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {childrenArray.map((child, index) => (
          <div key={index} className={`carousel-item ${itemWidthClass} shrink-0`}>
            {child}
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="btn btn-circle btn-sm shrink-0 shadow-lg transition-all duration-300 carousel-button"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

