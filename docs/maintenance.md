# Maintenance Checklist

## Local setup
- Dependências: `pnpm install`.
- Scripts principais:  
  - `pnpm dev` para rodar em modo desenvolvimento;  
  - `pnpm build` para build de produção (ver `vite.config.ts`);  
  - `pnpm tsc --noEmit` para conferir tipos.

## Rotas e navegação
- Ao adicionar rotas, atualize `src/app/routes.tsx`, `Navigation`, `Footer` e, se necessário, `public/` ou assets estáticos (não existem atualmente, mas fique atento).
- Sempre use nomes em inglês e mantenha `layout` para identificar wrappers especiais (por exemplo, `platform`).

## Qualidade do código
- Formatação/tipo: `pnpm lint` (se configurado) + `pnpm tsc --noEmit`.
- Comentários: comente apenas quando a lógica não for óbvia. Prefira nomes autoexplicativos.
- Revisões: documente decisões arquiteturais ou trade-offs em `docs/` e crie notas no README/CHANGELOG.

## Testes (futuros)
- Adicione testes unitários/componentes em `src/features/<domain>/__tests__` usando Vitest + Testing Library.
- Automatize `pnpm test` como parte do pipeline e execute `pnpm test --runInBand` localmente antes de PRs maiores.
