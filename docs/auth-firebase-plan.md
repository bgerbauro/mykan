# Próximo passo: backend real para autenticação e LGPD

## O que já foi prototipado nesta V1

- separação entre `área pública` e `área interna`;
- perfis `admin`, `coordenador` e `colaborador`;
- publicação controlada de cards e pautas;
- trilha de auditoria local;
- canal do titular e aviso de privacidade;
- bloqueio simples de publicação quando o texto parece conter dado pessoal direto.

## O que ainda não é segurança real

Como a aplicação atual é estática:

- o login vive em `localStorage`;
- as permissões estão no front-end;
- qualquer proteção pode ser contornada por quem controla o navegador;
- segredos e auditoria não têm garantias de integridade.

## Implementação recomendada no Firebase

### 1. Autenticação

- `Firebase Authentication` com `Email/Password`
- recuperação de senha por e-mail
- MFA para `admin` e, idealmente, `coordenador`

### 2. Persistência

- `Cloud Firestore` para `users`, `cards`, `checkpointItems`, `privacyRequests` e `auditLogs`
- `Firestore Security Rules` para negar escrita fora das permissões

### 3. Modelo mínimo de usuários

```json
{
  "uid": "auth-uid",
  "name": "Nome do usuário",
  "email": "usuario@empresa.com",
  "role": "admin",
  "active": true,
  "permissions": {
    "cards.create": true,
    "cards.edit": true,
    "cards.move": true,
    "cards.delete": true,
    "cards.publish": true,
    "cards.review": true,
    "checkpoint.create": true,
    "checkpoint.edit": true,
    "checkpoint.archive": true,
    "checkpoint.delete": true,
    "checkpoint.publish": true,
    "checkpoint.review": true,
    "ai.generate": true,
    "ai.configure": true,
    "users.manage": true,
    "audit.view": true
  },
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

### 4. Modelo mínimo de card com publicação pública

```json
{
  "title": "Texto interno",
  "description": "Texto interno completo",
  "dueDate": "2026-05-02",
  "discipline": "Arquitetura",
  "columnId": "backlog",
  "publicationStatus": "review",
  "publicSnapshot": {
    "title": "Texto público",
    "description": "Resumo público",
    "dueDate": "2026-05-02",
    "discipline": "Arquitetura",
    "columnId": "backlog"
  },
  "createdBy": "uid",
  "updatedBy": "uid",
  "publishedBy": "uid"
}
```

### 5. Modelo mínimo de pauta

```json
{
  "title": "Assunto interno",
  "archived": false,
  "topics": [
    {
      "text": "Texto interno do ponto",
      "date": "2026-05-02"
    }
  ],
  "publicationStatus": "published",
  "publicSnapshot": {
    "title": "Assunto público",
    "topics": [
      {
        "text": "Texto público do ponto",
        "date": "2026-05-02"
      }
    ]
  }
}
```

## Regras essenciais do backend

- leitura pública apenas de documentos com `publicationStatus = "published"`
- leitura interna apenas para usuários autenticados e ativos
- escrita em cards e checkpoint apenas conforme perfil/permissão
- gestão de usuários e leitura de auditoria apenas para `admin`
- trilha de auditoria gravada por backend ou função confiável

## Itens de LGPD para a próxima etapa

- revisar base legal de cada operação com jurídico ou encarregado;
- definir política de retenção para usuários, logs e pedidos do titular;
- formalizar plano de resposta a incidente;
- publicar aviso de privacidade definitivo;
- validar transferência internacional e uso da IA com o fornecedor;
- elaborar RIPD se o controlador entender que o tratamento apresenta risco relevante.
