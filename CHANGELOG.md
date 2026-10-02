# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Tema próprio para as telas do Keycloak (entrar, criar conta, recuperar e trocar senha, confirmar e-mail, erro), em português e com a identidade da plataforma, em `keycloak-theme/`.
- Modo real: login pelo Keycloak, escolha de perfil no primeiro acesso e telas ainda sem servidor marcadas como "Em construção", com atalho para a demonstração. O `/admin` real exige o papel de administração e hoje mostra "Em construção"; o backoffice completo está em `/demo/admin`. Uma conta desativada no servidor vê "Acesso restrito", com "Sair", em qualquer tela do modo real.
- Área administrativa em `/demo/admin`, com menu lateral por perfil: o admin USP vê todas as seções e o admin quilombola só a taxa e os dados da própria comunidade. Quem abre uma seção fora do perfil vê "Acesso restrito".
- `/demo/admin`: visão geral da comunidade com velocidade de circulação contra a meta de 2, sentimento das mensagens, saldos parados (Unpaid-Degrees), quem mais circulou e ranking de cursos.
- `/demo/admin/courses`: fila de aprovação de cursos com o curso aberto ao lado da lista, filtro por status e decisão de publicar, pedir ajustes ou rejeitar. As duas últimas exigem um comentário de pelo menos 10 caracteres.
- `/demo/admin/distribution-codes`: lista de códigos com status calculado (agendado, ativo, esgotado, expirado), criação com validade por dia e exportação CSV para parceiros locais.
- `/demo/admin/communities`: comunidades quilombolas com participação por território, memória coletiva (eventos e Tokens Alma por membro) e exportação CSV para relatórios e editais. A USP só vê o detalhe territorial com autorização da comunidade (RN-09).
- `/demo/admin/token-settings`: multiplicador do incremento e decaimento semanal, com revisão antes/depois. A taxa de cada comunidade quilombola fica sempre abaixo da padrão (RN-07), e o admin quilombola só altera a da própria comunidade.
- `/demo/admin/users`: busca de usuários por nome ou e-mail (sem precisar de acento), filtro por papel e troca de papel. Ninguém muda o próprio papel, e a última pessoa na administração não perde o papel.
- Tela de entrada em `/`: entrar, criar conta ou explorar a demonstração sem login, em `/demo`. Na demonstração, uma faixa fixa traz o atalho "Sair da demonstração". Quando o login falha, a entrada avisa "Não foi possível entrar. Tente de novo." no lugar da página de erro do Auth.js.
- O menu da conta, no topo da plataforma e no rodapé do menu lateral da administração, termina em "Sair" no modo real, que encerra a sessão também no Keycloak, e em "Sair da demonstração" na demonstração, que volta para `/`.
- Página 404 em português com atalhos para os cursos e para a administração. Um endereço inexistente sob `/demo` mostra a 404 dentro da demonstração, com a faixa e atalhos para `/demo/courses` e `/demo/admin`. `/demo` sozinho abre os cursos da demonstração.

### Changed

- Textos e títulos de aba sem os separadores " · " e " — ": títulos de aba usam "|" e o restante virou frase comum, com plural de verdade nos níveis de doação ("1 bolsa mensal", "4 bolsas mensais").
- O avatar no topo abre o menu da conta, com "Meu perfil" e, para quem administra, "Administração". No backoffice, a identidade no rodapé do menu lateral abre o mesmo menu com "Plataforma", no lugar do link "Voltar ao site". Quem tem os dois perfis troca de interface sem trocar de pessoa.
- Comentários no histórico de revisão de curso aparecem num bloco neutro, sem a borda lateral colorida.

### Fixed

- Menu do topo das telas de membro: os itens ficavam encostados na borda de cima do cabeçalho em vez de centralizados, e o sublinhado do item ativo não chegava à borda de baixo.
