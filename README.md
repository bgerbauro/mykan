# mYkan

Aplicacao web estatica para acompanhamento de projetos de construcao civil, combinando quadro Kanban, pauta de checkpoints e camada interna de governanca.

## Visao geral

O projeto hoje opera com:

- leitura publica de cards e pautas publicadas;
- area interna autenticada para criar, editar, mover, publicar e arquivar conteudo;
- gestao de usuarios, permissoes, senhas, privacidade e trilha de auditoria;
- integracao opcional com a API da OpenAI para transformar pontos de checkpoint em cards.

## Stack atual

- `HTML`, `CSS` e `JavaScript` vanilla
- `Firebase Hosting`
- `Firebase Authentication` com `Email/Password`
- `Cloud Firestore`
- `OpenAI Responses API` para geracao assistida de cards

## Recursos implementados

- painel Kanban com colunas fixas e movimento de cards por drag and drop;
- controle de acesso por permissao para criar, editar, mover e excluir cards;
- publicacao de cards e pautas com estados `internal`, `review` e `published`;
- aba de checkpoint com assuntos ativos, historico arquivado e validacao de pontos;
- criacao de cards a partir de pontos do checkpoint via IA;
- gestao interna de usuarios com permissoes granulares;
- troca de senha, senha provisoria obrigando atualizacao e expiracao de sessao apos 30 minutos;
- exportacao de "meus dados", formulario de solicitacao do titular e trilha de auditoria;
- persistencia de cards, checkpoint, usuarios, logs e configuracoes no Firestore.

## Estrutura principal

- `index.html`: estrutura da aplicacao e modais
- `css/styles.css`: layout, responsividade e identidade visual
- `js/app.js`: estado da interface, regras de permissao, renderizacao, IA e fluxos da aplicacao
- `js/firebase-bootstrap.js`: bootstrap do Firebase Auth e Firestore
- `firestore.rules`: regras de acesso do banco
- `firebase.json`: configuracao de Hosting e deploy
- `docs/auth-firebase-plan.md`: registro do plano original de evolucao da autenticacao

## Como executar localmente

Sirva a raiz do projeto com um servidor estatico simples:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

Abrir `index.html` diretamente via `file://` nao e o fluxo recomendado, porque o Firebase Auth pode rejeitar dominios nao autorizados.

## Dependencias operacionais

Para a area interna funcionar de ponta a ponta, o projeto Firebase precisa estar configurado:

- projeto padrao definido em `.firebaserc`: `mykan-web`;
- `Email/Password` habilitado no Firebase Authentication;
- dominio de desenvolvimento autorizado no Firebase Auth;
- regras do Firestore publicadas a partir de `firestore.rules`.

Colecoes usadas pela aplicacao:

- `cards`
- `checkpointItems`
- `appConfig`
- `users`
- `privacyRequests`
- `auditLogs`
- `system`

## IA

A geracao de cards usa por padrao:

- endpoint `https://api.openai.com/v1/responses`
- modelo `gpt-5-mini`

A configuracao de IA e feita pela interface e depende da permissao `ai.configure`. A geracao depende da permissao `ai.generate`.

## Observacoes importantes

- A aplicacao continua sem etapa de build: e um front-end estatico servido diretamente.
- As regras do Firestore permitem leitura publica de cards, pautas e configuracoes publicas, mas restringem escrita conforme autenticacao e permissao.
- O primeiro usuario autenticado que ainda nao tenha perfil em `users` recebe bootstrap de perfil automaticamente; quando a base ainda nao foi inicializada, esse perfil vira `admin`.
- A configuracao da OpenAI e armazenada no navegador do usuario logado no cliente atual. Nao trate essa abordagem como cofre de segredos.
