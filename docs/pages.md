# Pages Guide

## Feature-first layout
- Cada página vive em `src/features/<domain>/pages`. O nome do diretório e do componente devem refletir o domínio em inglês (`home`, `platform`, `data`, `methods`, etc.).
- As seções reutilizáveis (cards, hero, metrics) ficam em `src/shared/components`. Priorize o uso desses componentes em vez de duplicar HTML/Tailwind.

## Criando uma página nova
1. Crie um diretório `src/features/<new-domain>/pages`.
2. Exporte a page com `export function <PageName>()` (ex.: `export function Curation()`).
3. Use `HeroPageLayout` ou outro shared component para manter o visual consistente.
4. Adicione o lazy import no `src/app/routes.tsx` e forneça `withDefaultLayout` ou outro wrapper se for uma página comum.
5. Atualize `menuItems` em `src/shared/components/Navigation/Navigation.tsx` e o rodapé se necessário.

## Rotas e navegação
- Todas as rotas principais usam palavras em inglês e kebab-case (`/platform`, `/methods/curation`).
- Centralize novos paths em `app/routes.tsx` para manter visibility e evitar duplicatas.
- Use o mesmo `route.layout` para controlar wrappers (default versus platform shell) e permita o fallback `Suspense`.

## Boas práticas
- Prefira classes Tailwind e tokens (`@/config/theme.ts`) ao invés de styles inline.
- Separe lógica de efeito em hooks (`src/features/<domain>/hooks`) ou stores (`zustand/context`).
- Sempre documente mudanças de rota/nome em `docs/pages.md` e no README/CHANGELOG.
