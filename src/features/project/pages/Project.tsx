import { useTranslation } from 'react-i18next';
import { DocumentPageLayout } from "@/shared/components/DocumentPageLayout";
import { ContentSection, Paragraph, Subtitle } from "@/shared/components/RichText";

export function Project() {
  const { t } = useTranslation('project');
  
  return (
   <DocumentPageLayout title={t('title')}>
             <ContentSection title={t('sections.projectSoildata.title')}>
               <Subtitle text={t('sections.projectSoildata.subtitle')} />
               <Paragraph text={t('sections.projectSoildata.paragraph')} />
             </ContentSection>
       </DocumentPageLayout>
  );
}
