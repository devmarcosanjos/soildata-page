import type { Dataset } from '@/types/dataset';

export function generateDatasetUrl(doi: string): string {
  return `https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${doi}`;
}

export const mockPublications: Dataset[] = [
  {
    title: "Dados de 'Atributos Físicos e Matéria Orgânica de Organossolos Háplicos em Distintos Ambientes no Brasil'",
    authors: [
      "Ebeling, Adierson Gilvani",
      "Anjos, Lucia Helena Cunha dos",
      "Pereira, Marcos Gervasio",
      "Novotny, Etelvino Henrique"
    ],
    publicationDate: "2025 Sep 25",
    doi: "doi:10.60502/SoilData/ABJUMR",
    summary: "O trabalho possui 8 eventos e 38 camadas, os dados são georreferenciados, os dados possuem análise física e quimica, foram realizadas as coletas nos estados do RJ, MA e PR.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/ABJUMR")
  },
  {
    title: "Atributos Químicos e Físicos de Solos sob Diferentes Sistemas de Manejo no Cerrado",
    authors: [
      "Silva, João Pedro",
      "Santos, Maria Oliveira",
      "Costa, Pedro Henrique"
    ],
    publicationDate: "2025 Sep 20",
    doi: "doi:10.60502/SoilData/XYZ123",
    summary: "Dados coletados em 15 áreas experimentais no Cerrado brasileiro, incluindo análises de pH, matéria orgânica, textura e densidade do solo.",
    version: "V2",
    url: generateDatasetUrl("doi:10.60502/SoilData/XYZ123")
  },
  {
    title: "Caracterização de Solos da Amazônia: Análises Físico-Químicas e Classificação",
    authors: [
      "Ferreira, Ana Carolina",
      "Lima, Carlos Eduardo",
      "Ribeiro, Juliana"
    ],
    publicationDate: "2025 Sep 15",
    doi: "doi:10.60502/SoilData/AMZ456",
    summary: "Conjunto de dados com 25 perfis de solo da região amazônica, incluindo análises granulométricas, químicas e classificação taxonômica.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/AMZ456")
  },
  {
    title: "Dados de Carbono Orgânico em Solos de Pastagens no Pantanal",
    authors: [
      "Oliveira, Roberto",
      "Martins, Fernanda"
    ],
    publicationDate: "2025 Sep 10",
    doi: "doi:10.60502/SoilData/PAN789",
    summary: "Estudo sobre estoques de carbono orgânico em solos de pastagens naturais e cultivadas no Pantanal mato-grossense.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/PAN789")
  },
  {
    title: "Atributos de Solos em Áreas de Restauração Florestal na Mata Atlântica",
    authors: [
      "Almeida, Patricia",
      "Souza, Ricardo",
      "Carvalho, Beatriz",
      "Mendes, Lucas"
    ],
    publicationDate: "2025 Sep 05",
    doi: "doi:10.60502/SoilData/MAT012",
    summary: "Dados de 12 áreas em processo de restauração florestal, com análises de fertilidade, textura e matéria orgânica ao longo de 5 anos.",
    version: "V3",
    url: generateDatasetUrl("doi:10.60502/SoilData/MAT012")
  },
  {
    title: "Caracterização Física de Solos em Sistemas Agroflorestais no Nordeste",
    authors: [
      "Araújo, Francisco",
      "Barbosa, Mariana"
    ],
    publicationDate: "2025 Aug 30",
    doi: "doi:10.60502/SoilData/NE345",
    summary: "Análises de densidade, porosidade e infiltração em solos sob sistemas agroflorestais no semiárido nordestino.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/NE345")
  },
  {
    title: "Dados de Fertilidade do Solo em Áreas de Cultivo de Soja no Centro-Oeste",
    authors: [
      "Rodrigues, Gustavo",
      "Pereira, Camila",
      "Santos, André",
      "Lima, Renata"
    ],
    publicationDate: "2025 Aug 25",
    doi: "doi:10.60502/SoilData/SOY678",
    summary: "Conjunto de dados de 30 propriedades rurais com análises de macro e micronutrientes em solos cultivados com soja.",
    version: "V2",
    url: generateDatasetUrl("doi:10.60502/SoilData/SOY678")
  },
  {
    title: "Atributos Químicos de Solos em Áreas de Mineração Reabilitadas",
    authors: [
      "Castro, Eduardo",
      "Fernandes, Larissa"
    ],
    publicationDate: "2025 Aug 20",
    doi: "doi:10.60502/SoilData/MIN901",
    summary: "Dados de solos em diferentes estágios de reabilitação pós-mineração, incluindo análises de metais pesados e pH.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/MIN901")
  },
  {
    title: "Caracterização de Solos em Áreas de Caatinga: Análises Físico-Químicas",
    authors: [
      "Nascimento, Diego",
      "Alves, Thais",
      "Monteiro, Rafael"
    ],
    publicationDate: "2025 Aug 15",
    doi: "doi:10.60502/SoilData/CAA234",
    summary: "Dados de 20 perfis de solo da Caatinga com análises completas de textura, química e classificação taxonômica.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/CAA234")
  },
  {
    title: "Dados de Matéria Orgânica e Carbono em Solos de Várzea na Amazônia",
    authors: [
      "Mendes, Isabela",
      "Rocha, Paulo",
      "Silva, Amanda",
      "Costa, Bruno"
    ],
    publicationDate: "2025 Aug 10",
    doi: "doi:10.60502/SoilData/VAR567",
    summary: "Estudo sobre estoques de carbono e composição da matéria orgânica em solos de várzea amazônica em diferentes épocas do ano.",
    version: "V1",
    url: generateDatasetUrl("doi:10.60502/SoilData/VAR567")
  }
];
