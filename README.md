# USP Iconomy Web

Frontend da plataforma USP Iconomy (projeto UAIFAI, USP/IEA): educação
comunitária onde o acesso a cursos é conquistado por circulação de tokens, não
por pagamento.

O app tem dois modos, cada um na sua árvore de URLs:

- **Demonstração** (`/demo/...`): sem login, com dados fictícios de
  `src/mocks/`. Uma faixa fixa avisa que nada ali é real. É o que a banca e as
  apresentações usam.
- **Real** (as demais rotas): login pelo Keycloak e dados de `usp-iconomy/api`.
  Hoje a API só tem membro e perfil; o resto aparece como "Em construção".
  Nada do modo real cai para mock.

O navegador nunca fala com a API. O servidor do Next chama a API com o token
da sessão, que fica num cookie criptografado e fora do alcance do JavaScript.

## Rodando

### Só a demonstração

Não precisa de backend nem de variáveis de ambiente.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` e escolha "Explorar demonstração", ou vá direto a
`/demo/courses`.

### Modo real

Precisa do backend `usp-iconomy/api` rodando. Em outra pasta:

```bash
git clone git@github.com:usp-iconomy/api.git && cd api
make setup      # dependências Python e .env
make up         # Postgres, Redis, Keycloak e Mailpit
make migrate    # migrações
make dev        # API em http://localhost:8000
```

Para desligar: encerre o `make dev` e rode `make down` na pasta da API.

| Serviço | Endereço |
|---|---|
| API (`make dev`) | `http://localhost:8000` |
| Keycloak (`make up`) | `http://localhost:8080` |
| Mailpit (`make up`) | `http://localhost:8025`: todo e-mail que o Keycloak envia cai aqui |

No front, copie as variáveis e gere o segredo da sessão:

```bash
cp .env.example .env.local
openssl rand -base64 33    # cole o resultado em AUTH_SECRET
npm install
npm run dev
```

O front **tem de rodar na porta 3000**. O client `iconomy-web` do Keycloak só
aceita redirect para `http://localhost:3000/*`; em outra porta o login falha.
`AUTH_URL` (já em `.env.example`) também precisa apontar para essa origem:
`next start` exige, e o logout usa para voltar a `/`.

Usuários de teste do realm, todos com a senha `iconomy2026`:

| Usuário | Sugestão de uso |
|---|---|
| `professora@usp.br` | Escolher Docência |
| `aluno@example.org` | Escolher Estudante |
| `doador@example.org` | Escolher Doação |

