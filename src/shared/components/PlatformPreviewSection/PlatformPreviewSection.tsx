import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Placeholder temporário - substitua pela imagem real quando disponível
// Para adicionar a imagem: coloque platform-screenshot.png em src/assets/
const platformScreenshot = 'https://picsum.photos/1200/800';

export function PlatformPreviewSection() {
  const { t } = useTranslation('home');

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center text-base-content">
            {t('platformSection.title')}
          </h2>
          
          <p className="text-base md:text-lg text-center text-base-content/80 mb-6 md:mb-8 max-w-3xl mx-auto">
            {t('platformSection.description')}
          </p>

          <div className="flex justify-center mb-6 md:mb-8 px-2 md:px-4">
            <div className="mockup-browser border border-gray-500 w-full max-w-5xl">
              <div className="mockup-browser-toolbar">
                <div className="input text-xs sm:text-sm md:text-base truncate bg-white">https://soildata.mapbiomas.org/platform</div>
              </div>
              <div className="flex justify-center overflow-hidden">
                <img 
                  src={platformScreenshot} 
                  alt={t('platformSection.imageAlt')}
                  className="w-full h-auto object-contain max-h-[400px] sm:max-h-[500px] md:max-h-[600px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              to="/platform" 
              className="btn btn-lg"
              style={{ backgroundColor: '#EA580C', borderColor: '#EA580C', color: 'white' }}
            >
              {t('platformSection.ctaButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

