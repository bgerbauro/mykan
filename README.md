# mYkan

MVP de um quadro Kanban para coordenação de projetos de construção civil com duas camadas de acesso:

- `Área pública`: leitura aberta de cards e pautas já publicados.
- `Área interna`: edição, publicação, governança, usuários locais e trilha de auditoria.

## Estrutura

- `index.html`: estrutura da aplicação e painéis de governança
- `css/styles.css`: layout, responsividade e identidade visual
- `js/app.js`: estado, renderização, drag-and-drop, autenticação local, publicação e persistência em `localStorage`
- `docs/auth-firebase-plan.md`: próximo passo para migrar a segurança para backend real

## Como visualizar

Opção 1:

- Abra `index.html` diretamente no navegador.

Opção 2:

- Sirva a pasta com qualquer servidor estático simples.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## O que a V1 implementa

- Navegação em 3 abas: `Painel`, `Ata de Checkpoint` e `Governança`
- Alternância entre `Área pública` e `Área interna`
- Login local de demonstração com perfis `admin`, `coordenador` e `colaborador`
- Permissões por perfil para edição, publicação, IA e gestão de usuários
- Fluxo de publicação com estados `Interno`, `Em revisão` e `Publicado`
- Snapshot público separado do conteúdo interno para cards e pautas
- Detecção simples de dado pessoal direto antes de publicar
- Canal do titular com registro local de solicitações
- Trilha de auditoria local para login, publicação, usuários e pedidos
- Geração de cards a partir de pontos com IA
- Persistência local no navegador

## Contas locais de demonstração

- `admin@mykan.local / admin123`
- `coordenador@mykan.local / coord123`
- `colaborador@mykan.local / colab123`

## Limite importante

Esta versão continua sendo um app estático. Portanto:

- o login é apenas local e demonstrativo;
- as permissões existem no front-end, não no servidor;
- a proteção real de dados e a segurança de autenticação exigem backend, regras de acesso e armazenamento seguro de segredos.

Para produção, o próximo passo continua sendo migrar autenticação, autorização e persistência para Firebase ou outro backend com regras reais.
