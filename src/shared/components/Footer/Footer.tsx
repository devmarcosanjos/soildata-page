import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import logoCNPq from '@/assets/cnpq.png';
import logoDataCite from '@/assets/DataCite-Logo_stacked.svg';
export function Footer() {
  return (
    <>
      <section className="py-8 md:py-10 footer-gradient-section">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
            <div className="flex flex-col md:flex-row items-start justify-center md:justify-start gap-8 md:gap-12 lg:gap-16">
              {/* Seção APOIO */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold mb-6 text-center md:text-left text-gray-600">
                  APOIO
                </h3>
                <div className="flex items-center justify-center" style={{ height: '95px' }}>
                  <img
                    src={logoCNPq}
                    alt="CNPq"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxHeight: '95px' }}
                  />
                </div>
              </div>

              {/* Seção INDEXADO */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold mb-6 text-center md:text-left text-gray-600">
                  INDEXADO
                </h3>
                <div className="flex items-center justify-center" style={{ height: '95px' }}>
                  <img
                    src={logoDataCite}
                    alt="DataCite"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxHeight: '95px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer sm:footer-horizontal text-base-content p-10 footer-gradient-main">
        <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 lg:px-0">
          <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <aside className="col-span-1">
              <div className="mb-4">
                <Logo to={undefined} size="md" />
              </div>
              <p className="text-sm text-gray-600">
                Um repositório abrangente de dados de solo do MapBiomas, fornecendo a pesquisadores e formuladores de políticas informações ambientais valiosas.
              </p>
            </aside>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">Links Rápidos</h6>
              <Link to="/platform" className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                Plataforma de Dados
              </Link>
              <a
                href="https://soildata.mapbiomas.org/dataverse/soildata?q="
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                Repositório de Dados
              </a>
              <Link to="/statistics" className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                Estatísticas
              </Link>
              <Link to="/about" className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                Quem Somos
              </Link>
              <Link to="/contact" className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                Contato
              </Link>
            </nav>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">Recursos</h6>
              <a
                href="https://soildata.mapbiomas.org/dicionario"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                Dicionário de Dados
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/1bCRlrHx0HZLhzNoh5iCKNljSTZnoT4gGgyElfi-AY2o/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                Modelo Planilha de Dados
              </a>
            </nav>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">Legal</h6>
              <Link
                to="/privacy-policy"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                to="/termos-uso"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                Termos de Uso
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      <footer className="footer sm:footer-horizontal footer-center footer-gradient-bottom text-base-content p-4">
        <aside>
          <p className="text-sm mb-2 text-white">
            © {new Date().getFullYear()} MapBiomas. All rights reserved.
          </p>
          <p className="text-sm text-white/80">
            Desenvolvido
            <br />
            <a
              href="https://www.pedometria.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover text-white/80 hover:text-orange-600 transition-colors"
            >
              Laboratório Pedometria - UTFPR
            </a>
            {' | '}
            <a
              href="https://ecostage.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover text-white/80 hover:text-orange-600 transition-colors"
            >
              EcoEstage
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
}
