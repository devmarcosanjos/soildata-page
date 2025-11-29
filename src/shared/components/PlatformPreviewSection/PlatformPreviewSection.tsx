import type React from 'react';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { AnimatedBeam } from '@/registry/magicui/animated-beam';
import { cn } from '@/shared/utils/cn';

// Placeholder temporário - substitua pela imagem real quando disponível
// Para adicionar a imagem: coloque platform-screenshot.png em src/assets/
const platformScreenshot = 'https://picsum.photos/1200/800';

interface CircleProps {
  className?: string;
  children?: React.ReactNode;
}

const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-10 flex items-center justify-center rounded-full border-2 border-[var(--color-orange-primary)] bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.5)]',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = 'Circle';

export function PlatformPreviewSection() {
  const { t } = useTranslation('home');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const soilDataRef = useRef<HTMLDivElement | null>(null);
  const platformRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-[var(--color-orange-background)]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <div className="rounded-2xl bg-white/90 shadow-sm border border-base-300 px-4 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {t('platformSection.title')}
                </h2>

                <p
                  className="text-base md:text-lg text-gray-500 leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0"
                  style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}
                >
                  {t('platformSection.description')}
                </p>

                <div className="flex justify-center lg:justify-start">
                  <Link 
                    to="/platform" 
                    className="btn btn-lg soildata-primary-btn"
                  >
                    {t('platformSection.ctaButton')}
                  </Link>
                </div>

                <div
                  ref={containerRef}
                  className="relative mt-8 h-32 sm:h-40 md:h-44 w-full flex items-center justify-center overflow-hidden"
                >
                  <div className="flex size-full max-w-md sm:max-w-lg flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col justify-center">
                      <Circle
                        ref={soilDataRef}
                        className="size-14 md:size-16 bg-white border-[var(--color-orange-primary)]"
                      >
                        <img
                          src="/soildata-favicon.png"
                          alt="SoilData"
                          className="h-7 w-7 md:h-8 md:w-8 object-contain"
                        />
                      </Circle>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Circle
                        ref={platformRef}
                        className="h-10 md:h-12 px-4 sm:px-6 min-w-[96px] md:min-w-[120px]"
                      >
                        <span
                          className="text-xs md:text-sm font-semibold text-gray-700"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {t('platformSection.nodeLabel')}
                        </span>
                      </Circle>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Circle
                        ref={userRef}
                        className="size-14 md:size-16"
                      >
                        <User className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-orange-primary)]" />
                      </Circle>
                    </div>
                  </div>

                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={soilDataRef}
                    toRef={platformRef}
                  />
                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={platformRef}
                    toRef={userRef}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="mockup-browser border border-gray-300 bg-base-100 w-full max-w-2xl lg:max-w-3xl">
                  <div className="mockup-browser-toolbar">
                    <div className="input text-xs sm:text-sm md:text-base lg:text-lg bg-white break-all">
                      https://soildata.mapbiomas.org/platform
                    </div>
                  </div>
                  <div className="flex justify-center bg-base-100 overflow-hidden">
                    <img 
                      src={platformScreenshot} 
                      alt={t('platformSection.imageAlt')}
                      className="w-full h-auto object-contain max-h-[260px] sm:max-h-[320px] md:max-h-[380px] lg:max-h-[420px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
