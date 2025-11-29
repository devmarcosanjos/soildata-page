import { useTranslation } from 'react-i18next';
import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import {
  ContentSection,
  List,
  Paragraph,
  Subtitle,
} from '@/shared/components/RichText';
import { SOILDATA_COLOR_80 } from '@/shared/components/RichText/constants';

export function Privacy() {
  const { t } = useTranslation('privacy');

  return (
    <DocumentPageLayout title={t('title')}>
      <ContentSection>
        <Paragraph text={t('sections.introduction.paragraph1')} />
        <Paragraph text={t('sections.introduction.paragraph2')} />
      </ContentSection>

      <ContentSection>
        <Paragraph text={t('sections.introduction.paragraph3')} />
        <List items={t('sections.introduction.items', { returnObjects: true }) as string[]} />
      </ContentSection>

      <ContentSection title={t('sections.dataCollection.title')}>
        <Paragraph text={t('sections.dataCollection.paragraph1')} />
        <Subtitle text={t('sections.dataCollection.voluntary.subtitle')} />
        <Paragraph text={t('sections.dataCollection.voluntary.paragraph1')} />
        <List items={t('sections.dataCollection.voluntary.items1', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.dataCollection.voluntary.paragraph2')} />
        <List items={t('sections.dataCollection.voluntary.items2', { returnObjects: true }) as string[]} />

        <Subtitle text={t('sections.dataCollection.automatic.subtitle')} />
        <Paragraph text={t('sections.dataCollection.automatic.paragraph1')} />
        <List items={t('sections.dataCollection.automatic.items', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.dataCollection.automatic.paragraph2')} />

        <Subtitle text={t('sections.dataCollection.thirdParty.subtitle')} />
        <Paragraph text={t('sections.dataCollection.thirdParty.paragraph1')} />
        <List items={t('sections.dataCollection.thirdParty.items', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.dataCollection.thirdParty.paragraph2')} />

        <Subtitle text={t('sections.dataCollection.historical.subtitle')} />
        <Paragraph text={t('sections.dataCollection.historical.paragraph1')} />
        <List items={t('sections.dataCollection.historical.items', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.dataCollection.historical.paragraph2')} />
      </ContentSection>

      <ContentSection title={t('sections.dataUsage.title')}>
        <Paragraph text={t('sections.dataUsage.paragraph1')} />
        <List items={t('sections.dataUsage.items', { returnObjects: true }) as string[]} />

        <Subtitle text={t('sections.dataUsage.service.subtitle')} />
        <List
          items={(t('sections.dataUsage.service.items', { returnObjects: true }) as Array<{ bold: string; text: string }>).map((item) => [
            { type: 'bold' as const, content: item.bold },
            { type: 'text' as const, content: item.text },
          ])}
        />

        <Subtitle text={t('sections.dataUsage.contact.subtitle')} />
        <List
          items={(t('sections.dataUsage.contact.items', { returnObjects: true }) as Array<{ bold: string; text: string }>).map((item) => [
            { type: 'bold' as const, content: item.bold },
            { type: 'text' as const, content: item.text },
          ])}
        />

        <Subtitle text={t('sections.dataUsage.sharing.subtitle')} />
        <List
          items={(t('sections.dataUsage.sharing.items', { returnObjects: true }) as Array<{ bold: string; text: string }>).map((item) => [
            { type: 'bold' as const, content: item.bold },
            { type: 'text' as const, content: item.text },
          ])}
        />
      </ContentSection>

      <ContentSection title={t('sections.dataSecurity.title')}>
        <Paragraph text={t('sections.dataSecurity.paragraph1')} />
        <List items={t('sections.dataSecurity.items', { returnObjects: true }) as string[]} />
      </ContentSection>

      <ContentSection title={t('sections.yourRights.title')}>
        <Paragraph text={t('sections.yourRights.paragraph1')} />
        <List items={t('sections.yourRights.items', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.yourRights.paragraph2')} />

        <Subtitle text={t('sections.yourRights.access.subtitle')} />
        <Paragraph text={t('sections.yourRights.access.paragraph1')} />
        <Paragraph text={t('sections.yourRights.access.paragraph2')} />

        <Subtitle text={t('sections.yourRights.rectification.subtitle')} />
        <Paragraph text={t('sections.yourRights.rectification.paragraph1')} />

        <Subtitle text={t('sections.yourRights.deletion.subtitle')} />
        <Paragraph text={t('sections.yourRights.deletion.paragraph1')} />
        <Paragraph text={t('sections.yourRights.deletion.paragraph2')} />
        <Paragraph text={t('sections.yourRights.deletion.paragraph3')} />

        <Subtitle text={t('sections.yourRights.restriction.subtitle')} />
        <Paragraph text={t('sections.yourRights.restriction.paragraph1')} />
        <List items={t('sections.yourRights.restriction.items', { returnObjects: true }) as string[]} />
        <Paragraph text={t('sections.yourRights.restriction.paragraph2')} />

        <Subtitle text={t('sections.yourRights.objection.subtitle')} />
        <Paragraph text={t('sections.yourRights.objection.paragraph1')} />
        <Paragraph text={t('sections.yourRights.objection.paragraph2')} />
        <Paragraph text={t('sections.yourRights.objection.paragraph3')} />
        <List items={t('sections.yourRights.objection.items', { returnObjects: true }) as string[]} />

        <Subtitle text={t('sections.yourRights.complaints.subtitle')} />
        <Paragraph text={t('sections.yourRights.complaints.paragraph1')} />
      </ContentSection>

      <ContentSection title={t('sections.contact.title')}>
        <Paragraph
          text={[
            { type: 'text' as const, content: t('sections.contact.paragraph1') },
            { type: 'link' as const, content: t('sections.contact.email'), href: `mailto:${t('sections.contact.email')}` },
            { type: 'text' as const, content: '.' },
          ]}
        />
        <Paragraph text={t('sections.contact.paragraph2')} />

        <Subtitle text={t('sections.contact.controller.subtitle')} />
        <Paragraph
          text={[
            { type: 'text' as const, content: t('sections.contact.controller.paragraph1') },
            { type: 'link' as const, content: t('sections.contact.controller.link'), href: t('sections.contact.controller.linkHref'), target: '_blank' },
            { type: 'text' as const, content: '.' },
          ]}
        />

        <Subtitle text={t('sections.contact.operator.subtitle')} />
        <Paragraph text={t('sections.contact.operator.paragraph1')} />
      </ContentSection>

      <ContentSection title={t('sections.changes.title')}>
        <Paragraph text={t('sections.changes.paragraph1')} />
        <Subtitle
          text={[
            { type: 'colored' as const, content: t('sections.changes.lastUpdate'), color: SOILDATA_COLOR_80 },
            { type: 'colored' as const, content: t('sections.changes.date'), color: SOILDATA_COLOR_80 },
          ]}
        />
        <Subtitle text={t('sections.changes.paragraph2')} />
      </ContentSection>
    </DocumentPageLayout>
  );
}
