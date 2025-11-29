import { useTranslation } from 'react-i18next';
import { ContentSection } from '@/shared/components/RichText';
import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import { Subtitle } from '@/shared/components/RichText';
import { Paragraph } from '@/shared/components/RichText';

export function Faq() {
  const { t } = useTranslation('faq');
  
  return (
    <DocumentPageLayout title={t('title')}>

      <ContentSection title={t('sections.aboutSoildata.title')}>
        <Subtitle text={t('sections.aboutSoildata.questions.difference.question')} />
        <Paragraph text={t('sections.aboutSoildata.questions.difference.answer')} />
      </ContentSection>

      <ContentSection title={t('sections.accessData.title')}>
        <Subtitle text={t('sections.accessData.questions.febrPackage.question')} />
        <Paragraph text={t('sections.accessData.questions.febrPackage.answer')} />
      </ContentSection>

      <ContentSection title={t('sections.submission.title')}>
        <Subtitle text={t('sections.submission.questions.intellectualProperty.question')} />
        <Paragraph text={t('sections.submission.questions.intellectualProperty.answer')} />
      </ContentSection>

    </DocumentPageLayout>
  );
}
