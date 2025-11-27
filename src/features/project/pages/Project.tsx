import { DocumentPageLayout } from "@/shared/components/DocumentPageLayout";
import { ContentSection, Paragraph, Subtitle } from "@/shared/components/RichText";

export function Project() {
  return (
   <DocumentPageLayout title="O PROJETO">
             <ContentSection title="O projeto SoilData">
               <Subtitle text="lorem ipsum" />
               <Paragraph text="lorem ipsum lorem lorem" />
             </ContentSection>
       </DocumentPageLayout>
  );
}
