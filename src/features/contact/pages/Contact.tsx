import { useTranslation } from 'react-i18next';
import { HeroPageLayout } from '@/shared/components/HeroPageLayout';
import { FileSearch, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Contact() {
  const { t } = useTranslation('contact');
  
  return (
    <HeroPageLayout title={t('title')}>
      <div className="space-y-10">
        <section className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('contactInfo.title')}</h2>
          <p className="text-sm text-gray-500 mb-6">
            {t('contactInfo.description')}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="flex gap-4">
              <Mail size={24} className="text-[#EA580C]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('contactInfo.email.label')}</p>
                <p className="text-sm text-gray-600">{t('contactInfo.email.value')}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('suggestions.title')}</h2>
          <div className="flex gap-4">
            <FileSearch size={24} className="text-[#EA580C]" />
            <Link to="https://forms.gle/VnQxYsayNXqcL9ix8" target="_blank" className='hover:underline hover:text-[#EA580C]/80 transition-all'>{t('suggestions.survey')}</Link>
          </div>
          
        </section>
      </div>
    </HeroPageLayout>
  );
}
