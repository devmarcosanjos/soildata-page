import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import {
  ContentSection,
  List,
  Paragraph,
} from '@/shared/components/RichText';

export function TermsOfUse() {
  return (
    <DocumentPageLayout title="TERMOS DE USO">
      <ContentSection>
        <Paragraph
          text="Bem-vindo ao SoilData, o repositório brasileiro de dados de pesquisa em ciência do solo (a seguir referido como 'Repositório'). Ao acessar ou utilizar o Repositório, você concorda em estar vinculado a estes Termos e Condições de Uso (a seguir referidos como 'Termos'). Leia atentamente estes Termos antes de utilizar o Repositório."
        />
      </ContentSection>

      <ContentSection title="Aceitação dos Termos" sectionNumber="1">
        <List
          parentSectionNumber="1"
          items={[
            'Ao depositar dados de pesquisa no Repositório, você reconhece que leu e concorda integralmente com estes Termos.',
            'Você declara ser o criador/autor dos dados de pesquisa ou ter obtido permissão do criador/autor para depositar quaisquer dados de pesquisa no Repositório.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Direitos Autorais e Licença" sectionNumber="2">
        <Paragraph itemNumber="2.1" text="Para administrar adequadamente e preservar o conteúdo para uso futuro, o Repositório requer certas permissões e garantias em relação aos direitos autorais dos dados de pesquisa depositados. Se a lei de direitos autorais for aplicável ao envio dos dados de pesquisa e você for o proprietário dos direitos autorais, ao aceitar estes Termos, você ainda mantém os direitos autorais de seu trabalho e o direito de enviar os dados de pesquisa a editores ou outros repositórios." />
        <Paragraph itemNumber="2.2" text="Se os direitos autorais forem aplicáveis e você não for o proprietário dos direitos autorais, você declara que o proprietário dos direitos autorais lhe deu permissão irrestrita para disponibilizar os dados de pesquisa publicamente." />
        <Paragraph itemNumber="2.3" text="Ao depositar dados de pesquisa no Repositório, você concede ao MapBiomas o direito não exclusivo de reproduzir, traduzir e distribuir os dados em qualquer formato ou meio em todo o mundo e livre de royalties, incluindo, mas não limitado, a publicação na Internet." />
      </ContentSection>

      <ContentSection title="Padronização e Metadados" sectionNumber="3">
        <Paragraph itemNumber="3.1" text="Os dados de pesquisa a serem publicados no Repositório devem estar em conformidade com as instruções descritas no Guia de Depósito de Dados." />
        
        <ContentSection title="Conformidade com o Guia" sectionNumber="4">
          <Paragraph itemNumber="4.1" text="Os dados de pesquisa depositados estão sujeitos à revisão e aprovação da curadoria antes de serem publicados." />
        </ContentSection>

        <ContentSection title="Conversão e Cópias" sectionNumber="5">
          <Paragraph itemNumber="5.1" text="O Repositório se reserva o direito de converter arquivos de dados e/ou arquivos de metadados depositados em qualquer meio ou formato e fazer cópias dos dados de pesquisa para fins de segurança, backup, preservação e distribuição." />
        </ContentSection>

        <ContentSection title="Alterações nos Metadados" sectionNumber="6">
          <Paragraph itemNumber="6.1" text="A equipe do Repositório pode, se necessário, fazer alterações nos metadados descritivos, incluindo aprimoramentos e correções. Quaisquer alterações de metadados descritivos serão rastreadas por meio do controle de versão automatizado do Repositório. Seus dados de pesquisa não serão alterados sem sua permissão." />
        </ContentSection>
      </ContentSection>


      <ContentSection title="Exibição de Informações" sectionNumber="7">
        <Paragraph itemNumber="7.1" text="O nome do depositante é exibido junto dos dados de pesquisa publicados, assim como os termos de uso selecionados pelo depositante." />
      </ContentSection>

      <ContentSection title="Política de Preservação e Acesso Público" sectionNumber="8">
        <Paragraph itemNumber="8.1" text="O Repositório se compromete a preservar os dados de pesquisa publicados de acordo com a Política de Preservação de Dados." />
        
        <ContentSection title="Acesso Público" sectionNumber="9">
          <Paragraph itemNumber="9.1" text="O Repositório se compromete a fornecer acesso público aos dados de pesquisa por meio da manutenção de páginas da web persistentes, registros de metadados descritivos e identificadores, e a fornecer métricas de acesso, que podem incluir visualizações de páginas, downloads e citações." />
        </ContentSection>
      </ContentSection>

      <ContentSection title="Responsabilidades do Usuário" sectionNumber="10">
        <Paragraph text="Você entende que é responsável por:" />
        <List 
          parentSectionNumber="10"
          items={[
            "Garantir que tem o direito de conceder os direitos contidos nestes Termos;",
            "Garantir que, até onde você sabe, nada nos dados de pesquisa infringe os direitos autorais de terceiros ou outros direitos de propriedade intelectual;",
            "Obter permissão irrestrita do proprietário dos direitos autorais para depositar material de terceiros no Repositório, identificando claramente tal material no conteúdo dos dados de pesquisa;",
            "Garantir que nada nos dados de pesquisa viole quaisquer termos, como acordos de confidencialidade ou termos de uso;",
            "Não incluir informações privadas, confidenciais, proprietárias de terceiros, informações de exportação controlada, dados protegidos ou informações que não devam ser compartilhadas publicamente;",
            "Garantir que nada nos dados de pesquisa contenha vírus de software, códigos de computador, arquivos ou programas capazes de permitir acesso não autorizado ou interromper, danificar, limitar ou interferir no funcionamento adequado do Repositório ou do software, hardware ou equipamento de telecomunicações de outros usuários;",
            "Notificar o Repositório sobre quaisquer alterações nos termos de direitos autorais ou propriedade dos dados de pesquisa;",
            "Cumprir todas as obrigações exigidas pelo contrato ou acordo com uma agência ou organização se os dados forem baseados em trabalho patrocinado ou apoiado por essa entidade."

          ]}
        />
      </ContentSection>

      <ContentSection title="Concordância com os Termos" sectionNumber="11">
        <Paragraph itemNumber="11.1" text="Ao utilizar o Repositório, você concorda integralmente com estes Termos de Uso." />
      </ContentSection>

      <ContentSection title="Alterações nos Termos" sectionNumber="12">
        <Paragraph itemNumber="12.1" text="O Repositório se reserva o direito de modificar estes Termos a qualquer momento. Quaisquer alterações nos Termos entrarão em vigor imediatamente após serem publicadas no Repositório. O seu uso contínuo do Repositório após a publicação de alterações nos Termos significa que você concorda com as alterações." />
      </ContentSection>

      <ContentSection title="Contato" sectionNumber="13">
        <Paragraph itemNumber="13.1"text="Se você não concordar com os itens acima ou tiver dúvidas, entre em contato com a equipe do Repositório pelo e-mail contato@mapbiomas.org antes de depositar dados no Repositório." />

        <Paragraph text="Data da última atualização: 2025-09-18" />
      </ContentSection>

      

    </DocumentPageLayout>
  );
}