O realm também permite criar conta, e exige verificação de e-mail (o link chega
no Mailpit). Nenhum usuário vem com papel: cada pessoa escolhe o seu na tela de
onboarding, no primeiro login.
Administração não é autoatribuível: o papel `admin` vem do backend.

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm test` | Testes (Vitest) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Rode `npm run build` antes de qualquer commit que toque em `.ts`/`.tsx`. É o
que pega import não usado, variável órfã e erro de tipo.

## Telas

Cada tela existe nas duas árvores. A demonstração tem todas completas. No modo
real, a coluna "Real" diz o que aparece hoje.

| Tela | Real | Demonstração | O que é |
|---|---|---|---|
| Entrada | `/` | | "Entrar", "Criar conta" e "Explorar demonstração" |
| Onboarding | `/onboarding` | | Escolha de papel no primeiro acesso (só modo real) |
| Cursos | `/courses` | `/demo/courses` | Catálogo com busca e filtro por tipo de acesso |
| Perfil | `/profile` | `/demo/profile` | Saldo, circulações, Tokens Alma e extrato |
| Circulação | `/circulation` | `/demo/circulation` | Feed público de transferências e formulário de envio |
| Bolsas | `/scholarships` | `/demo/scholarships` | Resgate de Distribution Code em três etapas |
| Conquistas | `/achievements` | `/demo/achievements` | Galeria de Tokens Alma (SBTs) |
| Impacto | `/impact` | `/demo/impact` | Métricas de impacto e SROI |
| Doar | `/donate`, `/donate/history` | `/demo/donate`, `/demo/donate/history` | Doação e histórico |
| Design system | `/design-system` | `/demo/design-system` | Catálogo vivo das primitivas |
| Admin: visão geral | `/admin` | `/demo/admin` | Backoffice: visão geral da comunidade (RF-15) |
| Admin: cursos | `/admin/courses` | `/demo/admin/courses` | Aprovação de cursos |
| Admin: códigos | `/admin/distribution-codes` | `/demo/admin/distribution-codes` | Códigos de distribuição e exportação CSV (RF-09) |
| Admin: taxas | `/admin/token-settings` | `/demo/admin/token-settings` | Taxas de incremento e decaimento (RF-07) |
| Admin: usuários | `/admin/users` | `/demo/admin/users` | Usuários e papéis (RF-14) |
| Admin: comunidades | `/admin/communities` | `/demo/admin/communities` | Comunidades quilombolas e memória coletiva (RF-13) |
| Admin: comunidade | `/admin/communities/[id]` | `/demo/admin/communities/[id]` | Detalhe de uma comunidade |

**"Em construção" no modo real.** Toda tela da coluna "Real" mostra "Esta área
ainda não está ligada ao servidor", com o link "Ver na demonstração", porque a
API ainda não tem o endpoint. As exceções são `/onboarding`, que já fala com a
API, e `/design-system`, que não usa dados. A identidade no cabeçalho já vem
de `/auth/me`; o saldo some enquanto a API não tiver carteira. Cada tela
sai desse estado quando o backend ganha o endpoint, trocando uma função em
`src/data/api/`.

**Admin.** No modo real, `/admin/*` exige o papel `admin` e trata todo admin
como admin USP. Quem não é admin vê "Acesso restrito". Na demonstração, o
perfil vem de `currentAdmin` em `src/mocks/admin.ts`; troque para
`quilombolaAdmin` para ver o admin quilombola. O bloqueio de seções é só de
interface: a API precisa aplicar as mesmas regras.

## Estrutura

```
src/
├── app/            rotas: `demo/` (sem login), `(real)/` (exige sessão), `api/auth/`
├── screens/        telas compartilhadas; recebem dados por props
├── data/           `DataSource`: `demo/` (sobre mocks) e `api/` (só no servidor)
├── auth/           Auth.js, sessão e renovação do token
├── design-system/  tokens e primitivas, não conhecem o domínio
├── components/     composições de produto, conhecem o domínio
├── types/          modelo de domínio
├── mocks/          dados de exemplo tipados, só a demonstração usa
├── proxy.ts        barra quem não tem sessão fora de `/demo` e `/`
└── lib/            formatação, navegação, modo (`pathFor`), tipos de acesso
```

As duas árvores só têm arquivos de rota finos: cada um escolhe a fonte de dados
e renderiza a mesma tela de `screens/`. Links internos passam por `pathFor` ou
`<ModeLink>` para uma tela da demonstração nunca apontar para o modo real, nem o
contrário. `src/data/api/client.ts` é o único lugar que faz `fetch` na API.

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
tamanho de fonte direto: sempre `var(--token)`.

### Duas cores de marca, e o porquê

O teal institucional `#1094AB` alcança 3,6:1 sobre branco. Isso passa em WCAG AA
para texto grande e reprova para texto normal, o que inclui rótulo de botão,
link e aba ativa.

- `--color-accent` (`#1094AB`): preenchimentos sem texto, bordas, numerais ≥24px
- `--color-accent-strong` (`#0D7D90`): todo texto e todo botão preenchido que
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

- Endpoints novos na API: este repositório não muda o `api`.
- Deploy e URLs de produção do Keycloak: os redirects do realm só cobrem
  `localhost:3000`.
- Escopo quilombola no modo real: lá todo admin é tratado como admin USP.
- Criação e detalhe de curso (RF-03), fluxo de doação real (RF-10) e módulo
  quilombola real (RF-12, RF-13). Os tipos de domínio já contemplam esses casos;
  no modo real as telas dizem "Em construção".
