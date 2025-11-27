# Shared Libraries & Services

## Shared components
- `src/shared/components`: botões, layouts, cards, hero sections e navegação comuns. Use os barrels (ex.: `export { Layout } from './Layout';`) nos imports.
- Atualize ou crie novos componentes aqui sempre que eles servirem mais de uma feature.

## Data & services
- `src/data/`: fixtures, mocks e helpers (ex.: `mockPublications`). Agrupe novos datasets nesta pasta para manter claro o que é estático.
- `src/services/metricsApi.ts`: wrapper fetch com cache simples. Para novos serviços, crie arquivos em `src/services/<domain>.ts` e exponha funções tipadas.
- Tipos ficam em `src/types/` (domínio ex.: `dataset.ts`, `metrics.ts`). Amplie com novos contratos quando necessário.

## Theme & styling
- A configuração de tema começa em `src/index.css`, mas recomendamos criar `src/config/theme.ts` com tokens (`primaryColor`, `spacing`, `font`) e reutilizar no Tailwind/DaisyUI.
- Atualize `tailwind.config.cjs`/`vite.config.ts` (se existir) sempre que alterar aliases ou tokens.

## Utilities
- `src/lib/` deve abrigar helpers globais (fetch helpers, date formatters, etc.). Evite lógica específica da feature aqui.
- Se precisar de state managers (Zustand/Context/React Query), coloque os providers em `src/app/providers` e injete no `AppRouter`.

## Desenvolvimento e manutenção
1. Rodar `pnpm tsc --noEmit` e `pnpm lint` (se existir) antes de PRs.
2. Use aliases `@/...` para imports e evite `../../../` ao máximo.
3. Documente alterações complexas em `docs/` e mantenha o README atualizado.
