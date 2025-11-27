# Platform Module

## Overview
- O módulo de plataforma vive em `src/features/platform`. Ele agrupa o shell `<PlatformPage>`, os subcomponentes MapBiomas UI e quaisquer estados/filtros específicos da visualização geoespacial.
- A página `/platform` usa `ThemeProvider` do MapBiomas UI (`BaseColorsKeys.ORANGE_SOLO`) para manter o estilo oficial.

## Estrutura atual
- `pages/Platform.tsx`: mede o `Header` compartilhado, aplica `ThemeProvider` e monta o `<Platform>` com `Subheader`, `Leftbar`, `Content` (mapa) e `Rightbar` (estatísticas).
- `components/`: contêm `PlatformMap`, `PlatformSubheader`, `PlatformLeftbar`, `PlatformStatistics` e o `LeftMenu` com filtros. Mova lógica adicional de UI para `components/` e mantenha `PlatformPage` apenas com montagem e estado global.

## Melhorias recomendadas
1. **Platform shell**: concentre o ThemeProvider + viewport/scroll dentro de um shell (`platform-shell/PlatformShell.tsx`) para evitar efeitos colaterais e facilitar reuso.
2. **Estado de filtros**: extraia para um store (Zustand ou Context) que forneça `selectedDataset`, filtros e ações para `LeftMenu` e `PlatformStatistics`. Isso elimina o repasse manual de props.
3. **Hooks de seção**: quando adicionar novos filtros ou painéis, crie hooks específicos (`usePlatformFilters`, `useDatasetDetails`) sob `platform/hooks`.

## Deployment
- Como a plataforma ocupa a tela inteira, evite `Layout` compartilhado/renderizações adicionais. Mantenha o route wrapper `layout: 'platform'` e carregamentos com `Suspense` + fallback específico (spinner ou skeleton).
- Este módulo depende diretamente do CSS de `@mapbiomas/ui` e `maplibre-gl`. Garanta importações únicas em `src/main.tsx` e atualize `index.css` apenas quando precisar sobrescrever temas.
