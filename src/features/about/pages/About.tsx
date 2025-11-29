import { useTranslation } from 'react-i18next';
import { HeroPageLayout } from '@/shared/components/HeroPageLayout';

export function About() {
  const { t } = useTranslation('about');
  
  return (
    <HeroPageLayout title={t('title')}>
      {/* Texto introdutório */}
      <div className="mb-8 md:mb-12">
        <p className="text-base text-gray-500 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
          {t('intro')}
        </p>
      </div>

      {/* COORDENAÇÃO */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.coordination.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.coordination.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* PARCEIROS DE TECNOLOGIA */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.techPartners.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.techPartners.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* PARCEIROS INSTITUCIONAIS */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.institutionalPartners.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.institutionalPartners.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* MEMBROS ANTERIORES */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.formerMembers.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.formerMembers.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* FINANCIAMENTO */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.funding.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.funding.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>

      {/* USUÁRIOS APOIADORES */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('sections.supportingUsers.title')}
        </h2>
        <ul className="list-none space-y-2">
          {(t('sections.supportingUsers.members', { returnObjects: true }) as string[]).map((member, index) => (
            <li key={index} className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
              {member}
            </li>
          ))}
        </ul>
      </div>
    </HeroPageLayout>
  );
}
