import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Placeholder temporário - substitua pela imagem real quando disponível
// Para adicionar a imagem: coloque repository-screenshot.png em src/assets/
const repositoryScreenshot = 'https://picsum.photos/1200/800';

export function RepositoryPreviewSection() {
  const { t } = useTranslation('home');

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-[var(--color-orange-background)]">
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
              </div>

              <div className="order-2 lg:order-1 flex justify-center">
                <div className="mockup-browser border border-gray-300 bg-base-100 w-full max-w-2xl lg:max-w-3xl">
                  <div className="mockup-browser-toolbar">
                    <div className="input text-xs sm:text-sm md:text-base lg:text-lg bg-white break-all">
                      https://soildata.mapbiomas.org/dataverse/soildata
                    </div>
                  </div>
                  <div className="flex justify-center bg-base-100 overflow-hidden">
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
