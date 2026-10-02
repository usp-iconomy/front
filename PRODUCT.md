# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuário principal: **estudante/membro**, quem circula tokens UAIFAI para
ganhar acesso a cursos, inclusive quem entra sem histórico, por bolsa
(Distribution Code). Quando as necessidades conflitam, as dele decidem.

Públicos secundários, todos confirmados na doc técnica:

- **Docentes** da USP e parceiros, que doam cursos e recebem reconhecimento em tokens.
- **Comunidades quilombolas**, com acesso por bolsa e registro de identidade
  territorial em Tokens Alma (SBT). Têm menor frequência digital e
  conectividade limitada.
- **Doadores** (empresas e fundações), que financiam bolsas em reais.
- **Administração USP** e **administração das comunidades**, que configuram
  token, taxas e bolsas e acompanham a circulação (`/admin`).

## Product Purpose

Plataforma de educação comunitária do projeto UAIFAI (USP/IEA). O acesso a um
curso é conquistado por participação e contribuição, não por pagamento. Serve
para valorizar saberes que o mercado não monetiza: cultura quilombola,
práticas de cuidado, memória ancestral, produção colaborativa de conhecimento.

Sucesso, pela doc técnica: velocidade de circulação acima de 2 (tokens
circulados ÷ tokens em existência no período), cursos concluídos e Tokens
Alma emitidos, e relatório SROI para quem doa.

## Positioning

"Você não compra um curso. Você circula valor na comunidade e, por isso,
merece acessá-lo." O mecanismo é o algoritmo ARIGATO CREATION do Peace Coin:
quem envia ganha um incremento proporcional, e saldo parado decai toda
semana. Quem tem menos e circula recebe proporcionalmente mais, o inverso do
capital financeiro. Não é um LMS nem uma loja de cursos.

## Operating Context

- Projeto de extensão USP (disciplina PRO3563), com relatórios para a
  disciplina e para o IEA. A demonstração para a banca pesa tanto quanto o uso
  real nesta fase.
- Backend: `usp-iconomy/api`, com identidade no Keycloak. Carteira: Peace Coin
  Wallet (iOS, Android e web), fora deste repositório.
- Bolsas chegam às comunidades por parceiros locais, com códigos exportados
  em CSV. Dados quilombolas alimentam relatórios para a Funai e editais.
- Quatro tipos de acesso a curso: aberto, por circulação nos últimos 30 dias,
  por código de distribuição, por Token Alma de pré-requisito.

## Capabilities and Constraints

- Dois modos, cada um na sua árvore de URLs. A demonstração (`/demo/...`) roda
  sobre dados de exemplo em `src/mocks/`, sem login e sem chamada de rede. O
  modo real (demais rotas) fala com `usp-iconomy/api` pelo servidor do Next.
- Login real pelo Keycloak (realm `iconomy`), membro e perfil vindos de
  `usp-iconomy/api`. As demais áreas aparecem como "Em construção" no modo real
  e completas em `/demo`.
- Existe acesso a dados reais do Peace Coin Explorer. **Em aberto:** quais
  dados, por qual API, e quando o app passa a consumi-los. Hoje o app não os
  consome.
- Termos: na interface, SBT é "Token Alma"; "código de distribuição", não
  cupom; papéis são funções (Estudante, Docência, Administração, Doação).
- Regras de negócio em `docs/superpowers/specs/` e na doc técnica
  `documents/UAIFAI-Esqueleto.pdf` (RF-01 a RF-15, RN-01 a RN-10).

## Brand Commitments

- Nome: **USP Iconomy**. Slogan: "Conhecimento que circula, transforma".
- Tom, pela doc técnica: acolhedor, direto, decolonial, sem jargão financeiro.
  O usuário vê "pontos", "reconhecer" e "certificado", nunca "wallet",
  "transação" ou "mint".
- Símbolo da moeda: ☮ (UAIFAI token).
- Identidade institucional USP (`design-options/USP-Identidade-Visual-2025.001.pdf`).

## Evidence on Hand

Nada real ainda dentro do produto. Nomes de pessoas, comunidades (Kalunga,
Ivaporunduva), números de impacto, SROI e depoimentos em `src/mocks/` são
fictícios e nenhuma tela pode apresentá-los como reais. Não há depoimento,
parceria formal confirmada, cliente ou métrica de piloto que possa ser
citada. Documentos de contexto: `documents/` (doc técnica, relatórios
PRO3563, foto da reunião com a Peace Coin).

## Product Principles

1. Acesso por circulação, nunca por saldo ou pagamento: a interface mede o
   que a pessoa enviou, não o que ela guarda.
2. Quem chega sem histórico tem caminho visível: bolsa e curso aberto vêm
   antes de qualquer bloqueio.
3. Dado territorial é da comunidade. A USP só vê com autorização explícita,
   e a tela diz quando algo está restrito em vez de esconder.
4. Linguagem de comunidade, não de banco nem de blockchain.
5. Nenhum número, nome ou depoimento fictício passa por real.

## Accessibility & Inclusion

WCAG 2.1 AA. Leitor de tela com rótulo em todo controle interativo. Funciona
a partir de 320px de largura. Feedback em região `role="status"`, nunca
`alert()`. Alvos de toque ≥44px. Interface em português brasileiro; conteúdo
de curso pode vir em línguas indígenas e crioulas. Painel administrativo
previsto em português e inglês. Conectividade limitada nas comunidades
quilombolas (modo offline parcial é da Wallet, não deste app). LGPD:
consentimento granular, direito ao esquecimento e portabilidade.
