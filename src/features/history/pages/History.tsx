import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import { ContentSection, Paragraph, Subtitle } from '@/shared/components/RichText';

export function History() {
  return (
    <DocumentPageLayout title="HISTÓRIA">
          <ContentSection title="História do SoilData">
            <Subtitle text="lorem ipsum" />
            <Paragraph text="lorem ipsum lorem lorem" />
          </ContentSection>
    </DocumentPageLayout>
  );
}
