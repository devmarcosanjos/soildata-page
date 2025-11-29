import { useTranslation } from 'react-i18next';
import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import {
  ContentSection,
  List,
  Paragraph,
} from '@/shared/components/RichText';

export function TermsOfUse() {
  const { t } = useTranslation('terms');

  return (
    <DocumentPageLayout title={t('title')}>
      <ContentSection>
        <Paragraph text={t('sections.introduction.paragraph1')} />
      </ContentSection>

      <ContentSection title={t('sections.acceptance.title')} sectionNumber={t('sections.acceptance.sectionNumber')}>
        <List
          parentSectionNumber={t('sections.acceptance.sectionNumber')}
          items={t('sections.acceptance.items', { returnObjects: true }) as string[]}
        />
      </ContentSection>

      <ContentSection title={t('sections.copyright.title')} sectionNumber={t('sections.copyright.sectionNumber')}>
        <Paragraph itemNumber="2.1" text={t('sections.copyright.item2_1')} />
        <Paragraph itemNumber="2.2" text={t('sections.copyright.item2_2')} />
        <Paragraph itemNumber="2.3" text={t('sections.copyright.item2_3')} />
      </ContentSection>

      <ContentSection title={t('sections.standardization.title')} sectionNumber={t('sections.standardization.sectionNumber')}>
        <Paragraph itemNumber="3.1" text={t('sections.standardization.item3_1')} />
        
        <ContentSection title={t('sections.compliance.title')} sectionNumber={t('sections.compliance.sectionNumber')}>
          <Paragraph itemNumber="4.1" text={t('sections.compliance.item4_1')} />
        </ContentSection>

        <ContentSection title={t('sections.conversion.title')} sectionNumber={t('sections.conversion.sectionNumber')}>
          <Paragraph itemNumber="5.1" text={t('sections.conversion.item5_1')} />
        </ContentSection>

        <ContentSection title={t('sections.metadataChanges.title')} sectionNumber={t('sections.metadataChanges.sectionNumber')}>
          <Paragraph itemNumber="6.1" text={t('sections.metadataChanges.item6_1')} />
        </ContentSection>
      </ContentSection>

      <ContentSection title={t('sections.display.title')} sectionNumber={t('sections.display.sectionNumber')}>
        <Paragraph itemNumber="7.1" text={t('sections.display.item7_1')} />
      </ContentSection>

      <ContentSection title={t('sections.preservation.title')} sectionNumber={t('sections.preservation.sectionNumber')}>
        <Paragraph itemNumber="8.1" text={t('sections.preservation.item8_1')} />
        
        <ContentSection title={t('sections.publicAccess.title')} sectionNumber={t('sections.publicAccess.sectionNumber')}>
          <Paragraph itemNumber="9.1" text={t('sections.publicAccess.item9_1')} />
        </ContentSection>
      </ContentSection>

      <ContentSection title={t('sections.userResponsibilities.title')} sectionNumber={t('sections.userResponsibilities.sectionNumber')}>
        <Paragraph text={t('sections.userResponsibilities.paragraph1')} />
        <List 
          parentSectionNumber={t('sections.userResponsibilities.sectionNumber')}
          items={t('sections.userResponsibilities.items', { returnObjects: true }) as string[]}
        />
      </ContentSection>

      <ContentSection title={t('sections.agreement.title')} sectionNumber={t('sections.agreement.sectionNumber')}>
        <Paragraph itemNumber="11.1" text={t('sections.agreement.item11_1')} />
      </ContentSection>

      <ContentSection title={t('sections.changes.title')} sectionNumber={t('sections.changes.sectionNumber')}>
        <Paragraph itemNumber="12.1" text={t('sections.changes.item12_1')} />
      </ContentSection>

      <ContentSection title={t('sections.contact.title')} sectionNumber={t('sections.contact.sectionNumber')}>
        <Paragraph itemNumber="13.1" text={t('sections.contact.item13_1')} />
        <Paragraph text={t('sections.contact.lastUpdate')} />
      </ContentSection>
    </DocumentPageLayout>
  );
}
