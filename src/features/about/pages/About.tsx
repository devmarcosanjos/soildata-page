import { HeroPageLayout } from '@/shared/components/HeroPageLayout';

export function About() {
  return (
    <HeroPageLayout title="QUEM SOMOS">
      {/* Texto introdutório */}
      <div className="mb-8 md:mb-12">
        <p className="text-base text-gray-500 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
          A rede MapBiomas é colaborativa e reúne organizações não governamentais, universidades e empresas de tecnologia que analisam dados sobre os biomas e temas transversais. Contamos também com parceiros técnicos e com um conjunto de financiadores que apoiam o trabalho do MapBiomas.
        </p>
      </div>

      {/* COORDENAÇÃO */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          COORDENAÇÃO
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Alessandro Samuel-Rosa | Coordenação Geral
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Taciara Zborowski Horst | XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Marcos Alexandre dos Anjos | XXXXXX
          </li>
        </ul>
      </div>

      {/* PARCEIROS DE TECNOLOGIA */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          PARCEIROS DE TECNOLOGIA
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Google
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            EcoStage
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Laboratório de Pedometria (LdP)
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
        </ul>
      </div>

      {/* PARCEIROS INSTITUCIONAIS */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          PARCEIROS INSTITUCIONAIS
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            Instituto Arapyaú
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
        </ul>
      </div>

      {/* MEMBROS ANTERIORES */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          MEMBROS ANTERIORES
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
        </ul>
      </div>

      {/* FINANCIAMENTO */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          FINANCIAMENTO
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
        </ul>
      </div>

      {/* USUÁRIOS APOIADORES */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          USUÁRIOS APOIADORES
        </h2>
        <ul className="list-none space-y-2">
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
          <li className="text-base text-gray-500" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
            XXXXXX
          </li>
        </ul>
      </div>
    </HeroPageLayout>
  );
}
