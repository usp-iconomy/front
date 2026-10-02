# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Modo real: login pelo Keycloak, escolha de perfil no primeiro acesso e telas ainda sem servidor marcadas como "Em construção", com atalho para a demonstração.
- Área administrativa em `/admin`, com menu lateral por perfil: o admin USP vê todas as seções e o admin quilombola só a taxa e os dados da própria comunidade. Quem abre uma seção fora do perfil vê "Acesso restrito".
- `/admin`: visão geral da comunidade com velocidade de circulação contra a meta de 2, sentimento das mensagens, saldos parados (Unpaid-Degrees), quem mais circulou e ranking de cursos.
- `/admin/courses`: fila de aprovação de cursos com o curso aberto ao lado da lista, filtro por status e decisão de publicar, pedir ajustes ou rejeitar. As duas últimas exigem um comentário de pelo menos 10 caracteres.
- `/admin/distribution-codes`: lista de códigos com status calculado (agendado, ativo, esgotado, expirado), criação com validade por dia e exportação CSV para parceiros locais.
- `/admin/communities`: comunidades quilombolas com participação por território, memória coletiva (eventos e Tokens Alma por membro) e exportação CSV para relatórios e editais. A USP só vê o detalhe territorial com autorização da comunidade (RN-09).
- `/admin/token-settings`: multiplicador do incremento e decaimento semanal, com revisão antes/depois. A taxa de cada comunidade quilombola fica sempre abaixo da padrão (RN-07), e o admin quilombola só altera a da própria comunidade.
- `/admin/users`: busca de usuários por nome ou e-mail (sem precisar de acento), filtro por papel e troca de papel. Ninguém muda o próprio papel, e a última pessoa na administração não perde o papel.
- Página 404 em português com atalhos para os cursos e para a administração.

### Changed

- O avatar no topo abre o menu da conta, com "Meu perfil" e, para quem administra, "Administração". No backoffice, a identidade no rodapé do menu lateral abre o mesmo menu com "Plataforma", no lugar do link "Voltar ao site". Quem tem os dois perfis troca de interface sem trocar de pessoa.
- Comentários no histórico de revisão de curso aparecem num bloco neutro, sem a borda lateral colorida.

### Fixed

- Menu do topo das telas de membro: os itens ficavam encostados na borda de cima do cabeçalho em vez de centralizados, e o sublinhado do item ativo não chegava à borda de baixo.
