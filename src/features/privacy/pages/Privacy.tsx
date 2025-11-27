import { DocumentPageLayout } from '@/shared/components/DocumentPageLayout';
import {
  ContentSection,
  List,
  Paragraph,
  Subtitle,
} from '@/shared/components/RichText';
import { SOILDATA_COLOR_80 } from '@/shared/components/RichText/constants';

export function Privacy() {
  return (
    <DocumentPageLayout title="POLÍTICA DE PRIVACIDADE">
        <ContentSection>
          <Paragraph
            text="Este Aviso de Privacidade descreve como o SoilData, repositório de dados de pesquisa operado pelo MapBiomas ('nós', 'nosso' ou 'organização'), coleta, utiliza e protege as informações pessoais dos usuários. Os usuários do SoilData incluem usuários administrativos, depositantes, usuários finais, pessoas vinculadas aos dados de pesquisa e pessoas identificadas nos dados de pesquisa."
          />
          <Paragraph
            text="Dados pessoais são informações que podem ser vinculadas a você, como pessoa. Eles podem incluir dados que podem ser diretamente relacionados a uma pessoa específica e dados que, por si só, não identificam um indivíduo, mas se tornam pessoais quando combinados com outras informações."
          />
        </ContentSection>

        <ContentSection>
          <Paragraph text="Dados pessoais são informações que podem ser vinculadas a você, como pessoa. Eles podem incluir:" />
          <List
            items={[
              'Dados que podem ser diretamente relacionados a uma pessoa específica.',
              'Dados que, por si só, não identificam um indivíduo, mas se tornam pessoais quando combinados com outras informações',
            ]}
          />
        </ContentSection>

        <ContentSection title="Coleta de Dados">
          <Paragraph text="Reunimos dados a seu respeito de quatro maneiras distintas: voluntariamente, automaticamente, por meio de terceiros e por meio de resgate histórico." />
          <Subtitle text="Fornecimento voluntário" />
          <Paragraph text="Você opta por fornecer dados pessoais voluntariamente nas seguintes circunstâncias:" />
          <List
            items={[
              'Ao criar uma conta.',
              'Ao depositar dados de pesquisa (registrando metadados e carregando arquivos).',
            ]}
          />
          <Paragraph text="Nesses casos, você fornece os seguintes dados pessoais:" />
          <List
            items={[
              'Nome completo (civil ou social)',
              'Senha',
              'Endereço de e-mail',
              'Vínculo empregatício (afiliação)',
              'Posição/profissão (opcional)',
              'Identificador em base de dados públicas (ORCID ou similar)',
            ]}
          />

          <Subtitle text="Coleta automática" />
          <Paragraph text="Enquanto você navega pelo SoilData, coletamos automaticamente dados de tráfego e interação com as páginas usando o Google Analytics. Esses dados, gerados pelo seu dispositivo ou navegador, podem incluir:" />
          <List
            items={[
              'Um identificador exclusivo (sequência de caracteres)',
              'O dispositivo que você está usando',
              'Seu endereço IP (com data e hora)',
              'O navegador que você está utilizando',
              'Seu sistema operacional',
              'Sua localização geográfica',
              'Como você chegou até o site',
              'As páginas que você visita',
              'As páginas que você compartilha',
              'A quantidade de tempo que você passa em cada página',
            ]}
          />
          <Paragraph text="Para evitar que o Google Analytics colete seus dados, você pode instalar um add-on de bloqueio de rastreamento no seu navegador, como o 'Google Analytics Opt-out Browser Add-on' ou o 'Privacy Badger' da Electronic Frontier Foundation (EFF)." />

          <Subtitle text="Fornecimento por terceiros" />
          <Paragraph text="Quando um representante ou colaborador deposita dados de pesquisa em nome de um grupo ou equipe, alguns dados pessoais podem ser fornecidos, tanto nos metadados de citação quanto no corpo dos arquivos de dados carregados. Esses dados pessoais podem incluir:" />
          <List
            items={[
              'Nome civil ou social completo',
              'Informações de contato, como endereço de e-mail e postal',
              'Vínculo empregatício (afiliação)',
              'Identificador em base de dados públicas (ORCID ou similar)',
            ]}
          />
          <Paragraph text="É responsabilidade do representante ou colaborador obter o consentimento apropriado das partes envolvidas para compartilhar seus dados pessoais, como endereços de e-mail e postais, se necessário." />

          <Subtitle text="Resgate histórico" />
          <Paragraph text="A equipe do Repositório realiza o resgate de dados históricos de pesquisa (dados legados) disponíveis em fontes públicas, como bibliotecas, bancos de dados e repositórios institucionais. Após a digitalização, esses dados são depositados no Repositório, acompanhados dos respectivos metadados de citação. Nessas circunstâncias, os seguintes dados pessoais públicos, que tenham sido previamente tornados públicos por você ou seu representante ou colaborador, podem ser registrados:" />
          <List
            items={[
              'Nome completo (civil ou social)',
              'Vínculo empregatício (afiliação)',
              'Endereço de e-mail',
            ]}
          />
          <Paragraph text="Você será informado sempre que seus dados pessoais de acesso público forem registrados no Repositório, desde que seu endereço de e-mail também seja público." />
        </ContentSection>

        <ContentSection title="Uso de Dados">
          <Paragraph text="Usamos as informações pessoais coletadas para três finalidades:" />
          <List
            items={[
              'fornecer e melhorar o serviço do SoilData',
              'contato e comunicação',
              'compartilhamento com terceiros.',
            ]}
          />

          <Subtitle text="Fornecer e melhorar o serviço" />
          <List
            items={[
              [
                { type: 'bold', content: 'Exibição de dados: ' },
                {
                  type: 'text',
                  content:
                    'Mostrar o nome do depositante, autores, coautores, coletores de dados e outros colaboradores vinculados aos dados de pesquisa publicados, permitindo a identificação e reconhecimento dos responsáveis pelos dados.',
                },
              ],
              [
                { type: 'bold', content: 'Catalogação: ' },
                {
                  type: 'text',
                  content:
                    'Usar dados pessoais coletados para catalogar informações e metadados relacionados aos dados de pesquisa resgatados, facilitando a organização e pesquisa por parte dos usuários.',
                },
              ],
              [
                { type: 'bold', content: 'Atribuição de créditos: ' },
                {
                  type: 'text',
                  content:
                    'Utilizar dados pessoais para atribuir créditos apropriados aos indivíduos envolvidos na produção dos dados de pesquisa, reconhecendo sua contribuição.',
                },
              ],
              [
                { type: 'bold', content: 'Responsabilização: ' },
                {
                  type: 'text',
                  content:
                    'Permitir a responsabilização das pessoas por trás dos dados de pesquisa, garantindo transparência e responsabilidade na divulgação de dados científicos.',
                },
              ],
              [
                { type: 'bold', content: 'Gerar estatísticas sobre o uso do site: ' },
                {
                  type: 'text',
                  content:
                    'Coletar dados de tráfego e interação com as páginas por meio do Google Analytics, sem identificação pessoal, para gerar estatísticas de uso.',
                },
              ],
              [
                { type: 'bold', content: 'Melhoria contínua: ' },
                {
                  type: 'text',
                  content:
                    'Realizar pesquisas e análises para entender as necessidades dos usuários e direcionar melhorias contínuas nos serviços para tornar a experiência do usuário mais eficaz e agradável.',
                },
              ],
            ]}
          />

          <Subtitle text="Contato e comunicação" />
          <List
            items={[
              [
                { type: 'bold', content: 'Notificações relacionadas ao Repositório: ' },
                {
                  type: 'text',
                  content:
                    'Enviar notificações relacionadas ao Repositório, como atualizações de depósitos de dados de pesquisa, modificações nos Termos e Condições de Uso, Política de Preservação de Dados e neste Aviso de Privacidade.',
                },
              ],
              [
                { type: 'bold', content: 'Facilitar o contato entre usuários: ' },
                {
                  type: 'text',
                  content:
                    'Facilitar o contato de outros usuários que desejem se comunicar ou colaborar com você em questões relacionadas aos dados de pesquisa dos quais você é autor ou colaborador.',
                },
              ],
            ]}
          />

          <Subtitle text="Compartilhamento com terceiros" />
          <List
            items={[
              [
                { type: 'bold', content: 'Suporte técnico, manutenção e gestão: ' },
                {
                  type: 'text',
                  content:
                    'Compartilhamos seus dados pessoais com a Universidade Tecnológica Federal do Paraná (que atua como nossa operadora de dados do Repositório), e com fornecedores contratados que podem necessitar desses dados para realizar manutenção, prestar suporte técnico e corrigir quaisquer problemas no serviço.',
                },
              ],
              [
                { type: 'bold', content: 'Armazenamento. ' },
                {
                  type: 'text',
                  content:
                    'Os dados depositados no Repositório são armazenados em servidores do Google, que podem estar localizados nos EUA. Isso implica que os termos de uso e política de privacidade do Google também se aplicam aos seus dados pessoais.',
                },
              ],
              [
                { type: 'bold', content: 'Indexação por mecanismos de busca: ' },
                {
                  type: 'text',
                  content:
                    'Compartilhamos os dados pessoais abertos vinculados aos dados de pesquisa com serviços externos especializados (DataCite Search, Google Dataset Search etc) e mecanismos de busca genéricos (Google, Bing etc).',
                },
              ],
            ]}
          />
        </ContentSection>

        <ContentSection title="Segurança de Dados">
          <Paragraph text="Tomamos medidas de segurança para proteger seus dados contra acesso não autorizado, uso, divulgação, alteração ou destruição. Essas medidas incluem:" />
          <List
            items={[
              'Acesso restrito aos seus dados pessoais',
              'Uso de tecnologias de segurança',
              'Implementação de políticas de segurança',
            ]}
          />
        </ContentSection>

        <ContentSection title="Seus Direitos">
          <Paragraph text="Você possui os seguintes direitos em relação aos seus dados pessoais:" />
          <List
            items={[
              'direito de acesso, informação e portabilidade,',
              'direito de retificação,',
              'direito de exclusão,',
              'direito de restrição de processamento,',
              'direito de objeção ao processamento, e',
              'direito de apresentar reclamações sobre o processamento.',
            ]}
          />
          <Paragraph text="Para exercer qualquer um desses direitos, por favor, entre em contato conosco." />

          <Subtitle text="Acesso e informação" />
          <Paragraph text="Você tem direito a receber informações detalhadas sobre como seus dados pessoais são processados no Repositório, e esta declaração de privacidade foi elaborada para fornecer as informações que você tem o direito de obter. Além disso, você possui o direito de acessar e visualizar seus dados pessoais registrados no Repositório, bem como outros dados pessoais coletados. Se você desejar, também tem o direito de receber uma cópia desses dados em um formato estruturado, comumente utilizado e legível por máquina, facilitando a portabilidade dos seus dados pessoais." />
          <Paragraph text="Para exercer o seu direito de acesso e portabilidade de dados pessoais, os usuários registrados podem fazer login no Repositório e navegar até a página 'Informações da Conta' e 'Meus Dados' no menu da conta do usuário no canto superior direito da página. Caso essas informações não ofereçam uma visão completa dos seus dados pessoais, você pode entrar em contato conosco para solicitar acesso a informações mais detalhadas." />

          <Subtitle text="Retificação" />
          <Paragraph text="Você tem o direito de retificar dados pessoais imprecisos a seu respeito. Além disso, também possui o direito de complementar informações pessoais que estejam incompletas. Se você notar que o Repositório apresenta dados pessoais imprecisos ou incompletos, por favor, entre em contato conosco e explique por que acredita que esses dados estão incorretos ou incompletos." />

          <Subtitle text="Exclusão de seus dados" />
          <Paragraph text="Você tem o direito de solicitar a exclusão dos seus dados pessoais. Se desejar que seus dados pessoais sejam removidos, entre em contato conosco. É importante que, na sua solicitação, explique por que deseja que seus dados pessoais sejam apagados e, se possível, indique quais dados pessoais específicos você gostaria de remover." />
          <Paragraph text="A legislação prevê exceções ao direito de exclusão dos seus dados pessoais em determinados casos. Isso pode ocorrer quando processamos dados pessoais para cumprir obrigações legais ou para atender a interesses sociais importantes, como arquivamento, pesquisa e estatísticas." />
          <Paragraph text="Nos casos em que os próprios usuários registraram conteúdo no Repositório, não temos a capacidade de apagar as informações do usuário sem também excluir o conteúdo registrado." />

          <Subtitle text="Restrição de processamento" />
          <Paragraph text="Em determinadas circunstâncias, você pode ter o direito de solicitar restrições no processamento dos seus dados pessoais. Processamento restrito significa que os dados pessoais ainda serão armazenados, mas que outros processamentos no Repositório serão limitados. Para solicitar o processamento restrito de dados pessoais, é necessário cumprir as condições estabelecidas na Lei Geral de Proteção de Dados Pessoais. Você pode solicitar o processamento restrito nos seguintes casos:" />
          <List
            items={[
              'Quando seus dados pessoais imprecisos ou incompletos estiverem sendo retificados.',
              'Se você apresentou uma objeção ao processamento (consulte abaixo para obter mais detalhes).',
              'Quando os dados pessoais forem necessários para estabelecer ou defender uma reivindicação legal.',
            ]}
          />
          <Paragraph text="Se o processamento restrito for concedido, você receberá uma notificação antes que a restrição seja retirada." />

          <Subtitle text="Objeção ao processamento" />
          <Paragraph text="Você possui o direito de se opor ao processamento dos seus dados pessoais, mesmo quando os fundamentos legais para esse processamento são baseados em interesses legítimos, razões de interesse público ou no exercício de autoridade pública, desde que você tenha motivos válidos para fazê-lo." />
          <Paragraph text="Outra situação na qual você pode exercer o seu direito de oposição é quando os dados pessoais são processados para fins de pesquisa científica ou histórica, bem como para fins estatísticos. Nessas situações, os dados são anonimizados para proteger a sua privacidade." />
          <Paragraph text="Geralmente, o Repositório não atende a essas condições, com exceção do processamento das informações do autor e em casos em que os dados pessoais são usados para fins estatísticos." />
          <List
            items={[
              'Se você tiver uma necessidade especial para interromper o processamento (ex: proteção de dados pessoais ou manutenção de endereço confidencial), estamos à disposição para auxiliar.',
              'Caso você tenha consentido com o processamento de seus dados pessoais, você possui o direito de retirar esse consentimento a qualquer momento.',
            ]}
          />

          <Subtitle text="Reclamações sobre o processamento" />
          <Paragraph text="Se você acredita que o Repositório não tratou os seus dados pessoais de maneira correta ou legal, ou se sente que não teve a oportunidade de exercer plenamente os seus direitos junto ao Repositório, saiba que você tem o direito de apresentar uma reclamação sobre o processamento. Nossos detalhes de contato estão disponíveis abaixo." />
        </ContentSection>

        <ContentSection title="Contato">
          <Paragraph
            text={[
              { type: 'text', content: 'Se você tiver alguma dúvida sobre este Aviso de Privacidade ou sobre o uso de seus dados pessoais no SoilData, entre em contato conosco através do ' },
              { type: 'link', content: 'contato@mapbiomas.org', href: 'mailto:contato@mapbiomas.org' },
              { type: 'text', content: '.' },
            ]}
          />
          <Paragraph text="Nos esforçaremos para responder suas dúvidas e solicitações com a maior brevidade possível." />

          <Subtitle text="Controlador de dados" />
          <Paragraph
            text={[
              { type: 'text', content: 'O MapBiomas é o controlador de dados pessoais no Repositório SoilData. Para obter uma visão geral das ONGs, universidades e empresas de tecnologia que constituem o MapBiomas, consulte ' },
              { type: 'link', content: 'nossa página', href: 'https://mapbiomas.org/quem-somos', target: '_blank' },
              { type: 'text', content: '.' },
            ]}
          />

          <Subtitle text="Operador de dados" />
          <Paragraph text="A Universidade Tecnológica Federal do Paraná (UTFPR) processa dados pessoais em nome do controlador de dados e desempenha o papel de operador de dados pessoais." />
        </ContentSection>

        <ContentSection title="Alterações a este Aviso de Privacidade">
          <Paragraph text="Reservamo-nos o direito de atualizar ou modificar este Aviso de Privacidade periodicamente. Quaisquer alterações serão refletidas nesta página, e a data da última atualização será indicada no início do aviso." />
          <Subtitle
            text={[
              { type: 'colored', content: 'Data da última atualização: ', color: SOILDATA_COLOR_80 },
              { type: 'colored', content: '2025-09-17', color: SOILDATA_COLOR_80 },
            ]}
          />
          <Subtitle text="Ao usar o SoilData, você concorda com os termos deste Aviso de Privacidade." />
        </ContentSection>
    </DocumentPageLayout>
  );
}
