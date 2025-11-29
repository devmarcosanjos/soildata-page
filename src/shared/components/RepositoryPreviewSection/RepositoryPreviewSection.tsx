import type React from 'react';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Database, FileText, TextSearch, User } from 'lucide-react';
import { AnimatedBeam } from '@/registry/magicui/animated-beam';
import { cn } from '@/shared/utils/cn';

// Placeholder temporário - substitua pela imagem real quando disponível
// Para adicionar a imagem: coloque repository-screenshot.png em src/assets/
const repositoryScreenshot = 'https://picsum.photos/1200/800';

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
          'z-10 flex items-center justify-center rounded-full border-2 border-(--color-orange-primary) bg-white shadow-[0_0_20px_-12px_rgba(0,0,0,0.5)]',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = 'Circle';

export function RepositoryPreviewSection() {
  const { t } = useTranslation('home');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const source1Ref = useRef<HTMLDivElement | null>(null);
  const source2Ref = useRef<HTMLDivElement | null>(null);
  const source3Ref = useRef<HTMLDivElement | null>(null);
  const soilDataRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-(--color-orange-background)">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <div className="rounded-2xl bg-white/90 shadow-sm border border-base-300 px-4 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {t('repositorySection.title')}
                </h2>

                <p
                  className="text-base md:text-lg text-gray-500 leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0"
                  style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}
                >
                  {t('repositorySection.description')}
                </p>

                <div className="flex justify-center lg:justify-start">
                  <Link 
                    to="/repository" 
                    className="btn btn-lg soildata-primary-btn"
                  >
                    {t('repositorySection.ctaButton')}
                  </Link>
                </div>

                <div
                  ref={containerRef}
                  className="relative mt-8 h-40 sm:h-48 md:h-52 w-full flex items-center justify-center overflow-hidden"
                >
                  <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col justify-center gap-3 sm:gap-4">
                      <Circle
                        ref={source1Ref}
                        className="size-14 md:size-18"
                      >
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange-primary)" />
                      </Circle>
                      <Circle
                        ref={source2Ref}
                        className="size-14 md:size-18"
                      >
                        <TextSearch className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange-primary)" />
                      </Circle>
                      <Circle
                        ref={source3Ref}
                        className="size-14 md:size-18"
                      >
                        <Database className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange-primary)" />
                      </Circle>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Circle
                        ref={soilDataRef}
                        className="size-18 md:size-22 flex items-center justify-center bg-white border-(--color-orange-primary)"
                      >
                        <img
                          src="/soildata-favicon.png"
                          alt="SoilData"
                          className="h-8 w-8 md:h-10 md:w-10 object-contain"
                        />
                      </Circle>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Circle
                        ref={userRef}
                        className="size-14 md:size-18"
                      >
                        <User className="w-4 h-4 md:w-5 md:h-5 text-(--color-orange-primary)" />
                      </Circle>
                    </div>
                  </div>

                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={source1Ref}
                    toRef={soilDataRef}
                  />
                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={source2Ref}
                    toRef={soilDataRef}
                  />
                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={source3Ref}
                    toRef={soilDataRef}
                  />
                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={userRef}
                    toRef={soilDataRef}
                  />
                </div>
              </div>

              <div className="order-2 lg:order-1 flex justify-center">
                <div className="mockup-browser border border-gray-300 bg-white w-full max-w-2xl lg:max-w-3xl">
                  <div className="mockup-browser-toolbar">
                    <div className="input text-xs sm:text-sm md:text-base lg:text-lg bg-white break-all">
                      https://soildata.mapbiomas.org/dataverse/soildata
                    </div>
                  </div>
                  <div className="flex justify-center bg-white overflow-hidden">
                    <img 
                      src={repositoryScreenshot} 
                      alt={t('repositorySection.imageAlt')}
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
