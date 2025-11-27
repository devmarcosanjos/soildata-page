import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import {
  ContentSection,
  List,
  Paragraph,
} from '@/shared/components/RichText';
import { Caption } from '@mapbiomas/ui';
import fluxoSoildata from '@/assets/fluxo-soildata.png';

export function Curation() {
  return (
    <DocumentPageLayout title="CURADORIA DE DADOS">
      <ContentSection>
        <Paragraph text="O SoilData segue um processo de trabalho detalhado para garantir a qualidade e a reusabilidade dos dados de solo. O processo é estruturado e se inicia com o resgate, uma etapa que exige uma busca detalhada para localizar trabalhos já realizados, disponíveis ou não, neste caso contatando diretamente os autores." />
        <Paragraph text="Não se trata somente de buscar, mas de saber definir as características de interesse, utilizar a pesquisa bibliográfica para identificar autores-chave e mobilizar uma rede de contatos para acessar as fontes de dados relevantes. Uma vez localizados, os dados são encaminhados à equipe de resgate."/>
        <Paragraph text="O trabalho principal do resgate é transferir os dados originais para a planilha modelo do repositório, que está dividida em sete abas:" />
        <List
          items={[
            'A aba Identificação contém os metadados essenciais (autor, licença, título e descrição) para identificação e citação dos autores;',
            'A aba Evento registra o contexto da coleta (local, momento e condições ambientais);',
            'A aba Camada armazena os dados brutos das análises químicas, físicas, biológicas e morfo-mecânicas;',
            'As abas Método do Evento e Método da Camada descrevem os protocolos de campo e laboratoriais, respectivamente;',
            'A aba Validação verifica a consistência dos dados, cruzando identificadores para apontar omissões ou erros;',
            'E a aba Dicionário oferece valores pré-preenchidos (como unidades de medida) para padronizar o preenchimento.'
          ]}
        />

        <Paragraph text="Em seguida, os dados passam por controle de qualidade, realizada pela equipe de curadoria, que assegura a coerência e a precisão das informações, checando, por exemplo, as somas percentuais (como da granulometria), a fidelidade das descrições dos métodos, a compatibilidade da localização dos pontos de coleta com o ambiente descrito e a identificação de valores químicos que extrapolam faixas aceitáveis." />
        <Paragraph text="Quando inconsistências são detectadas, opta-se por contatar os autores, e caso o contato não seja bem-sucedido, a equipe pode corrigir os valores mais discrepantes (registrando a alteração em nota) ou manter a informação original, adicionando uma nota de alerta." />
        <Paragraph text="Após essa revisão rigorosa, o trabalho é submetido para revisão final do curador chefe, que realiza uma última e decisiva verificação. Somente após essa aprovação, os dados são publicados e disponibilizados ao público sob a licença de uso definida pelos autores. Se um usuário encontrar qualquer inconsistência após a publicação, ele poderá informar a equipe do SoilData via email (contato@mapbiomas.org), a qual fará os ajustes necessários de forma transparente. A Figura 1 abaixo demonstra o fluxo de trabalho que o Repositório desempenha. " />
      </ContentSection>
      <ContentSection>        
        <div className="flex flex-col items-center justify-center text-gray-500 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontSize: '10px' }}>
        <img src={fluxoSoildata} alt="Figura 1. Fluxograma de trabalho do Repositório SoilData" width={300} height={300} className="mx-auto" />
        <div className="caption-no-expand">
          <Caption layers={[{ id: 'fluxo-curadoria', view: 'compact', title: 'Figura 1. Fluxograma de trabalho do Repositório SoilData', category: { labels: { title: 'Figura 1. Fluxograma de trabalho do Repositório SoilData', styleTitle: 'Figura 1. Fluxograma de trabalho do Repositório SoilData' } } }]} />
        </div>
        </div>
     </ContentSection>

    
    </DocumentPageLayout>
  );
}
