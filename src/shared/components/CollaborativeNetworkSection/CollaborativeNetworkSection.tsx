import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  Share2,
  CalendarClock,
  Users,
} from 'lucide-react';

const items = [
  { key: 'feedback', Icon: MessageCircle },
  { key: 'shareTech', Icon: Share2 },
  { key: 'events', Icon: CalendarClock },
  { key: 'contacts', Icon: Users },
];

export function CollaborativeNetworkSection() {
  const { t } = useTranslation('home');

  return (
    <section className="py-10 md:py-12 lg:py-14 bg-base-200">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="text-center lg:text-left max-w-xl">
              <p
                className="text-xs md:text-sm tracking-[0.3em] uppercase text-gray-700 mb-3"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {t('collaborativeSection.kicker')}
              </p>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {t('collaborativeSection.title')}
              </h2>
              <p
                className="text-sm md:text-base text-gray-700 leading-relaxed"
                style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}
              >
                {t('collaborativeSection.description')}
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-end gap-6 lg:gap-10">
              {items.map(({ key, Icon }) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center gap-3 min-w-[130px]"
                >
                  <div className="flex items-center justify-center">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-gray-900" strokeWidth={1.7} />
                  </div>
                  <p
                    className="text-[11px] md:text-xs font-semibold tracking-wide uppercase text-gray-900"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {t(`collaborativeSection.items.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
