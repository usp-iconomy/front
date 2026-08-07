# USP Iconomy — Web

Frontend da plataforma USP Iconomy (projeto UAIFAI — USP/IEA): educação
comunitária onde o acesso a cursos é conquistado por circulação de tokens, não
por pagamento.

O backend é a API do Peace Coin Explorer. Esta fase roda com dados de exemplo em
`src/mocks/`; nenhuma chamada de rede é feita.

## Rodando

```bash
npm install
npm run dev
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Rode `npm run build` antes de qualquer commit que toque em `.ts`/`.tsx` — é o
que pega import não usado, variável órfã e erro de tipo.

## Telas

| Rota | O que é |
|---|---|
| `/courses` | Catálogo com busca e filtro por tipo de acesso |
| `/profile` | Saldo, circulações, Tokens Alma e extrato |
| `/circulation` | Feed público de transferências e formulário de envio |
| `/scholarships` | Resgate de Distribution Code em três etapas |
| `/achievements` | Galeria de Tokens Alma (SBTs) |
| `/impact` | Métricas de impacto e SROI |
| `/design-system` | Catálogo vivo das primitivas |

## Estrutura

```
src/
├── app/            uma pasta por rota, mais layout e globals.css
├── design-system/  tokens e primitivas — não conhecem o domínio
├── components/     composições de produto — conhecem o domínio
├── types/          modelo de domínio
├── mocks/          dados de exemplo tipados
└── lib/            formatação, navegação, mapeamento de tipos de acesso
```

### A fronteira que importa

`design-system/` não sabe o que é um curso. Um `Badge` recebe `tone`, não
`accessType`. Quem faz a tradução é `lib/access-type.ts`, e quem a consome é
`components/`. Consequência prática: qualquer primitiva pode ir para outro
produto sem arrastar o modelo do Iconomy junto.

Ao criar uma primitiva nova: nada de string de domínio em `design-system/`,
nada de valor cru de cor ou espaçamento fora de `tokens/tokens.css`, e um
export no barrel `design-system/index.ts`.

## Design system

Tokens em `src/design-system/tokens/tokens.css`, espelhados com tipos em
`tokens.ts` para os casos em que um token precisa chegar ao JavaScript.

Estilo em CSS Modules. Nenhum componente escreve hex, px de espaçamento ou
tamanho de fonte direto — sempre `var(--token)`.

### Duas cores de marca, e o porquê

O teal institucional `#1094AB` alcança 3,6:1 sobre branco. Isso passa em WCAG AA
para texto grande e reprova para texto normal, o que inclui rótulo de botão,
link e aba ativa.

- `--color-accent` (`#1094AB`) — preenchimentos sem texto, bordas, numerais ≥24px
- `--color-accent-strong` (`#0D7D90`) — todo texto e todo botão preenchido que
  carrega texto (4,8:1)

Os quatro tons de tipo de acesso também foram escurecidos em relação ao
protótipo pelo mesmo motivo; os valores e as razões de contraste estão em
`docs/superpowers/specs/2026-08-07-usp-iconomy-frontend-design.md`.

## Datas

Tudo que vem do domínio é ISO 8601 UTC. A conversão para hora local acontece
só na renderização, em `lib/format.ts`. Nenhum componente recebe data já
formatada.

`formatElapsed` é usado dentro de `<time suppressHydrationWarning>` porque
servidor e cliente avaliam `now` com milissegundos de diferença.

## Fora do escopo desta fase

Autenticação (RF-01), criação e detalhe de curso (RF-03), fluxo de doação
(RF-10), módulo quilombola (RF-12, RF-13) e painel administrativo (RF-14). Os
tipos de domínio já contemplam esses casos; as telas não existem.
