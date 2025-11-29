import React, { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedBeam } from '@/registry/magicui/animated-beam';
import { cn } from '@/shared/utils/cn';

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
          'z-10 flex size-12 items-center justify-center rounded-full border-2 border-(--color-orange-primary) bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.5)]',
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

Circle.displayName = 'Circle';

export function DataConnectionSection() {
  const { t } = useTranslation('home');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const source1Ref = useRef<HTMLDivElement | null>(null);
  const source2Ref = useRef<HTMLDivElement | null>(null);
  const source3Ref = useRef<HTMLDivElement | null>(null);
  const soilDataRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-(--color-bg-light)">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-700"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {t('dataConnectionSection.title')}
              </h2>
              <p
                className="text-base md:text-lg text-gray-500 leading-relaxed mb-4 md:mb-6"
                style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}
              >
                {t('dataConnectionSection.description')}
              </p>
              <p
                className="text-sm md:text-base text-gray-500 leading-relaxed"
                style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px' }}
              >
                {t('dataConnectionSection.helper')}
              </p>
            </div>

            <div
              ref={containerRef}
              className="relative flex h-[320px] sm:h-[360px] md:h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl bg-white border border-base-300 p-6 md:p-8"
            >
              <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-6">
                <div className="flex flex-col justify-center gap-4">
                  <Circle ref={source1Ref} className="text-xs md:text-sm">
                    {t('dataConnectionSection.sources.field')}
                  </Circle>
                  <Circle ref={source2Ref} className="text-xs md:text-sm">
                    {t('dataConnectionSection.sources.laboratory')}
                  </Circle>
                  <Circle ref={source3Ref} className="text-xs md:text-sm">
                    {t('dataConnectionSection.sources.legacy')}
                  </Circle>
                </div>
                <div className="flex flex-col justify-center">
                  <Circle
                    ref={soilDataRef}
                    className="size-16 text-xs md:text-sm font-semibold bg-(--color-orange-primary) text-white border-(--color-orange-primary)"
                  >
                    SoilData
                  </Circle>
                </div>
                <div className="flex flex-col justify-center">
                  <Circle ref={userRef} className="text-xs md:text-sm">
                    {t('dataConnectionSection.target')}
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
                fromRef={soilDataRef}
                toRef={userRef}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

