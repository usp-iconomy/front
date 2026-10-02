# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Área administrativa em `/admin`, com menu lateral por perfil: o admin USP vê todas as seções e o admin quilombola só a taxa e os dados da própria comunidade. Quem abre uma seção fora do perfil vê "Acesso restrito".
- `/admin`: visão geral da comunidade com velocidade de circulação contra a meta de 2, sentimento das mensagens, saldos parados (Unpaid-Degrees), quem mais circulou e ranking de cursos.
- `/admin/courses`: fila de aprovação de cursos com o curso aberto ao lado da lista, filtro por status e decisão de publicar, pedir ajustes ou rejeitar. As duas últimas exigem um comentário de pelo menos 10 caracteres.
- `/admin/distribution-codes`: lista de códigos com status calculado (agendado, ativo, esgotado, expirado), criação com validade por dia e exportação CSV para parceiros locais.
- `/admin/communities`: comunidades quilombolas com participação por território, memória coletiva (eventos e Tokens Alma por membro) e exportação CSV para relatórios e editais. A USP só vê o detalhe territorial com autorização da comunidade (RN-09).
