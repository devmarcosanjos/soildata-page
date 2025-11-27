import { ContentSection } from '@/shared/components/RichText';
import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import { Subtitle } from '@/shared/components/RichText';
import { Paragraph } from '@/shared/components/RichText';

export function Faq() {
  return (
    <DocumentPageLayout title="FAQ">

      <ContentSection title="Sobre o Soildata">
        <Subtitle text="Qual a diferença entre o SoilData e o MapBiomas Solo?" />
        <Paragraph text="O SoilData é o repositório onde os dados pontuais de perfis 
        e amostras são armazenados e preservados. O MapBiomas Solo é uma iniciativa que utiliza esses dados como treinamento 
        para gerar mapas espaciais contínuos (geoespaciais) de atributos do solo para todo o Brasil." />
      </ContentSection>

      <ContentSection title="Acesso aos Dados e Ferramentas (Para Usuários)">
        <Subtitle text="O pacote febr para R parou de funcionar. Como acesso os dados agora?" />
        <Paragraph text="Com a migração para a infraestrutura Dataverse, o pacote febr antigo perdeu a compatibilidade. 
        Recomendamos agora o uso do pacote dataverse (cliente oficial para R) para acessar os dados via API, ou o download 
        direto dos arquivos .csv ou .txt através da interface web do portal SoilData. Estamos trabalhando para atualizar as 
        ferramentas de acesso facilitado." />
      </ContentSection>

      <ContentSection title="Submissão e Propriedade Intelectual (Para Autores)">
        <Subtitle text="Quem mantém a propriedade intelectual e qual licença devo escolher?" />
        <Paragraph text="Os autores originais mantêm a titularidade e a autoria moral dos dados. 
        Diferente de repositórios que exigem uma licença única, o SoilData oferece flexibilidade: no momento do depósito, 
        você pode selecionar a licença de uso que julgar mais apropriada para o seu conjunto de dados. É possível, inclusive, 
        optar por manter o acesso aos dados restrito (por exemplo, durante o período de elaboração de um artigo). 
        Em todos os casos, recomendamos fortemente que você leia os Termos de Uso do repositório para entender as implicações de 
        cada escolha." />
      </ContentSection>

    </DocumentPageLayout>
  );
}
