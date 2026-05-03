(function () {
  const STORAGE_KEY = "mykan-board-v1";
  const DISCIPLINES_STORAGE_KEY = "mykan-disciplines-v1";
  const COLUMN_VISIBILITY_STORAGE_KEY = "mykan-column-visibility-v1";
  const ACTIVE_TAB_STORAGE_KEY = "mykan-active-tab-v1";
  const CHECKPOINT_STORAGE_KEY = "mykan-checkpoint-v1";
  const CHECKPOINT_UI_STORAGE_KEY = "mykan-checkpoint-ui-v1";
  const OPENAI_CONFIG_STORAGE_KEY = "mykan-openai-config-v1";
  const USERS_STORAGE_KEY = "mykan-users-v1";
  const SESSION_STORAGE_KEY = "mykan-session-v1";
  const SESSION_META_STORAGE_KEY = "mykan-session-meta-v1";
  const PRIVACY_REQUESTS_STORAGE_KEY = "mykan-privacy-requests-v1";
  const AUDIT_LOGS_STORAGE_KEY = "mykan-audit-logs-v1";
  const AVAILABLE_TABS = ["painel", "checkpoint", "governanca"];
  const DEFAULT_OPENAI_MODEL = "gpt-5-mini";
  const DEFAULT_OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
  const PASSWORD_MIN_LENGTH = 6;
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  const CHECKPOINT_CARD_COLUMN_ID = "backlog";
  const DEFAULT_DISCIPLINES = [
    "Arquitetura",
    "Estrutura",
    "Elétrica",
    "Hidráulica",
    "Ar-condicionado",
  ];
  const AVATAR_COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1", "#ec4899"];
  const ICONS = {
    plus:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    pencil:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash:    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    check:    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    block:    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    archive:  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z"/></svg>',
    grip:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>',
    restore:  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.9"/></svg>',
    spinner:  '<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  };
  const ROLE_LABELS = {
    admin: "Admin",
    user: "Usuário",
  };
  const ADMIN_PERMISSIONS = {
    "cards.create": true,
    "cards.edit": true,
    "cards.move": true,
    "cards.delete": true,
    "disciplines.create": true,
    "checkpoint.create": true,
    "checkpoint.edit": true,
    "checkpoint.validate": true,
    "checkpoint.archive": true,
    "checkpoint.delete": true,
    "ai.generate": true,
    "ai.configure": true,
    "users.manage": true,
    "audit.view": true,
  };
  const DEFAULT_USER_PERMISSIONS = {
    "cards.create": true,
    "cards.edit": true,
    "cards.move": true,
    "cards.delete": false,
    "disciplines.create": false,
    "checkpoint.create": true,
    "checkpoint.edit": true,
    "checkpoint.validate": false,
    "checkpoint.archive": false,
    "checkpoint.delete": false,
    "ai.generate": true,
    "ai.configure": false,
    "audit.view": false,
  };
  const PERMISSION_DEFINITIONS = [
    { key: "cards.create", label: "Criar cards", group: "cards" },
    { key: "cards.edit", label: "Editar cards", group: "cards" },
    { key: "cards.move", label: "Mover cards", group: "cards" },
    { key: "cards.delete", label: "Excluir cards", group: "cards" },
    { key: "disciplines.create", label: "Criar disciplinas", group: "cards" },
    { key: "checkpoint.create", label: "Criar pautas e pontos", group: "checkpoint" },
    { key: "checkpoint.edit", label: "Editar pautas e pontos", group: "checkpoint" },
    { key: "checkpoint.validate", label: "Validar pautas e pontos", group: "checkpoint" },
    { key: "checkpoint.archive", label: "Arquivar pautas", group: "checkpoint" },
    { key: "checkpoint.delete", label: "Excluir pautas e pontos", group: "checkpoint" },
    { key: "ai.generate", label: "Gerar card com IA", group: "governance" },
    { key: "ai.configure", label: "Configurar IA", group: "governance" },
    { key: "audit.view", label: "Ver auditoria", group: "governance" },
  ];
  const PERMISSION_GROUPS = [
    {
      key: "cards",
      label: "Permissões de cards",
      description: "Autonomias ligadas ao fluxo, criação e manutenção dos cards do painel.",
    },
    {
      key: "checkpoint",
      label: "Permissões de pautas",
      description: "Autonomias para criar, editar, arquivar e excluir assuntos e pontos do checkpoint.",
    },
    {
      key: "governance",
      label: "IA e governança",
      description: "Capacidades complementares de IA, auditoria e controles internos.",
    },
  ];
  const ROLE_PERMISSIONS = {
    admin: {
      "users.manage": true,
    },
    user: {
      "users.manage": false,
    },
  };
  const DATA_CLASSIFICATION = [
    {
      label: "Público",
      description:
        "Cards e pautas visíveis sem login para acompanhamento do projeto.",
    },
    {
      label: "Interno",
      description:
        "Contas, permissões, trilha de auditoria, configurações e operações de edição.",
    },
    {
      label: "Restrito",
      description:
        "Usuários, senhas locais, logs, pedidos do titular e configuração de IA.",
    },
  ];
  const ACCESS_CHROME_COPY = {
    boardHeroEyebrow: "",
    boardHeroTitle: "Painel de Fluxo do projeto",
    boardViewSummary:
      "Visualize os cart\u00f5es de tarefas do projeto. A edi\u00e7\u00e3o \u00e9 liberada apenas para usu\u00e1rios autenticados.",
    boardHeadingEyebrow: "Cardboard",
    boardHeadingTitle: "Cart\u00f5es dispon\u00edveis para consulta",
    boardHelpText: "",
    checkpointHeroEyebrow: "",
    checkpointHeroTitle: "Pautas dos checkpoints",
    checkpointViewSummary:
      "Est\u00e1 \u00e1rea mostra as pautas do projeto. Para editar, fa\u00e7a check-in.",
    checkpointActiveHeading: "Assuntos ativos",
    checkpointArchivedHeading: "Hist\u00f3rico de assuntos",
  };
  const COLUMNS = [
    {
      id: "backlog",
      title: "Pendências do Projeto",
      subtitle: "Tarefas brutas",
    },
    {
      id: "commitment",
      title: "Metas do Ciclo",
      subtitle: "Tarefas compromissadas",
    },
    {
      id: "in-progress",
      title: "Em Desenvolvimento",
      subtitle: "Produção ativa",
    },
    {
      id: "blocked",
      title: "Aguardando Info/Resposta",
      subtitle: "Travas do projeto",
    },
    {
      id: "coordination",
      title: "Compatibilização/Validação",
      subtitle: "Verificação de conformidade",
    },
    {
      id: "approved",
      title: "Entregues",
      subtitle: "Finalizado",
    },
  ];
  const DISCIPLINE_COLORS = {
    Arquitetura: {
      color: "#f59e0b",
      background: "rgba(254, 243, 199, 0.85)",
      pillBg: "#fef3c7",
      pillText: "#92400e",
    },
    Estrutura: {
      color: "#0ea5e9",
      background: "rgba(224, 242, 254, 0.88)",
      pillBg: "#e0f2fe",
      pillText: "#075985",
    },
    Elétrica: {
      color: "#8b5cf6",
      background: "rgba(237, 233, 254, 0.88)",
      pillBg: "#ede9fe",
      pillText: "#5b21b6",
    },
    Hidráulica: {
      color: "#10b981",
      background: "rgba(209, 250, 229, 0.88)",
      pillBg: "#d1fae5",
      pillText: "#065f46",
    },
    "Ar-condicionado": {
      color: "#f43f5e",
      background: "rgba(255, 228, 230, 0.9)",
      pillBg: "#ffe4e6",
      pillText: "#9f1239",
    },
  };
  const SEED_USERS = [
    {
      id: "user-admin",
      name: "Ana Master",
      email: "admin@mykan.local",
      password: "admin123",
      role: "admin",
      active: true,
      createdAt: "2026-05-02T09:00:00.000Z",
      mustChangePassword: false,
      passwordUpdatedAt: "2026-05-02T09:00:00.000Z",
    },
    {
      id: "user-001",
      name: "Carlos Usuário",
      email: "usuario1@mykan.local",
      password: "user123",
      role: "user",
      active: true,
      createdAt: "2026-05-02T09:05:00.000Z",
      mustChangePassword: false,
      passwordUpdatedAt: "2026-05-02T09:05:00.000Z",
      permissions: Object.assign({}, DEFAULT_USER_PERMISSIONS, {
        "cards.delete": true,
        "checkpoint.archive": true,
      }),
    },
    {
      id: "user-002",
      name: "Paula Usuária",
      email: "usuario2@mykan.local",
      password: "user123",
      role: "user",
      active: true,
      createdAt: "2026-05-02T09:10:00.000Z",
      mustChangePassword: false,
      passwordUpdatedAt: "2026-05-02T09:10:00.000Z",
      permissions: Object.assign({}, DEFAULT_USER_PERMISSIONS, {
        "cards.create": false,
        "checkpoint.delete": true,
      }),
    },
  ];
  const SEED_CARDS = [
    {
      id: "card-001",
      title: "Revisar shafts verticais do pavimento tipo",
      description:
        "Consolidar exigências de arquitetura e instalações para fechar a reserva técnica dos shafts.",
      dueDate: "2026-03-25",
      discipline: "Arquitetura",
      columnId: "backlog",
      blockedBy: "",
      waitingReason: "",
      publicationStatus: "published",
      publicSnapshot: {
        title: "Revisão de shafts verticais",
        description:
          "Compatibilização em andamento para fechamento das reservas técnicas dos shafts.",
        dueDate: "2026-03-25",
        discipline: "Arquitetura",
        columnId: "backlog",
      },
    },
    {
      id: "card-002",
      title: "Lançamento estrutural da casa de máquinas",
      description:
        "Compatibilizar vigas de transição com os apoios previstos no esquema arquitetônico.",
      dueDate: "2026-03-27",
      discipline: "Estrutura",
      columnId: "commitment",
      blockedBy: "",
      waitingReason: "",
      publicationStatus: "published",
      publicSnapshot: {
        title: "Lançamento estrutural da casa de máquinas",
        description:
          "Etapa comprometida para validação estrutural e alinhamento com arquitetura.",
        dueDate: "2026-03-27",
        discipline: "Estrutura",
        columnId: "commitment",
      },
    },
    {
      id: "card-003",
      title: "Rotas principais de eletrocalha do térreo",
      description:
        "Definir caminhos para alimentação de lojas e áreas técnicas antes do checkpoint semanal.",
      dueDate: "2026-03-24",
      discipline: "Elétrica",
      columnId: "in-progress",
      blockedBy: "",
      waitingReason: "",
      publicationStatus: "internal",
      publicSnapshot: null,
    },
    {
      id: "card-004",
      title: "Reservatório superior e barrilete",
      description:
        "Aguardando definição de altura final da cobertura para fechar prumadas hidráulicas.",
      dueDate: "2026-03-26",
      discipline: "Hidráulica",
      columnId: "blocked",
      blockedBy: "Estrutura",
      waitingReason: "Aguardando definição de altura final da cobertura.",
      publicationStatus: "review",
      publicSnapshot: {
        title: "Reservatório superior e barrilete",
        description:
          "Aguardando informação técnica de estrutura para avançar nas prumadas hidráulicas.",
        dueDate: "2026-03-26",
        discipline: "Hidráulica",
        columnId: "blocked",
      },
    },
    {
      id: "card-005",
      title: "Conferência de interferências no forro do lobby",
      description:
        "Validar cruzamentos entre dutos, luminárias e vigas invertidas com base na última revisão.",
      dueDate: "2026-03-28",
      discipline: "Ar-condicionado",
      columnId: "coordination",
      blockedBy: "",
      waitingReason: "",
      publicationStatus: "published",
      publicSnapshot: {
        title: "Conferência de interferências no forro do lobby",
        description:
          "Validação técnica em compatibilização para fechamento do pacote executivo.",
        dueDate: "2026-03-28",
        discipline: "Ar-condicionado",
        columnId: "coordination",
      },
    },
    {
      id: "card-006",
      title: "Detalhamento executivo de sanitário PNE",
      description:
        "Peça liberada para obra após aprovação da coordenação e checklist final de dimensões.",
      dueDate: "2026-03-20",
      discipline: "Arquitetura",
      columnId: "approved",
      blockedBy: "",
      waitingReason: "",
      publicationStatus: "published",
      publicSnapshot: {
        title: "Detalhamento executivo de sanitário PNE",
        description: "Pacote concluído e registrado como entregue.",
        dueDate: "2026-03-20",
        discipline: "Arquitetura",
        columnId: "approved",
      },
    },
  ];

  const state = {
    cards: normalizeCards(loadCards()),
    disciplines: loadDisciplines(),
    hiddenColumns: loadHiddenColumns(),
    activeTab: loadActiveTab(),
    checkpointItems: normalizeCheckpointItems(loadCheckpointItems()),
    checkpointArchivedVisible: loadCheckpointUiState(),
    checkpointOpenAiConfig: loadOpenAiConfig(),
    pendingCheckpointFocus: null,
    checkpointFeedback: null,
    checkpointGeneratingTopics: {},
    activeFilter: "Todas",
    draggedCardId: null,
    modalMode: "create",
    editingCardId: null,
    pendingBlockedMove: null,
    selectedGovernanceUserId: "",
    governanceUserModalMode: "create",
    governanceEditingUserId: "",
    governanceUserDraftPermissions: normalizeUserPermissions({}),
    auditActorFilter: "all",
    users: loadUsers(),
    sessionUserId: loadSessionUserId(),
    passwordResetRequired: false,
    passwordModalMode: "self-service",
    privacyRequests: loadPrivacyRequests(),
    auditLogs: loadAuditLogs(),
    searchQuery: "",
    aiPanelCollapsed: false,
  };
  const firebaseApi = window.mykanFirebaseApi || null;
  const firebaseState = {
    enabled: Boolean(firebaseApi && firebaseApi.enabled),
    hydrating: false,
    syncTimers: {},
    pendingLoginAudit: false,
    authUnsubscribe: null,
    sessionTimer: 0,
  };

  const elements = {
    sessionStatusLabel: document.getElementById("session-status-label"),
    openAuthButton: document.getElementById("open-auth-button"),
    logoutButton: document.getElementById("logout-button"),
    tabButtons: document.querySelectorAll("[data-tab-trigger]"),
    tabPanels: document.querySelectorAll("[data-tab-panel]"),
    boardHeroEyebrow: document.getElementById("board-hero-eyebrow"),
    boardHeroTitle: document.getElementById("board-hero-title"),
    boardViewSummary: document.getElementById("board-view-summary"),
    boardHeadingEyebrow: document.getElementById("board-heading-eyebrow"),
    boardHeadingTitle: document.getElementById("board-heading-title"),
    boardHelpText: document.getElementById("board-help-text"),
    boardAuthGate: document.getElementById("board-auth-gate"),
    boardGateLoginButton: document.getElementById("board-gate-login-button"),
    checkpointHeroEyebrow: document.getElementById("checkpoint-hero-eyebrow"),
    checkpointHeroTitle: document.getElementById("checkpoint-hero-title"),
    checkpointViewSummary: document.getElementById("checkpoint-view-summary"),
    checkpointActiveHeading: document.getElementById("checkpoint-active-heading"),
    checkpointArchivedHeading: document.getElementById("checkpoint-archived-heading"),
    checkpointAuthGate: document.getElementById("checkpoint-auth-gate"),
    checkpointGateLoginButton: document.getElementById("checkpoint-gate-login-button"),
    boardColumns: document.getElementById("board-columns"),
    checkpointActiveList: document.getElementById("checkpoint-active-list"),
    checkpointArchivedList: document.getElementById("checkpoint-archived-list"),
    checkpointAiPanel: document.getElementById("checkpoint-ai-panel"),
    checkpointAiSummary: document.getElementById("checkpoint-ai-summary"),
    checkpointConfigureAiButton: document.getElementById("checkpoint-configure-ai-button"),
    checkpointFeedback: document.getElementById("checkpoint-feedback"),
    checkpointAddButton: document.getElementById("checkpoint-add-button"),
    checkpointArchivedPanel: document.getElementById("checkpoint-archived-panel"),
    checkpointArchivedContent: document.getElementById("checkpoint-archived-content"),
    checkpointToggleArchivedButton: document.getElementById("checkpoint-toggle-archived-button"),
    columnVisibilityFilters: document.getElementById("column-visibility-filters"),
    disciplineFilterSelect: document.getElementById("discipline-filter-select"),
    newCardButton: document.getElementById("new-card-button"),
    newDisciplineButton: document.getElementById("new-discipline-button"),
    modalBackdrop: document.getElementById("card-modal-backdrop"),
    modalTitle: document.getElementById("modal-title"),
    closeModalButton: document.getElementById("close-modal-button"),
    cancelModalButton: document.getElementById("cancel-modal-button"),
    submitModalButton: document.getElementById("submit-modal-button"),
    form: document.getElementById("card-form"),
    formError: document.getElementById("form-error"),
    columnField: document.getElementById("card-column-field"),
    titleInput: document.getElementById("card-title"),
    descriptionInput: document.getElementById("card-description"),
    dueDateInput: document.getElementById("card-due-date"),
    disciplineSelect: document.getElementById("card-discipline"),
    columnSelect: document.getElementById("card-column"),
    blockModalBackdrop: document.getElementById("block-modal-backdrop"),
    closeBlockModalButton: document.getElementById("close-block-modal-button"),
    cancelBlockModalButton: document.getElementById("cancel-block-modal-button"),
    blockForm: document.getElementById("block-form"),
    blockDisciplineSelect: document.getElementById("block-discipline"),
    blockReasonInput: document.getElementById("block-reason"),
    blockFormError: document.getElementById("block-form-error"),
    disciplineModalBackdrop: document.getElementById("discipline-modal-backdrop"),
    closeDisciplineModalButton: document.getElementById("close-discipline-modal-button"),
    cancelDisciplineModalButton: document.getElementById("cancel-discipline-modal-button"),
    disciplineForm: document.getElementById("discipline-form"),
    disciplineNameInput: document.getElementById("discipline-name"),
    disciplineFormError: document.getElementById("discipline-form-error"),
    authModalBackdrop: document.getElementById("auth-modal-backdrop"),
    closeAuthModalButton: document.getElementById("close-auth-modal-button"),
    cancelAuthModalButton: document.getElementById("cancel-auth-modal-button"),
    authForm: document.getElementById("auth-form"),
    authModalHelp: document.getElementById("auth-modal-help"),
    authEmailInput: document.getElementById("auth-email"),
    authPasswordInput: document.getElementById("auth-password"),
    authForgotPasswordButton: document.getElementById("auth-forgot-password-button"),
    authFormError: document.getElementById("auth-form-error"),
    openGovernanceInfoButton: document.getElementById("open-governance-info-button"),
    governanceInfoModalBackdrop: document.getElementById("governance-info-modal-backdrop"),
    closeGovernanceInfoModalButton: document.getElementById("close-governance-info-modal-button"),
    cancelGovernanceInfoModalButton: document.getElementById("cancel-governance-info-modal-button"),
    openPrivacyRequestButton: document.getElementById("open-privacy-request-button"),
    privacyRequestModalBackdrop: document.getElementById("privacy-request-modal-backdrop"),
    closePrivacyRequestModalButton: document.getElementById("close-privacy-request-modal-button"),
    cancelPrivacyRequestModalButton: document.getElementById("cancel-privacy-request-modal-button"),
    privacyNoticeContent: document.getElementById("privacy-notice-content"),
    privacyRequestForm: document.getElementById("privacy-request-form"),
    privacyRequestName: document.getElementById("privacy-request-name"),
    privacyRequestEmail: document.getElementById("privacy-request-email"),
    privacyRequestType: document.getElementById("privacy-request-type"),
    privacyRequestMessage: document.getElementById("privacy-request-message"),
    privacyRequestFeedback: document.getElementById("privacy-request-feedback"),
    permissionModelList: document.getElementById("permission-model-list"),
    dataClassificationList: document.getElementById("data-classification-list"),
    userAdminPanel: document.getElementById("user-admin-panel"),
    openCreateUserButton: document.getElementById("open-create-user-button"),
    editSelectedUserButton: document.getElementById("edit-selected-user-button"),
    userModalBackdrop: document.getElementById("user-modal-backdrop"),
    userModalTitle: document.getElementById("user-modal-title"),
    userModalHelp: document.getElementById("user-modal-help"),
    closeUserModalButton: document.getElementById("close-user-modal-button"),
    cancelUserModalButton: document.getElementById("cancel-user-modal-button"),
    submitUserModalButton: document.getElementById("submit-user-modal-button"),
    userForm: document.getElementById("user-form"),
    userNameInput: document.getElementById("user-name"),
    userEmailInput: document.getElementById("user-email"),
    userPasswordInput: document.getElementById("user-password"),
    userRoleInput: document.getElementById("user-role"),
    userActiveInput: document.getElementById("user-active"),
    userActiveState: document.getElementById("user-active-state"),
    userActiveHint: document.getElementById("user-active-hint"),
    userPermissionNote: document.getElementById("user-permission-note"),
    userPermissionGrid: document.getElementById("user-permission-grid"),
    userFormFeedback: document.getElementById("user-form-feedback"),
    usersList: document.getElementById("users-list"),
    exportMyDataPanel: document.getElementById("export-my-data-panel"),
    exportMyDataButton: document.getElementById("export-my-data-button"),
    passwordGovernancePanel: document.getElementById("password-governance-panel"),
    passwordGovernanceCopy: document.getElementById("password-governance-copy"),
    openPasswordModalButton: document.getElementById("open-password-modal-button"),
    passwordModalBackdrop: document.getElementById("password-modal-backdrop"),
    passwordModalTitle: document.getElementById("password-modal-title"),
    passwordModalHelp: document.getElementById("password-modal-help"),
    closePasswordModalButton: document.getElementById("close-password-modal-button"),
    cancelPasswordModalButton: document.getElementById("cancel-password-modal-button"),
    submitPasswordModalButton: document.getElementById("submit-password-modal-button"),
    passwordForm: document.getElementById("password-form"),
    passwordCurrentInput: document.getElementById("password-current"),
    passwordNextInput: document.getElementById("password-next"),
    passwordConfirmInput: document.getElementById("password-confirm"),
    passwordFormNote: document.getElementById("password-form-note"),
    passwordFormFeedback: document.getElementById("password-form-feedback"),
    auditLogPanel: document.getElementById("audit-log-panel"),
    openAuditLogButton: document.getElementById("open-audit-log-button"),
    auditLogModalBackdrop: document.getElementById("audit-log-modal-backdrop"),
    closeAuditLogModalButton: document.getElementById("close-audit-log-modal-button"),
    cancelAuditLogModalButton: document.getElementById("cancel-audit-log-modal-button"),
    auditActorFilter: document.getElementById("audit-actor-filter"),
    auditLogList: document.getElementById("audit-log-list"),
    confirmModalBackdrop: document.getElementById("confirm-modal-backdrop"),
    confirmModalMessage: document.getElementById("confirm-modal-message"),
    confirmModalOk: document.getElementById("confirm-modal-ok"),
    confirmModalCancel: document.getElementById("confirm-modal-cancel"),
    openaiConfigModalBackdrop: document.getElementById("openai-config-modal-backdrop"),
    openaiConfigForm: document.getElementById("openai-config-form"),
    openaiConfigApikey: document.getElementById("openai-config-apikey"),
    openaiConfigApikeyLabel: document.getElementById("openai-config-apikey-label"),
    openaiConfigModel: document.getElementById("openai-config-model"),
    openaiConfigEndpoint: document.getElementById("openai-config-endpoint"),
    closeOpenaiConfigModalButton: document.getElementById("close-openai-config-modal"),
    openaiConfigCancelButton: document.getElementById("openai-config-cancel"),
    boardSearchInput: document.getElementById("board-search-input"),
    boardColumnsShell: document.getElementById("board-columns-shell"),
    boardColumnIndicator: document.getElementById("board-column-indicator"),
    boardColumnIndicatorText: document.getElementById("board-column-indicator-text"),
    checkpointAddTopButton: document.getElementById("checkpoint-add-top-button"),
    checkpointAiToggle: document.getElementById("checkpoint-ai-toggle"),
    checkpointAiBody: document.getElementById("checkpoint-ai-body"),
    dateShortcutToday: document.getElementById("date-shortcut-today"),
    dateShortcutPlus7: document.getElementById("date-shortcut-plus7"),
  };

  init();

  function init() {
    syncDisciplinesWithCards();
    reconcileStoredSession();

    if (firebaseState.enabled) {
      state.sessionUserId = "";
      saveSessionUserId("");
    } else {
      ensureCurrentUserIsValid();

      if (state.sessionUserId) {
        var sessionMeta = getCurrentSessionMetaForUser(state.sessionUserId);

        if (sessionMeta) {
          scheduleSessionTimeout(sessionMeta.expiresAt);
        } else {
          applySessionMeta(state.sessionUserId);
        }
      }
    }

    populateSelects();
    elements.authModalHelp.textContent =
      "Use seu acesso interno. Recupere a senha por e-mail.";
    bindEvents();
    render();

    if (!firebaseState.enabled) {
      maybeRequirePasswordReset(getCurrentUser());
    }

    setupFirebaseIntegration();
  }

  function bindEvents() {
    elements.tabButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        setActiveTab(button.getAttribute("data-tab-trigger"), {
          updateHash: true,
          scrollIntoView: true,
        });
      });
    });

    window.addEventListener("hashchange", function () {
      const hashTab = getTabFromHash();

      if (!hashTab) {
        return;
      }

      setActiveTab(hashTab, {
        scrollIntoView: true,
      });
    });

    window.addEventListener("resize", function () {
      syncColumnDropZoneHeights();
      autoResizeCheckpointTitleInputs();
    });

    elements.openAuthButton.addEventListener("click", openAuthModal);
    elements.logoutButton.addEventListener("click", logoutCurrentUser);
    elements.boardGateLoginButton.addEventListener("click", openAuthModal);
    elements.checkpointGateLoginButton.addEventListener("click", openAuthModal);

    elements.newCardButton.addEventListener("click", function () {
      openModal("create", null);
    });
    elements.newDisciplineButton.addEventListener("click", openDisciplineModal);
    elements.checkpointConfigureAiButton.addEventListener("click", configureCheckpointAi);
    elements.checkpointAddButton.addEventListener("click", addCheckpointItem);
    elements.checkpointToggleArchivedButton.addEventListener("click", toggleArchivedCheckpoint);
    elements.disciplineFilterSelect.addEventListener("change", function () {
      state.activeFilter = elements.disciplineFilterSelect.value;
      render();
    });

    elements.checkpointActiveList.addEventListener("input", function (event) {
      const titleInput = event.target.closest("[data-checkpoint-title-input]");

      if (titleInput) {
        resizeCheckpointTitleInput(titleInput);
        updateCheckpointTitle(
          titleInput.getAttribute("data-checkpoint-id"),
          titleInput.value,
        );
        return;
      }

      const topicInput = event.target.closest("[data-checkpoint-topic-input]");

      if (!topicInput) {
        return;
      }

      updateCheckpointTopicText(
        topicInput.getAttribute("data-checkpoint-id"),
        topicInput.getAttribute("data-topic-id"),
        topicInput.value,
      );
    });

    elements.checkpointActiveList.addEventListener("change", function (event) {
      const dateInput = event.target.closest("[data-checkpoint-topic-date]");

      if (!dateInput) {
        return;
      }

      updateCheckpointTopicDate(
        dateInput.getAttribute("data-checkpoint-id"),
        dateInput.getAttribute("data-topic-id"),
        dateInput.value,
      );
    });

    elements.checkpointActiveList.addEventListener("click", function (event) {
      const deletePautaButton = event.target.closest("[data-delete-checkpoint-item]");

      if (deletePautaButton) {
        deleteCheckpointItem(deletePautaButton.getAttribute("data-delete-checkpoint-item"));
        return;
      }

      const deleteButton = event.target.closest("[data-delete-checkpoint-topic]");

      if (deleteButton) {
        deleteCheckpointTopic(
          deleteButton.getAttribute("data-checkpoint-id"),
          deleteButton.getAttribute("data-topic-id"),
        );
        return;
      }

      const generateButton = event.target.closest("[data-generate-card-from-topic]");

      if (generateButton) {
        generateCardFromCheckpointTopic(
          generateButton.getAttribute("data-checkpoint-id"),
          generateButton.getAttribute("data-topic-id"),
        );
        return;
      }

      const addTopicButton = event.target.closest("[data-add-checkpoint-topic]");

      if (addTopicButton) {
        addCheckpointTopic(addTopicButton.getAttribute("data-add-checkpoint-topic"));
        return;
      }

      const validateTopicButton = event.target.closest("[data-validate-checkpoint-topic]");

      if (validateTopicButton) {
        validateCheckpointTopic(
          validateTopicButton.getAttribute("data-checkpoint-id"),
          validateTopicButton.getAttribute("data-topic-id"),
        );
        return;
      }

      const blockTopicButton = event.target.closest("[data-block-checkpoint-topic]");

      if (blockTopicButton) {
        blockCheckpointTopic(
          blockTopicButton.getAttribute("data-checkpoint-id"),
          blockTopicButton.getAttribute("data-topic-id"),
        );
        return;
      }

      const validateItemButton = event.target.closest("[data-validate-checkpoint]");

      if (validateItemButton) {
        validateCheckpointItem(validateItemButton.getAttribute("data-validate-checkpoint"));
        return;
      }

      const blockItemButton = event.target.closest("[data-block-checkpoint]");

      if (blockItemButton) {
        blockCheckpointItem(blockItemButton.getAttribute("data-block-checkpoint"));
        return;
      }

      const archiveButton = event.target.closest("[data-archive-checkpoint]");

      if (archiveButton) {
        archiveCheckpointItem(archiveButton.getAttribute("data-archive-checkpoint"));
        return;
      }

      const reviewButton = event.target.closest("[data-review-checkpoint]");

      if (reviewButton) {
        sendCheckpointToReview(reviewButton.getAttribute("data-review-checkpoint"));
        return;
      }

      const publishButton = event.target.closest("[data-publish-checkpoint]");

      if (publishButton) {
        publishCheckpointItem(publishButton.getAttribute("data-publish-checkpoint"));
        return;
      }

      const unpublishButton = event.target.closest("[data-unpublish-checkpoint]");

      if (unpublishButton) {
        unpublishCheckpointItem(unpublishButton.getAttribute("data-unpublish-checkpoint"));
      }
    });

    elements.checkpointArchivedList.addEventListener("click", function (event) {
      const restoreButton = event.target.closest("[data-restore-checkpoint]");

      if (!restoreButton) {
        return;
      }

      restoreCheckpointItem(restoreButton.getAttribute("data-restore-checkpoint"));
    });

    elements.closeModalButton.addEventListener("click", closeModal);
    elements.cancelModalButton.addEventListener("click", closeModal);
    elements.closeBlockModalButton.addEventListener("click", closeBlockModal);
    elements.cancelBlockModalButton.addEventListener("click", closeBlockModal);
    elements.closeDisciplineModalButton.addEventListener("click", closeDisciplineModal);
    elements.cancelDisciplineModalButton.addEventListener("click", closeDisciplineModal);
    elements.closeAuthModalButton.addEventListener("click", closeAuthModal);
    elements.cancelAuthModalButton.addEventListener("click", closeAuthModal);
    elements.authForgotPasswordButton.addEventListener("click", submitForgotPasswordRequest);
    document.getElementById("auth-privacy-link").addEventListener("click", function () {
      closeAuthModal();
      openGovernanceInfoModal();
    });
    elements.exportMyDataButton.addEventListener("click", exportMyData);
    elements.openPasswordModalButton.addEventListener("click", function () {
      openPasswordModal({ required: false });
    });
    elements.openGovernanceInfoButton.addEventListener("click", openGovernanceInfoModal);
    elements.closeGovernanceInfoModalButton.addEventListener("click", closeGovernanceInfoModal);
    elements.cancelGovernanceInfoModalButton.addEventListener("click", closeGovernanceInfoModal);
    elements.openPrivacyRequestButton.addEventListener("click", openPrivacyRequestModal);
    elements.closePrivacyRequestModalButton.addEventListener("click", closePrivacyRequestModal);
    elements.cancelPrivacyRequestModalButton.addEventListener("click", closePrivacyRequestModal);
    elements.openCreateUserButton.addEventListener("click", function () {
      openUserModal("create");
    });
    elements.editSelectedUserButton.addEventListener("click", function () {
      if (!state.selectedGovernanceUserId) {
        return;
      }

      openUserModal("edit", state.selectedGovernanceUserId);
    });
    elements.closeUserModalButton.addEventListener("click", closeUserModal);
    elements.cancelUserModalButton.addEventListener("click", closeUserModal);
    elements.closePasswordModalButton.addEventListener("click", closePasswordModal);
    elements.cancelPasswordModalButton.addEventListener("click", closePasswordModal);
    elements.userRoleInput.addEventListener("change", handleUserRoleInputChange);
    elements.userActiveInput.addEventListener("change", syncUserActiveToggle);
    elements.openAuditLogButton.addEventListener("click", openAuditLogModal);
    elements.closeAuditLogModalButton.addEventListener("click", closeAuditLogModal);
    elements.cancelAuditLogModalButton.addEventListener("click", closeAuditLogModal);
    elements.auditActorFilter.addEventListener("change", function () {
      state.auditActorFilter = elements.auditActorFilter.value;
      renderAuditLogs();
    });
    elements.userPermissionGrid.addEventListener("change", function (event) {
      const toggle = event.target.closest("[data-user-draft-permission]");

      if (!toggle) {
        return;
      }

      state.governanceUserDraftPermissions[toggle.getAttribute("data-user-draft-permission")] =
        toggle.checked;
    });

    elements.modalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.modalBackdrop) {
        closeModal();
      }
    });
    elements.blockModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.blockModalBackdrop) {
        closeBlockModal();
      }
    });
    elements.disciplineModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.disciplineModalBackdrop) {
        closeDisciplineModal();
      }
    });
    elements.authModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.authModalBackdrop) {
        closeAuthModal();
      }
    });
    elements.passwordModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.passwordModalBackdrop) {
        closePasswordModal();
      }
    });
    elements.governanceInfoModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.governanceInfoModalBackdrop) {
        closeGovernanceInfoModal();
      }
    });
    elements.privacyRequestModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.privacyRequestModalBackdrop) {
        closePrivacyRequestModal();
      }
    });
    elements.userModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.userModalBackdrop) {
        closeUserModal();
      }
    });
    elements.auditLogModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.auditLogModalBackdrop) {
        closeAuditLogModal();
      }
    });

    elements.form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitForm();
    });
    elements.blockForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitBlockForm();
    });
    elements.disciplineForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitDisciplineForm();
    });
    elements.authForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAuthForm();
    });
    elements.privacyRequestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitPrivacyRequest();
    });
    elements.userForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitUserForm();
    });
    elements.passwordForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitPasswordForm();
    });
    elements.closeOpenaiConfigModalButton.addEventListener("click", closeOpenAiConfigModal);
    elements.openaiConfigCancelButton.addEventListener("click", closeOpenAiConfigModal);
    elements.openaiConfigModalBackdrop.addEventListener("click", function (event) {
      if (event.target === elements.openaiConfigModalBackdrop) {
        closeOpenAiConfigModal();
      }
    });
    elements.openaiConfigForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const currentConfig = state.checkpointOpenAiConfig;
      const apiKeyValue = elements.openaiConfigApikey.value.trim();
      state.checkpointOpenAiConfig = normalizeOpenAiConfig({
        apiKey: apiKeyValue || currentConfig.apiKey,
        model: elements.openaiConfigModel.value,
        endpoint: elements.openaiConfigEndpoint.value,
      });
      saveOpenAiConfig(state.checkpointOpenAiConfig);
      recordAudit("ai.configure", "Configuração de IA atualizada.");
      closeOpenAiConfigModal();
      setCheckpointFeedback(
        state.checkpointOpenAiConfig.apiKey ? "success" : "error",
        state.checkpointOpenAiConfig.apiKey
          ? "IA configurada com sucesso."
          : "Nenhuma chave de API configurada. A geração de cartões permanece desativada.",
      );
      renderCheckpoint();
    });

    elements.usersList.addEventListener("click", function (event) {
      const selectButton = event.target.closest("[data-select-governance-user]");

      if (selectButton) {
        selectGovernanceUser(selectButton.getAttribute("data-select-governance-user"));
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (!elements.authModalBackdrop.classList.contains("hidden")) {
        closeAuthModal();
      }

      if (!elements.governanceInfoModalBackdrop.classList.contains("hidden")) {
        closeGovernanceInfoModal();
      }

      if (!elements.privacyRequestModalBackdrop.classList.contains("hidden")) {
        closePrivacyRequestModal();
      }

      if (!elements.passwordModalBackdrop.classList.contains("hidden")) {
        closePasswordModal();
      }

      if (!elements.userModalBackdrop.classList.contains("hidden")) {
        closeUserModal();
      }

      if (!elements.auditLogModalBackdrop.classList.contains("hidden")) {
        closeAuditLogModal();
      }

      if (!elements.modalBackdrop.classList.contains("hidden")) {
        closeModal();
      }

      if (!elements.blockModalBackdrop.classList.contains("hidden")) {
        closeBlockModal();
      }

      if (!elements.disciplineModalBackdrop.classList.contains("hidden")) {
        closeDisciplineModal();
      }

      if (!elements.confirmModalBackdrop.classList.contains("hidden")) {
        elements.confirmModalCancel.click();
      }

      if (!elements.openaiConfigModalBackdrop.classList.contains("hidden")) {
        closeOpenAiConfigModal();
      }
    });

    if (elements.boardSearchInput) {
      elements.boardSearchInput.addEventListener("input", function () {
        state.searchQuery = elements.boardSearchInput.value;
        renderBoard();
      });
    }

    if (elements.dateShortcutToday) {
      elements.dateShortcutToday.addEventListener("click", function () {
        elements.dueDateInput.value = getTodayString();
      });
    }

    if (elements.dateShortcutPlus7) {
      elements.dateShortcutPlus7.addEventListener("click", function () {
        const base = elements.dueDateInput.value || getTodayString();
        const d = new Date(base + "T12:00:00");
        d.setDate(d.getDate() + 7);
        elements.dueDateInput.value = d.toISOString().slice(0, 10);
      });
    }

    if (elements.checkpointAddTopButton) {
      elements.checkpointAddTopButton.addEventListener("click", addCheckpointItem);
    }

    if (elements.checkpointAiToggle) {
      elements.checkpointAiToggle.addEventListener("click", function () {
        state.aiPanelCollapsed = !state.aiPanelCollapsed;
        elements.checkpointAiToggle.setAttribute("aria-expanded", String(!state.aiPanelCollapsed));
        if (elements.checkpointAiBody) {
          elements.checkpointAiBody.classList.toggle("is-collapsed", state.aiPanelCollapsed);
        }
      });
    }

    if (elements.boardColumnsShell) {
      elements.boardColumnsShell.addEventListener("scroll", function () {
        updateColumnIndicator();
      });
    }

    elements.boardColumns.addEventListener("click", function (event) {
      const addBtn = event.target.closest("[data-add-to-column]");
      if (addBtn) {
        openModal("create", null);
      }
    });

    elements.boardColumns.addEventListener("change", function (event) {
      const moveSelect = event.target.closest("[data-move-card]");
      if (!moveSelect || !can("cards.move")) return;
      const cardId = moveSelect.getAttribute("data-move-card");
      const newColumnId = moveSelect.value;
      const card = getCardById(cardId);
      if (!card || card.columnId === newColumnId) return;
      if (newColumnId === "blocked" && !card.blockedBy) {
        state.pendingBlockedMove = { type: "column", cardId: cardId, targetColumnId: newColumnId };
        openBlockModal();
        return;
      }
      state.cards = state.cards.map(function (c) {
        return c.id === cardId ? Object.assign({}, c, { columnId: newColumnId, blockedBy: newColumnId === "blocked" ? c.blockedBy : "", waitingReason: newColumnId === "blocked" ? c.waitingReason : "" }) : c;
      });
      recordAudit("card.move", 'Cartão "' + card.title + '" movido para ' + newColumnId + '.');
      saveAndRender();
    });
  }

  function render() {
    renderAccessChrome();
    renderTabs();
    populateSelects();
    renderFilters();
    renderColumnVisibilityFilters();
    renderBoard();
    renderCheckpoint();
    renderGovernance();
  }

  function renderAccessChrome() {
    const user = getCurrentUser();
    const publicView = isPublicView();
    const internalUnlocked = isInternalViewUnlocked();
    const governanceVisible = internalUnlocked;

    if (!governanceVisible && state.activeTab === "governanca") {
      state.activeTab = "painel";
      saveActiveTab("painel");

      if (window.location.hash === "#governanca") {
        window.location.hash = "painel";
      }
    }

    elements.tabButtons.forEach(function (button) {
      const isGovernance = button.getAttribute("data-tab-trigger") === "governanca";
      button.classList.toggle("hidden", isGovernance && !governanceVisible);
    });

    elements.sessionStatusLabel.textContent = user ? user.name + " · " + getRoleLabel(user.role) : "";
    elements.sessionStatusLabel.classList.toggle("hidden", !user);

    elements.openAuthButton.classList.toggle("hidden", Boolean(user));
    elements.logoutButton.classList.toggle("hidden", !user);

    elements.boardHeroEyebrow.textContent = ACCESS_CHROME_COPY.boardHeroEyebrow;
    elements.boardHeroEyebrow.classList.toggle("hidden", !ACCESS_CHROME_COPY.boardHeroEyebrow);
    elements.boardHeroTitle.textContent = ACCESS_CHROME_COPY.boardHeroTitle;
    elements.boardViewSummary.textContent = ACCESS_CHROME_COPY.boardViewSummary;
    elements.boardHeadingEyebrow.textContent = ACCESS_CHROME_COPY.boardHeadingEyebrow;
    elements.boardHeadingTitle.textContent = ACCESS_CHROME_COPY.boardHeadingTitle;
    elements.boardHelpText.textContent = ACCESS_CHROME_COPY.boardHelpText;
    elements.boardHelpText.classList.toggle("hidden", !ACCESS_CHROME_COPY.boardHelpText);

    elements.checkpointHeroEyebrow.textContent = ACCESS_CHROME_COPY.checkpointHeroEyebrow;
    elements.checkpointHeroEyebrow.classList.toggle("hidden", !ACCESS_CHROME_COPY.checkpointHeroEyebrow);
    elements.checkpointHeroTitle.textContent = ACCESS_CHROME_COPY.checkpointHeroTitle;
    elements.checkpointViewSummary.textContent = ACCESS_CHROME_COPY.checkpointViewSummary;
    elements.checkpointActiveHeading.textContent = ACCESS_CHROME_COPY.checkpointActiveHeading;
    elements.checkpointArchivedHeading.textContent = ACCESS_CHROME_COPY.checkpointArchivedHeading;

    elements.boardAuthGate.classList.toggle("hidden", internalUnlocked || publicView);
    elements.checkpointAuthGate.classList.toggle("hidden", internalUnlocked || publicView);
    elements.checkpointAiPanel.classList.toggle("hidden", publicView || !internalUnlocked);
    elements.checkpointAddButton.classList.toggle(
      "hidden",
      publicView || !can("checkpoint.create"),
    );
    elements.newCardButton.classList.toggle("hidden", publicView || !can("cards.create"));
    elements.newDisciplineButton.classList.toggle(
      "hidden",
      publicView || !can("disciplines.create"),
    );
    elements.checkpointConfigureAiButton.disabled = !can("ai.configure");
    elements.columnVisibilityFilters
      .querySelectorAll("[data-toggle-column]")
      .forEach(function (button) {
        button.disabled = false;
      });
  }

  function renderTabs() {
    elements.tabButtons.forEach(function (button) {
      const isActive = button.getAttribute("data-tab-trigger") === state.activeTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    elements.tabPanels.forEach(function (panel) {
      const isActive = panel.getAttribute("data-tab-panel") === state.activeTab;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  }

  function setActiveTab(tabId, options) {
    if (!AVAILABLE_TABS.includes(tabId)) {
      return;
    }

    if (tabId === "governanca" && !isAuthenticated()) {
      tabId = "painel";
    }

    const config = Object.assign(
      {
        updateHash: false,
        scrollIntoView: false,
      },
      options,
    );

    state.activeTab = tabId;
    saveActiveTab(tabId);
    renderTabs();

    if (config.updateHash) {
      const nextHash = "#" + tabId;

      if (window.location.hash !== nextHash) {
        window.location.hash = tabId;
        return;
      }
    }

    if (config.scrollIntoView) {
      scrollToActiveTab();
    }
  }

  function renderFilters() {
    const options = ["Todas"].concat(state.disciplines);
    elements.disciplineFilterSelect.innerHTML = options
      .map(function (option) {
        return (
          '<option value="' +
          escapeHtml(option) +
          '">' +
          escapeHtml(option === "Todas" ? "Todas as disciplinas" : option) +
          "</option>"
        );
      })
      .join("");

    if (!options.includes(state.activeFilter)) {
      state.activeFilter = "Todas";
    }

    elements.disciplineFilterSelect.value = state.activeFilter;
  }

  function renderBoard() {
    const publicView = isPublicView();

    elements.boardColumns.innerHTML = "";

    if (!publicView && !isInternalViewUnlocked()) {
      syncColumnDropZoneHeights();
      updateColumnIndicator();
      return;
    }

    if (firebaseState.hydrating) {
      const visibleColumns = COLUMNS.filter(function (c) {
        return !state.hiddenColumns.includes(c.id);
      });
      visibleColumns.forEach(function (column) {
        const skeletonCol = document.createElement("section");
        skeletonCol.className = "column";
        skeletonCol.innerHTML =
          '<div class="column-header"><div><h3>' + column.title + '</h3><p>' + column.subtitle + '</p></div></div>' +
          '<div class="column-body" style="display:grid;gap:12px;padding:4px">' +
          '<div class="skeleton-card"></div>' +
          '<div class="skeleton-card" style="height:90px"></div>' +
          '<div class="skeleton-card" style="height:80px;opacity:0.55"></div>' +
          '</div>';
        elements.boardColumns.appendChild(skeletonCol);
      });
      updateColumnIndicator();
      return;
    }

    const canAddCard = !publicView && can("cards.create");

    COLUMNS.forEach(function (column) {
      if (state.hiddenColumns.includes(column.id)) {
        return;
      }

      const cards = getVisibleCardsByColumn(column.id);
      const columnElement = document.createElement("section");
      columnElement.className = "column";

      columnElement.innerHTML =
        '<div class="column-header">' +
        "<div>" +
        "<h3>" +
        column.title +
        "</h3>" +
        "<p>" +
        column.subtitle +
        "</p>" +
        "</div>" +
        '<span class="column-counter">' +
        cards.length +
        "</span>" +
        "</div>" +
        '<div class="column-progress"><div class="column-progress-bar" style="width:' +
        Math.min(cards.length / 8 * 100, 100) +
        '%"></div></div>' +
        '<div class="column-body" data-column-drop-zone="' +
        column.id +
        '"></div>';

      const body = columnElement.querySelector("[data-column-drop-zone]");

      setupColumnDropZone(body, column.id);

      if (!cards.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "column-empty";
        emptyState.innerHTML = publicView
          ? '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="5" y="9" width="34" height="24" rx="7" stroke="#c8d5e0" stroke-width="2" stroke-dasharray="5 3"/><line x1="13" y1="19" x2="31" y2="19" stroke="#c8d5e0" stroke-width="2.5" stroke-linecap="round"/><line x1="13" y1="26" x2="23" y2="26" stroke="#c8d5e0" stroke-width="2.5" stroke-linecap="round"/></svg><p>Nenhum cartão publicado nesta etapa.</p>'
          : '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="5" y="9" width="34" height="24" rx="7" stroke="#c8d5e0" stroke-width="2" stroke-dasharray="5 3"/><line x1="13" y1="19" x2="31" y2="19" stroke="#c8d5e0" stroke-width="2.5" stroke-linecap="round"/><line x1="13" y1="26" x2="23" y2="26" stroke="#c8d5e0" stroke-width="2.5" stroke-linecap="round"/><circle cx="34" cy="30" r="7" fill="#38bdf8"/><line x1="34" y1="27" x2="34" y2="33" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="30" x2="37" y2="30" stroke="white" stroke-width="2" stroke-linecap="round"/></svg><p>Arraste cartões para esta etapa do fluxo.</p>';
        body.appendChild(emptyState);
      } else {
        cards.forEach(function (card) {
          body.appendChild(
            createCardElement(card, {
              publicView: publicView,
            }),
          );
        });
      }

      if (canAddCard) {
        const addBtn = document.createElement("button");
        addBtn.className = "new-card-column-button btn-icon";
        addBtn.type = "button";
        addBtn.setAttribute("data-add-to-column", column.id);
        addBtn.innerHTML = ICONS.plus + " Novo cartão";
        columnElement.appendChild(addBtn);
      }

      elements.boardColumns.appendChild(columnElement);
    });

    syncColumnDropZoneHeights();
    updateColumnIndicator();
  }

  function updateColumnIndicator() {
    if (!elements.boardColumnsShell || !elements.boardColumnIndicator) return;
    const shell = elements.boardColumnsShell;
    const visibleColumns = COLUMNS.filter(function (c) {
      return !state.hiddenColumns.includes(c.id);
    });
    if (visibleColumns.length <= 1) {
      elements.boardColumnIndicator.classList.add("hidden");
      return;
    }
    const scrollLeft = shell.scrollLeft;
    const maxScroll = shell.scrollWidth - shell.clientWidth;
    if (maxScroll < 10) {
      elements.boardColumnIndicator.classList.add("hidden");
      return;
    }
    const columnWidth = shell.scrollWidth / visibleColumns.length;
    const currentIndex = Math.min(
      Math.round(scrollLeft / columnWidth),
      visibleColumns.length - 1
    );
    const currentColumn = visibleColumns[currentIndex];
    elements.boardColumnIndicatorText.textContent =
      (currentIndex + 1) + " / " + visibleColumns.length + " — " + (currentColumn ? currentColumn.title : "");
    elements.boardColumnIndicator.classList.remove("hidden");
  }

  function syncColumnDropZoneHeights() {
    const columnBodies = Array.from(
      elements.boardColumns.querySelectorAll("[data-column-drop-zone]"),
    );

    if (!columnBodies.length) {
      return;
    }

    columnBodies.forEach(function (body) {
      body.style.minHeight = "";
      const emptyState = body.querySelector(".column-empty");

      if (emptyState) {
        emptyState.style.minHeight = "";
      }
    });

    const tallestHeight = Math.max(
      260,
      ...columnBodies.map(function (body) {
        return body.scrollHeight;
      }),
    );

    columnBodies.forEach(function (body) {
      body.style.minHeight = tallestHeight + "px";
      const emptyState = body.querySelector(".column-empty");

      if (!emptyState) {
        return;
      }

      emptyState.style.minHeight = Math.max(212, tallestHeight - 8) + "px";
    });
  }

  function renderCheckpoint() {
    const publicView = isPublicView();
    const activeItems = state.checkpointItems.filter(function (item) {
      return !item.archived && (!publicView || item.approvalStatus === "validated");
    });
    const archivedItems = state.checkpointItems.filter(function (item) {
      return item.archived && (!publicView || item.approvalStatus === "validated");
    });

    elements.checkpointArchivedPanel.classList.toggle(
      "is-collapsed",
      !state.checkpointArchivedVisible,
    );
    elements.checkpointArchivedContent.hidden = !state.checkpointArchivedVisible;
    elements.checkpointToggleArchivedButton.textContent = state.checkpointArchivedVisible
      ? "Ocultar bloco"
      : "Mostrar bloco";
    elements.checkpointToggleArchivedButton.setAttribute(
      "aria-expanded",
      String(state.checkpointArchivedVisible),
    );

    if (elements.checkpointAddTopButton) {
      const canCreate = can("checkpoint.create");
      elements.checkpointAddTopButton.classList.toggle("is-visible", canCreate && activeItems.length > 2);
    }

    renderCheckpointAiPanel();
    renderCheckpointFeedback();
    renderCheckpointList(elements.checkpointActiveList, activeItems, false, publicView);
    renderCheckpointList(elements.checkpointArchivedList, archivedItems, true, publicView);
    autoResizeCheckpointTitleInputs();
    focusPendingCheckpointItem();
  }

  function renderCheckpointAiPanel() {
    const config = state.checkpointOpenAiConfig;

    if (!config.apiKey) {
      elements.checkpointAiSummary.textContent =
        "IA desativada. Configure a integração para transformar pontos da ata em cartões do painel.";
      return;
    }

    elements.checkpointAiSummary.textContent =
      "IA configurada com " +
      config.model +
      " via " +
      extractHostLabel(config.endpoint) +
      ". Novos cartões entram em Pendências do Projeto com a data do ponto como prazo.";
  }

  function renderCheckpointFeedback() {
    const feedback = state.checkpointFeedback;

    elements.checkpointFeedback.classList.remove("is-success", "is-error");

    if (!feedback || !feedback.text) {
      elements.checkpointFeedback.textContent = "";
      elements.checkpointFeedback.classList.add("hidden");
      return;
    }

    elements.checkpointFeedback.textContent = feedback.text;
    elements.checkpointFeedback.classList.remove("hidden");
    elements.checkpointFeedback.classList.add(
      feedback.type === "error" ? "is-error" : "is-success",
    );
  }

  function renderCheckpointList(container, items, archived, publicView) {
    container.innerHTML = "";

    if (!items.length) {
      const emptyState = document.createElement("div");
      emptyState.className = "checkpoint-empty";
      emptyState.innerHTML = archived
        ? publicView
          ? '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="3" y="13" width="38" height="24" rx="5" stroke="#c8d5e0" stroke-width="2"/><rect x="3" y="7" width="38" height="10" rx="4" stroke="#c8d5e0" stroke-width="2"/><line x1="16" y1="26" x2="28" y2="26" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/></svg><p>Nenhum item publicado no histórico.</p>'
          : '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="3" y="13" width="38" height="24" rx="5" stroke="#c8d5e0" stroke-width="2"/><rect x="3" y="7" width="38" height="10" rx="4" stroke="#c8d5e0" stroke-width="2"/><line x1="16" y1="26" x2="28" y2="26" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/></svg><p>Nenhum assunto arquivado no momento.</p>'
        : publicView
          ? '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="7" y="9" width="30" height="28" rx="6" stroke="#c8d5e0" stroke-width="2"/><rect x="15" y="5" width="14" height="8" rx="3" stroke="#c8d5e0" stroke-width="2"/><line x1="14" y1="21" x2="30" y2="21" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="28" x2="24" y2="28" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/></svg><p>Nenhum assunto publicado no momento.</p>'
          : '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect x="7" y="9" width="30" height="28" rx="6" stroke="#c8d5e0" stroke-width="2"/><rect x="15" y="5" width="14" height="8" rx="3" stroke="#c8d5e0" stroke-width="2"/><line x1="14" y1="21" x2="30" y2="21" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="28" x2="24" y2="28" stroke="#c8d5e0" stroke-width="2" stroke-linecap="round"/><circle cx="34" cy="34" r="7" fill="#38bdf8"/><line x1="34" y1="31" x2="34" y2="37" stroke="white" stroke-width="2" stroke-linecap="round"/><line x1="31" y1="34" x2="37" y2="34" stroke="white" stroke-width="2" stroke-linecap="round"/></svg><p>Nenhum assunto ativo. Use o botão abaixo para inserir o primeiro.</p>';
      container.appendChild(emptyState);
      return;
    }

    items.forEach(function (item, index) {
      container.appendChild(createCheckpointItemElement(item, archived, index, publicView));
    });
  }

  function createCheckpointItemElement(item, archived, index, publicView) {
    const itemElement = document.createElement("article");
    itemElement.className = "checkpoint-item";
    itemElement.setAttribute("data-checkpoint-item-id", item.id);
    const canEditItem = !publicView && !archived && canEditCheckpointItem(item);
    const canValidateItem = !publicView && !archived && canValidateCheckpointItem(item);
    const title = publicView
      ? getPublishedCheckpointTitle(item)
      : item.title || createDefaultCheckpointTitle(index + 1);
    const subtitle = publicView
      ? "Disponível para leitura pública"
      : getCheckpointItemSubtitleText(item);

    if (archived) {
      itemElement.innerHTML =
        '<div class="checkpoint-item-main">' +
        '<div class="checkpoint-pauta-header">' +
        "<div>" +
        '<p class="checkpoint-date-label">' +
        (publicView ? "Assunto arquivado publicado" : "Assunto arquivado") +
        "</p>" +
        '<h3 class="checkpoint-pauta-title">' +
        escapeHtml(title) +
        "</h3>" +
        "</div>" +
        '<p class="checkpoint-pauta-subtitle">' +
        escapeHtml(subtitle) +
        "</p>" +
        "</div>" +
        '<div class="checkpoint-topic-list">' +
        getTopicsForCheckpointView(item, publicView)
          .map(function (topic, topicIndex) {
            return createArchivedCheckpointTopicMarkup(
              topic,
              topicIndex,
              publicView,
              topic.id === getLatestValidatedCheckpointTopicId(item),
            );
          })
          .join("") +
        "</div>" +
        "</div>" +
        (publicView
          ? ""
          : '<div class="checkpoint-item-actions checkpoint-pauta-actions">' +
            (can("checkpoint.archive")
              ? '<button class="checkpoint-action-button is-restore" type="button" data-restore-checkpoint="' +
                item.id +
                '">' + ICONS.restore + " Restaurar</button>"
              : "") +
            "</div>");

      return itemElement;
    }

    if (publicView) {
      itemElement.innerHTML =
        '<div class="checkpoint-item-main">' +
        '<div class="checkpoint-pauta-header">' +
        "<div>" +
        '<p class="checkpoint-date-label">Assunto publicado</p>' +
        '<h3 class="checkpoint-pauta-title">' +
        escapeHtml(title) +
        "</h3>" +
        "</div>" +
        '<p class="checkpoint-pauta-subtitle">' +
        escapeHtml(subtitle) +
        "</p>" +
        "</div>" +
        '<div class="checkpoint-topic-list">' +
        getTopicsForCheckpointView(item, true)
          .map(function (topic, topicIndex) {
            return createPublicCheckpointTopicMarkup(
              topic,
              topicIndex,
              topic.id === getLatestValidatedCheckpointTopicId(item),
            );
          })
          .join("") +
        "</div>" +
        "</div>";

      return itemElement;
    }

    itemElement.innerHTML =
      '<div class="checkpoint-item-main">' +
      '<div class="checkpoint-pauta-header">' +
      '<div class="checkpoint-pauta-header-main">' +
      '<p class="checkpoint-date-label">Título do assunto</p>' +
      '<textarea class="checkpoint-pauta-title-input" data-checkpoint-title-input="true" data-checkpoint-id="' +
      item.id +
      '" rows="1" spellcheck="false" placeholder="Ex: Revisão do pacote do térreo"' +
      (canEditItem ? "" : " disabled") +
      ">" +
      escapeHtml(title) +
      "</textarea>" +
      "</div>" +
      '<div class="checkpoint-pauta-meta">' +
      createCheckpointWorkflowBadge(item.approvalStatus) +
      '<div class="checkpoint-pauta-meta-copy">' +
      '<p class="checkpoint-pauta-subtitle">' +
      escapeHtml(subtitle) +
      "</p>" +
      (getCheckpointItemCreatorText(item)
        ? '<p class="checkpoint-pauta-subtitle checkpoint-pauta-author">' +
          escapeHtml(getCheckpointItemCreatorText(item)) +
          "</p>"
        : "") +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="checkpoint-topic-list">' +
      '<p class="checkpoint-hierarchy-guide">Tópicos deste assunto</p>' +
      item.topics
        .map(function (topic, topicIndex) {
          return createActiveCheckpointTopicMarkup(
            item,
            topic,
            topicIndex,
            topic.id === getLatestValidatedCheckpointTopicId(item),
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      '<div class="checkpoint-item-actions checkpoint-pauta-actions">' +
      (can("checkpoint.create")
        ? '<button class="checkpoint-action-button is-add-topic" type="button" data-add-checkpoint-topic="' +
          item.id +
          '">' + ICONS.plus + " Novo ponto</button>"
        : "") +
      (can("checkpoint.archive")
        ? '<button class="checkpoint-action-button is-archive" type="button" data-archive-checkpoint="' +
          item.id +
          '">' + ICONS.archive + " Arquivar</button>"
        : "") +
      (canValidateItem && item.approvalStatus !== "validated"
        ? '<button class="checkpoint-action-button is-restore" type="button" data-validate-checkpoint="' +
          item.id +
          '">' + ICONS.check + " Validar assunto</button>"
        : "") +
      (canValidateItem && item.approvalStatus !== "blocked"
        ? '<button class="checkpoint-action-button is-delete-pauta" type="button" data-block-checkpoint="' +
          item.id +
          '">' + ICONS.block + " Bloquear assunto</button>"
        : "") +
      (can("checkpoint.delete")
        ? '<button class="checkpoint-action-button is-delete-pauta" type="button" data-delete-checkpoint-item="' +
          item.id +
          '">' + ICONS.trash + " Excluir assunto</button>"
        : "") +
      "</div>";

    return itemElement;
  }

  function createArchivedCheckpointTopicMarkup(topic, topicIndex, publicView, isLatestValidated) {
    return (
      '<section class="checkpoint-topic' + (isLatestValidated ? " is-latest-validated" : "") + '">' +
      '<div class="checkpoint-topic-body">' +
      '<div class="checkpoint-topic-side">' +
      '<p class="checkpoint-date-label checkpoint-topic-order">Ponto ' +
      String(topicIndex + 1).padStart(2, "0") +
      "</p>" +
      '<p class="checkpoint-date-label">' +
      escapeHtml(formatFullDate(topic.date)) +
      "</p>" +
      "</div>" +
      '<p class="checkpoint-archived-text checkpoint-topic-text">' +
      escapeHtml(topic.text || (publicView ? "Ponto publicado sem descrição." : "Ponto sem descrição.")) +
      "</p>" +
      "</div>" +
      '<div class="checkpoint-topic-actions">' +
      '<span class="checkpoint-topic-status">' +
      (publicView ? "Conteúdo publicado no histórico." : "Ponto arquivado.") +
      "</span>" +
      "</div>" +
      "</section>"
    );
  }

  function createPublicCheckpointTopicMarkup(topic, topicIndex, isLatestValidated) {
    return (
      '<section class="checkpoint-topic' + (isLatestValidated ? " is-latest-validated" : "") + '">' +
      '<div class="checkpoint-topic-body">' +
      '<div class="checkpoint-topic-side">' +
      '<p class="checkpoint-date-label checkpoint-topic-order">Ponto ' +
      String(topicIndex + 1).padStart(2, "0") +
      "</p>" +
      '<p class="checkpoint-date-label">' +
      escapeHtml(formatFullDate(topic.date)) +
      "</p>" +
      "</div>" +
      '<p class="checkpoint-archived-text checkpoint-topic-text">' +
      escapeHtml(topic.text || "Ponto publicado sem descrição.") +
      "</p>" +
      "</div>" +
      '<div class="checkpoint-topic-actions">' +
      '<span class="checkpoint-topic-status">Disponível na ata pública.</span>' +
      "</div>" +
      "</section>"
    );
  }

  function createActiveCheckpointTopicMarkup(item, topic, topicIndex, isLatestValidated) {
    const itemId = item.id;
    const topicKey = getCheckpointTopicKey(itemId, topic.id);
    const isGenerating = Boolean(state.checkpointGeneratingTopics[topicKey]);
    const hasApiKey = Boolean(state.checkpointOpenAiConfig.apiKey);
    const canDelete = can("checkpoint.delete") && topic.canDelete !== false;
    const canGenerate =
      can("ai.generate") && topic.text.trim().length > 0 && !isGenerating;
    const canEdit = canEditCheckpointTopic(item, topic);
    const canValidate = canValidateCheckpointTopic(topic);
    const statusText = getCheckpointTopicStatusText(topic, isGenerating, hasApiKey);

    return (
      '<section class="checkpoint-topic' + (isLatestValidated ? " is-latest-validated" : "") + '">' +
      (canDelete
        ? '<button class="checkpoint-delete-affordance" type="button" data-delete-checkpoint-topic="true" data-checkpoint-id="' +
          itemId +
          '" data-topic-id="' +
          topic.id +
          '" aria-label="Excluir ponto" title="Excluir ponto">' + ICONS.trash + "</button>"
        : "") +
      '<div class="checkpoint-topic-body">' +
      '<div class="checkpoint-topic-side">' +
      '<p class="checkpoint-date-label checkpoint-topic-order">Ponto ' +
      String(topicIndex + 1).padStart(2, "0") +
      "</p>" +
      '<label class="checkpoint-topic-date-field">' +
      "<span>Data do ponto</span>" +
      '<input class="checkpoint-topic-date-input" type="date" value="' +
      escapeHtml(topic.date) +
      '" data-checkpoint-topic-date="true" data-checkpoint-id="' +
      itemId +
      '" data-topic-id="' +
      topic.id +
      '"' +
      (canEdit ? "" : " disabled") +
      ">" +
      "</label>" +
      (getCheckpointTopicCreatorText(topic)
        ? '<p class="checkpoint-date-label checkpoint-topic-author">' +
          escapeHtml(getCheckpointTopicCreatorText(topic)) +
          "</p>"
        : "") +
      "</div>" +
      '<div class="checkpoint-topic-content">' +
      '<textarea class="checkpoint-textarea checkpoint-topic-textarea" data-checkpoint-topic-input="true" data-checkpoint-id="' +
      itemId +
      '" data-topic-id="' +
      topic.id +
      '" rows="4" placeholder="Descreva o ponto que deve ser tratado neste assunto."' +
      (canEdit ? "" : " disabled") +
      ">" +
      escapeHtml(topic.text) +
      "</textarea>" +
      "</div>" +
      "</div>" +
      '<div class="checkpoint-topic-actions">' +
      (canValidate && topic.approvalStatus !== "validated"
        ? '<button class="checkpoint-action-button is-restore" type="button" data-validate-checkpoint-topic="true" data-checkpoint-id="' +
          itemId +
          '" data-topic-id="' +
          topic.id +
          '">' + ICONS.check + " Validar ponto</button>"
        : "") +
      (canValidate && topic.approvalStatus !== "blocked"
        ? '<button class="checkpoint-action-button is-delete-pauta" type="button" data-block-checkpoint-topic="true" data-checkpoint-id="' +
          itemId +
          '" data-topic-id="' +
          topic.id +
          '">' + ICONS.block + " Bloquear ponto</button>"
        : "") +
      (can("ai.generate")
        ? '<button class="checkpoint-action-button is-ai" type="button" data-generate-card-from-topic="true" data-checkpoint-id="' +
          itemId +
          '" data-topic-id="' +
          topic.id +
          '"' +
          (canGenerate ? "" : " disabled") +
          ">" +
          (isGenerating
            ? ICONS.spinner + " Gerando..."
            : ICONS.sparkles + " Transformar em cartão") +
          "</button>"
        : "") +
      createCheckpointWorkflowBadge(topic.approvalStatus) +
      '<span class="checkpoint-topic-status">' +
      escapeHtml(statusText) +
      "</span>" +
      "</div>" +
      "</section>"
    );
  }

  function renderColumnVisibilityFilters() {
    const isDisabled = false;

    elements.columnVisibilityFilters.innerHTML = COLUMNS.map(function (column) {
      const isHidden = state.hiddenColumns.includes(column.id);

      return (
        '<button class="visibility-button' +
        (isHidden ? " is-hidden" : "") +
        '" type="button" data-toggle-column="' +
        column.id +
        '"' +
        (isDisabled ? " disabled" : "") +
        ">" +
        escapeHtml(column.title) +
        "</button>"
      );
    }).join("");

    elements.columnVisibilityFilters
      .querySelectorAll("[data-toggle-column]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          toggleColumnVisibility(button.getAttribute("data-toggle-column"));
        });
      });
  }

  function createCardElement(card, options) {
    const config = Object.assign(
      {
        publicView: false,
      },
      options,
    );
    const viewCard = getCardViewModel(card, config.publicView);
    const colorConfig = getDisciplineTheme(viewCard.discipline);
    const cardElement = document.createElement("article");
    const cardStyle = createInlineStyle({
      "--discipline-color": colorConfig.color,
      "--discipline-bg": colorConfig.background,
      "--discipline-pill-bg": colorConfig.pillBg,
      "--discipline-pill-text": colorConfig.pillText,
    });
    const canEdit = !config.publicView && can("cards.edit");
    const canDelete = !config.publicView && can("cards.delete") && card.columnId === "approved";
    const canMove = !config.publicView && can("cards.move");

    const today = getTodayString();
    const isBlocked = Boolean(card.blockedBy);
    const isOverdue = viewCard.dueDate && viewCard.dueDate < today;
    const isWarning = !isOverdue && viewCard.dueDate && getDaysUntil(viewCard.dueDate) <= 7;
    const datePillClass = isOverdue ? "pill is-overdue" : isWarning ? "pill is-warning" : "pill pill-neutral";
    const datePillPrefix = isOverdue ? "⚠ Vencido: " : "Entrega: ";

    cardElement.className = "card" + (config.publicView ? " is-readonly" : "") + (isBlocked ? " is-blocked" : "");
    cardElement.draggable = canMove;
    cardElement.setAttribute("data-card-id", card.id);
    cardElement.style.cssText = cardStyle;
    cardElement.innerHTML =
      '<div class="card-top">' +
      "<div>" +
      '<h4 class="card-title">' +
      escapeHtml(viewCard.title) +
      "</h4>" +
      '<p class="card-description">' +
      escapeHtml(viewCard.description) +
      "</p>" +
      "</div>" +
      '<div class="card-actions">' +
      (canMove ? '<button class="ghost-icon-button" type="button" title="Arrastar">' + ICONS.grip + "</button>" : "") +
      (canEdit
        ? '<button class="icon-button" type="button" data-edit-card="' +
          card.id +
          '" title="Editar">' + ICONS.pencil + "</button>"
        : "") +
      (canDelete
        ? '<button class="icon-button delete-button" type="button" data-delete-card="' +
          card.id +
          '" title="Excluir">' + ICONS.trash + "</button>"
        : "") +
      "</div>" +
      "</div>" +
      '<div class="card-meta">' +
      '<span class="pill pill-discipline">' +
      escapeHtml(viewCard.discipline) +
      "</span>" +
      '<span class="' + datePillClass + '">' + datePillPrefix +
      formatDate(viewCard.dueDate) +
      "</span>" +
      (isBlocked && card.blockedBy
        ? '<span class="pill pill-blocked">⚠ Bloqueado por ' +
          escapeHtml(card.blockedBy) +
          "</span>"
        : "") +
      "</div>" +
      (viewCard.columnId === "blocked" && card.waitingReason && !config.publicView
        ? '<p class="card-description">' + escapeHtml(card.waitingReason) + "</p>"
        : "") +
      (canMove
        ? '<div class="card-move-row"><span>Mover para:</span><select class="card-move-select" data-move-card="' + card.id + '">' +
          COLUMNS.map(function (col) {
            return '<option value="' + col.id + '"' + (col.id === card.columnId ? " selected" : "") + ">" + escapeHtml(col.title) + "</option>";
          }).join("") +
          "</select></div>"
        : "");

    if (canMove) {
      cardElement.addEventListener("dragstart", function (event) {
        state.draggedCardId = card.id;
        cardElement.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", card.id);
      });

      cardElement.addEventListener("dragend", function () {
        state.draggedCardId = null;
        cardElement.classList.remove("dragging");
        clearDropHighlights();
      });
    }

    const editButton = cardElement.querySelector("[data-edit-card]");

    if (editButton) {
      editButton.addEventListener("click", function () {
        openModal("edit", card.id);
      });
    }

    const deleteButton = cardElement.querySelector("[data-delete-card]");

    if (deleteButton) {
      deleteButton.addEventListener("click", function () {
        deleteCard(card.id);
      });
    }

    return cardElement;
  }

  function setupColumnDropZone(zoneElement, columnId) {
    zoneElement.addEventListener("dragover", function (event) {
      if (!can("cards.move") || isPublicView()) {
        return;
      }

      event.preventDefault();
      zoneElement.classList.add("drag-over");
      var col = zoneElement.closest(".column");
      if (col) col.classList.add("is-drag-target");
      event.dataTransfer.dropEffect = "move";
    });

    zoneElement.addEventListener("dragleave", function (event) {
      if (!zoneElement.contains(event.relatedTarget)) {
        zoneElement.classList.remove("drag-over");
        var col = zoneElement.closest(".column");
        if (col) col.classList.remove("is-drag-target");
      }
    });

    zoneElement.addEventListener("drop", function (event) {
      if (!can("cards.move") || isPublicView()) {
        return;
      }

      event.preventDefault();
      zoneElement.classList.remove("drag-over");
      var col = zoneElement.closest(".column");
      if (col) col.classList.remove("is-drag-target");

      if (!state.draggedCardId) {
        return;
      }

      const draggedCard = getCardById(state.draggedCardId);

      if (!draggedCard) {
        return;
      }

      const targetCardId = getColumnDropTargetCardId(
        zoneElement,
        event.clientY,
        state.draggedCardId,
      );

      if (targetCardId) {
        const targetCard = getCardById(targetCardId);

        if (!targetCard) {
          return;
        }

        if (targetCard.columnId === "blocked" && draggedCard.columnId !== "blocked") {
          state.pendingBlockedMove = {
            type: "before",
            cardId: state.draggedCardId,
            targetCardId: targetCardId,
          };
          openBlockModal();
          return;
        }

        moveCardBefore(state.draggedCardId, targetCardId);
        recordAudit("card.move", draggedCard.title + " movido para " + targetCard.columnId + ".");
        saveAndRender();
        return;
      }

      if (columnId === "blocked" && draggedCard.columnId !== "blocked") {
        state.pendingBlockedMove = {
          type: "column",
          cardId: state.draggedCardId,
          columnId: columnId,
        };
        openBlockModal();
        return;
      }

      moveCardToColumnEnd(state.draggedCardId, columnId);
      recordAudit("card.move", draggedCard.title + " movido para " + columnId + ".");
      saveAndRender();
    });
  }

  function getColumnDropTargetCardId(zoneElement, pointerY, draggedCardId) {
    const cards = Array.from(zoneElement.querySelectorAll(".card")).filter(function (cardNode) {
      return cardNode.getAttribute("data-card-id") !== draggedCardId;
    });

    for (let index = 0; index < cards.length; index += 1) {
      const cardNode = cards[index];
      const bounds = cardNode.getBoundingClientRect();
      const threshold = bounds.top + bounds.height / 2;

      if (pointerY <= threshold) {
        return cardNode.getAttribute("data-card-id") || "";
      }
    }

    return "";
  }

  function moveCardBefore(draggedCardId, targetCardId) {
    const cards = state.cards.slice();
    const draggedIndex = findCardIndex(draggedCardId);
    const targetIndex = findCardIndex(targetCardId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const draggedCard = cards[draggedIndex];
    const targetCard = cards[targetIndex];
    const nextCards = cards.filter(function (card) {
      return card.id !== draggedCardId;
    });
    const updatedCard = Object.assign({}, draggedCard, {
      columnId: targetCard.columnId,
    });
    const insertionIndex = nextCards.findIndex(function (card) {
      return card.id === targetCardId;
    });

    nextCards.splice(insertionIndex, 0, updatedCard);
    state.cards = normalizeCards(normalizeBlockedState(nextCards));
  }

  function moveCardToColumnEnd(cardId, columnId) {
    const targetCard = getCardById(cardId);

    if (!targetCard) {
      return;
    }

    const cardsWithoutDragged = state.cards.filter(function (card) {
      return card.id !== cardId;
    });
    const updatedCard = Object.assign({}, targetCard, {
      columnId: columnId,
    });
    let insertionIndex = cardsWithoutDragged.length;

    cardsWithoutDragged.forEach(function (card, index) {
      if (card.columnId === columnId) {
        insertionIndex = index + 1;
      }
    });

    cardsWithoutDragged.splice(insertionIndex, 0, updatedCard);
    state.cards = normalizeCards(normalizeBlockedState(cardsWithoutDragged));
  }

  function openModal(mode, cardId) {
    if (mode === "create" && !can("cards.create")) {
      return;
    }

    if (mode === "edit" && !can("cards.edit")) {
      return;
    }

    state.modalMode = mode;
    state.editingCardId = cardId || null;
    elements.formError.classList.add("hidden");
    elements.formError.textContent = "";

    if (mode === "edit" && cardId) {
      const card = getCardById(cardId);

      if (!card) {
        return;
      }

      elements.modalTitle.textContent = "Editar cartão";
      elements.submitModalButton.textContent = "Salvar alterações";
      elements.titleInput.value = card.title;
      elements.descriptionInput.value = card.description;
      elements.dueDateInput.value = card.dueDate;
      elements.disciplineSelect.value = card.discipline;
      elements.columnSelect.value = card.columnId;
      elements.columnField.classList.remove("hidden");
    } else {
      elements.modalTitle.textContent = "Novo cartão";
      elements.submitModalButton.textContent = "Criar cartão";
      elements.form.reset();
      elements.titleInput.value = "";
      elements.descriptionInput.value = "";
      elements.dueDateInput.value = getTodayString();
      elements.disciplineSelect.value = state.disciplines[0] || "";
      elements.columnSelect.value = "backlog";
      elements.columnField.classList.add("hidden");
    }

    elements.modalBackdrop.classList.remove("hidden");
    elements.titleInput.focus();
    activateFocusTrap(elements.modalBackdrop);
  }

  function closeModal() {
    deactivateFocusTrap();
    elements.modalBackdrop.classList.add("hidden");
    elements.form.reset();
    elements.formError.classList.add("hidden");
    state.editingCardId = null;
  }

  function openBlockModal() {
    if (!can("cards.move") && !can("cards.edit")) {
      return;
    }

    elements.blockForm.reset();
    elements.blockFormError.classList.add("hidden");
    elements.blockFormError.textContent = "";
    elements.blockModalBackdrop.classList.remove("hidden");
    elements.blockDisciplineSelect.focus();
    activateFocusTrap(elements.blockModalBackdrop);
  }

  function closeBlockModal() {
    deactivateFocusTrap();
    elements.blockModalBackdrop.classList.add("hidden");
    elements.blockForm.reset();
    elements.blockFormError.classList.add("hidden");
    elements.blockFormError.textContent = "";
    state.pendingBlockedMove = null;
  }

  function openDisciplineModal() {
    if (!can("disciplines.create")) {
      return;
    }

    elements.disciplineForm.reset();
    elements.disciplineFormError.classList.add("hidden");
    elements.disciplineFormError.textContent = "";
    elements.disciplineModalBackdrop.classList.remove("hidden");
    elements.disciplineNameInput.focus();
    activateFocusTrap(elements.disciplineModalBackdrop);
  }

  function closeDisciplineModal() {
    deactivateFocusTrap();
    elements.disciplineModalBackdrop.classList.add("hidden");
    elements.disciplineForm.reset();
    elements.disciplineFormError.classList.add("hidden");
    elements.disciplineFormError.textContent = "";
  }

  function openAuthModal() {
    elements.authForm.reset();
    elements.authFormError.classList.add("hidden");
    elements.authFormError.classList.remove("is-success");
    elements.authFormError.textContent = "";
    elements.authModalBackdrop.classList.remove("hidden");
    elements.authEmailInput.focus();
    activateFocusTrap(elements.authModalBackdrop);
  }

  function closeAuthModal() {
    deactivateFocusTrap();
    elements.authModalBackdrop.classList.add("hidden");
    elements.authForm.reset();
    elements.authFormError.classList.add("hidden");
    elements.authFormError.classList.remove("is-success");
    elements.authFormError.textContent = "";
  }

  function openPasswordModal(options) {
    var source = options || {};
    var isRequired = Boolean(source.required);

    if (!getCurrentUser()) {
      return;
    }

    state.passwordModalMode = isRequired ? "required" : "self-service";
    state.passwordResetRequired = isRequired;
    elements.passwordForm.reset();
    elements.passwordFormFeedback.classList.add("hidden");
    elements.passwordFormFeedback.classList.remove("is-success");
    elements.passwordFormFeedback.textContent = "";

    if (isRequired) {
      elements.passwordModalTitle.textContent = "Defina sua senha de acesso";
      elements.passwordModalHelp.textContent =
        "Este Ã© o primeiro acesso desta conta. Troque a senha provisÃ³ria antes de continuar.";
      elements.passwordFormNote.textContent =
        "A troca Ã© obrigatÃ³ria e libera o ambiente interno apenas depois da atualizaÃ§Ã£o.";
      elements.passwordFormNote.classList.remove("hidden");
      elements.closePasswordModalButton.classList.add("hidden");
      elements.cancelPasswordModalButton.classList.add("hidden");
      elements.submitPasswordModalButton.textContent = "Salvar nova senha";
    } else {
      elements.passwordModalTitle.textContent = "Redefinir senha";
      elements.passwordModalHelp.textContent =
        "Informe sua senha atual e cadastre uma nova credencial para os prÃ³ximos acessos.";
      elements.passwordFormNote.textContent =
        "A sessÃ£o atual continua ativa atÃ© o vencimento ou atÃ© um novo check-in.";
      elements.passwordFormNote.classList.remove("hidden");
      elements.closePasswordModalButton.classList.remove("hidden");
      elements.cancelPasswordModalButton.classList.remove("hidden");
      elements.submitPasswordModalButton.textContent = "Atualizar senha";
    }

    elements.passwordModalBackdrop.classList.remove("hidden");
    elements.passwordCurrentInput.focus();
    activateFocusTrap(elements.passwordModalBackdrop);
  }

  function resetPasswordModalState() {
    deactivateFocusTrap();
    elements.passwordModalBackdrop.classList.add("hidden");
    elements.passwordForm.reset();
    elements.passwordFormFeedback.classList.add("hidden");
    elements.passwordFormFeedback.classList.remove("is-success");
    elements.passwordFormFeedback.textContent = "";
    elements.passwordFormNote.classList.add("hidden");
    elements.passwordFormNote.textContent = "";
    elements.closePasswordModalButton.classList.remove("hidden");
    elements.cancelPasswordModalButton.classList.remove("hidden");
    state.passwordModalMode = "self-service";
  }

  function closePasswordModal() {
    if (state.passwordResetRequired) {
      return;
    }

    resetPasswordModalState();
  }

  function openGovernanceInfoModal() {
    elements.governanceInfoModalBackdrop.classList.remove("hidden");
    elements.closeGovernanceInfoModalButton.focus();
    activateFocusTrap(elements.governanceInfoModalBackdrop);
  }

  function closeGovernanceInfoModal() {
    deactivateFocusTrap();
    elements.governanceInfoModalBackdrop.classList.add("hidden");
  }

  function openPrivacyRequestModal() {
    elements.privacyRequestForm.reset();
    elements.privacyRequestFeedback.classList.add("hidden");
    elements.privacyRequestFeedback.textContent = "";
    elements.privacyRequestModalBackdrop.classList.remove("hidden");
    elements.privacyRequestName.focus();
    activateFocusTrap(elements.privacyRequestModalBackdrop);
  }

  function closePrivacyRequestModal() {
    deactivateFocusTrap();
    elements.privacyRequestModalBackdrop.classList.add("hidden");
    elements.privacyRequestForm.reset();
    elements.privacyRequestFeedback.classList.add("hidden");
    elements.privacyRequestFeedback.textContent = "";
  }

  function openUserModal(mode, userId) {
    if (!can("users.manage")) {
      return;
    }

    const editingUser = mode === "edit" ? getUserById(userId) : null;

    if (mode === "edit" && !editingUser) {
      return;
    }

    state.governanceUserModalMode = mode;
    state.governanceEditingUserId = editingUser ? editingUser.id : "";
    elements.userForm.reset();
    elements.userFormFeedback.classList.add("hidden");
    elements.userFormFeedback.textContent = "";

    if (editingUser) {
      state.governanceUserDraftPermissions =
        editingUser.role === "admin"
          ? Object.assign({}, DEFAULT_USER_PERMISSIONS)
          : normalizeUserPermissions(editingUser.permissions);
      elements.userModalTitle.textContent = "Editar usuário interno";
      elements.userModalHelp.textContent =
        "Atualize dados, perfil, status e permissões do usuário selecionado.";
      elements.submitUserModalButton.textContent = "Salvar alterações";
      elements.userNameInput.value = editingUser.name;
      elements.userEmailInput.value = editingUser.email;
      elements.userEmailInput.disabled = firebaseState.enabled;
      elements.userPasswordInput.value = "";
      elements.userPasswordInput.required = false;
      elements.userPasswordInput.placeholder = firebaseState.enabled
        ? "Gerenciado pelo Firebase; deixe em branco"
        : "Deixe em branco para manter a senha atual";
      elements.userRoleInput.value = editingUser.role;
      elements.userActiveInput.checked = editingUser.active;
      elements.userActiveInput.disabled =
        state.sessionUserId === editingUser.id && editingUser.active;
      syncUserActiveToggle();
    } else {
      state.governanceUserDraftPermissions = Object.assign({}, DEFAULT_USER_PERMISSIONS);
      elements.userModalTitle.textContent = "Criar usuário interno";
      elements.userModalHelp.textContent =
        "Defina os dados do usuário, seu perfil e as permissões que ele poderá usar.";
      elements.submitUserModalButton.textContent = "Criar usuário interno";
      elements.userEmailInput.disabled = false;
      elements.userPasswordInput.required = true;
      elements.userPasswordInput.placeholder = "Mínimo 6 caracteres";
      elements.userRoleInput.value = "user";
      elements.userActiveInput.checked = true;
      elements.userActiveInput.disabled = false;
      syncUserActiveToggle();
    }

    syncUserModalPermissionEditor();
    elements.userModalBackdrop.classList.remove("hidden");
    elements.userNameInput.focus();
    activateFocusTrap(elements.userModalBackdrop);
  }

  function closeUserModal() {
    deactivateFocusTrap();
    elements.userModalBackdrop.classList.add("hidden");
    elements.userForm.reset();
    elements.userFormFeedback.classList.add("hidden");
    elements.userFormFeedback.textContent = "";
    elements.userPermissionGrid.innerHTML = "";
    elements.userPermissionNote.textContent = "";
    elements.userPermissionNote.classList.add("hidden");
    elements.userActiveInput.disabled = false;
    syncUserActiveToggle();
    elements.userEmailInput.disabled = false;
    state.governanceUserModalMode = "create";
    state.governanceEditingUserId = "";
    state.governanceUserDraftPermissions = normalizeUserPermissions({});
  }

  function syncUserActiveToggle() {
    if (!elements.userActiveState || !elements.userActiveHint) {
      return;
    }

    const isActive = Boolean(elements.userActiveInput.checked);
    const isLocked = Boolean(elements.userActiveInput.disabled);

    elements.userActiveState.textContent = isActive ? "Ativo" : "Inativo";

    if (isLocked && isActive) {
      elements.userActiveHint.textContent =
        "Seu próprio acesso ativo não pode ser desativado nesta sessão.";
      return;
    }

    elements.userActiveHint.textContent = isActive
      ? "Pode acessar o ambiente interno normalmente."
      : "Bloqueia login e uso do ambiente interno até nova ativação.";
  }

  function openAuditLogModal() {
    if (!can("audit.view")) {
      return;
    }

    renderAuditLogs();
    elements.auditLogModalBackdrop.classList.remove("hidden");
    elements.auditActorFilter.focus();
    activateFocusTrap(elements.auditLogModalBackdrop);
  }

  function closeAuditLogModal() {
    deactivateFocusTrap();
    elements.auditLogModalBackdrop.classList.add("hidden");
  }

  function handleUserRoleInputChange() {
    syncUserModalPermissionEditor();
  }

  function syncUserModalPermissionEditor() {
    const role = elements.userRoleInput.value;

    if (role === "admin") {
      elements.userPermissionGrid.innerHTML = "";
      elements.userPermissionNote.textContent =
        "Admins recebem acesso total. As permissões individuais não se aplicam a este perfil.";
      elements.userPermissionNote.classList.remove("hidden");
      return;
    }

    elements.userPermissionNote.textContent = "";
    elements.userPermissionNote.classList.add("hidden");
    elements.userPermissionGrid.innerHTML = PERMISSION_GROUPS.map(function (group) {
      const permissions = PERMISSION_DEFINITIONS.filter(function (permission) {
        return permission.group === group.key;
      });

      return (
        '<section class="permission-group">' +
        '<div class="permission-group-header">' +
        "<h4>" +
        escapeHtml(group.label) +
        "</h4>" +
        "<p>" +
        escapeHtml(group.description) +
        "</p>" +
        "</div>" +
        '<div class="permission-group-grid">' +
        permissions
          .map(function (permission) {
            return (
              '<label class="permission-toggle">' +
              '<input type="checkbox" data-user-draft-permission="' +
              permission.key +
              '"' +
              (state.governanceUserDraftPermissions[permission.key] ? " checked" : "") +
              ">" +
              "<span>" +
              escapeHtml(permission.label) +
              "</span>" +
              "</label>"
            );
          })
          .join("") +
        "</div>" +
        "</section>"
      );
    }).join("");
  }

  function submitForm() {
    const title = elements.titleInput.value.trim();
    const description = elements.descriptionInput.value.trim();
    const dueDate = elements.dueDateInput.value;
    const discipline = elements.disciplineSelect.value;
    const columnId =
      state.modalMode === "edit" && state.editingCardId
        ? elements.columnSelect.value
        : "backlog";

    if (!title || !description || !dueDate || !discipline || !columnId) {
      return showFormError("Preencha título, descrição, data de entrega, disciplina e etapa.");
    }

    if (state.modalMode === "edit" && state.editingCardId) {
      if (!can("cards.edit")) {
        return;
      }

      const currentCard = getCardById(state.editingCardId);

      if (!currentCard) {
        return;
      }

      if (currentCard.columnId !== "blocked" && columnId === "blocked") {
        state.pendingBlockedMove = {
          type: "edit",
          cardId: currentCard.id,
          updates: {
            title: title,
            description: description,
            dueDate: dueDate,
            discipline: discipline,
            columnId: columnId,
          },
        };
        closeModal();
        openBlockModal();
        return;
      }

      state.cards = state.cards.map(function (card) {
        if (card.id !== state.editingCardId) {
          return card;
        }

        return normalizeCard(
          Object.assign({}, card, {
            title: title,
            description: description,
            dueDate: dueDate,
            discipline: discipline,
            columnId: columnId,
            blockedBy: columnId === "blocked" ? card.blockedBy : "",
            waitingReason: columnId === "blocked" ? card.waitingReason : "",
          }),
        );
      });
      recordAudit("card.edit", 'Cartão "' + title + '" atualizado.');
    } else {
      if (!can("cards.create")) {
        return;
      }

      state.cards.unshift(
        normalizeCard({
          id: createCardId(),
          title: title,
          description: description,
          dueDate: dueDate,
          discipline: discipline,
          columnId: columnId,
          blockedBy: "",
          waitingReason: "",
          publicationStatus: "internal",
          publicSnapshot: null,
        }),
      );
      recordAudit("card.create", 'Cartão "' + title + '" criado.');
    }

    const newCardId = state.modalMode === "create" ? state.cards[0].id : state.editingCardId;
    closeModal();
    saveAndRender();
    requestAnimationFrame(function () {
      const cardEl = document.querySelector('[data-card-id="' + newCardId + '"]');
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function submitBlockForm() {
    const blockDiscipline = elements.blockDisciplineSelect.value;
    const blockReason = elements.blockReasonInput.value.trim();

    if (!state.pendingBlockedMove) {
      return closeBlockModal();
    }

    if (!blockDiscipline || !blockReason) {
      return showBlockFormError(
        "Informe a disciplina responsável pelo bloqueio e o que está faltando.",
      );
    }

    if (state.pendingBlockedMove.type === "before") {
      moveCardBefore(state.pendingBlockedMove.cardId, state.pendingBlockedMove.targetCardId);
    } else if (state.pendingBlockedMove.type === "edit") {
      state.cards = state.cards.map(function (card) {
        if (card.id !== state.pendingBlockedMove.cardId) {
          return card;
        }

        return normalizeCard(Object.assign({}, card, state.pendingBlockedMove.updates));
      });
    } else if (state.pendingBlockedMove.type === "column") {
      state.cards = state.cards.map(function (card) {
        return card.id === state.pendingBlockedMove.cardId
          ? Object.assign({}, card, { columnId: state.pendingBlockedMove.targetColumnId })
          : card;
      });
    } else {
      moveCardToColumnEnd(state.pendingBlockedMove.cardId, state.pendingBlockedMove.columnId);
    }

    state.cards = state.cards.map(function (card) {
      if (card.id !== state.pendingBlockedMove.cardId) {
        return card;
      }

      return normalizeCard(
        Object.assign({}, card, {
          blockedBy: blockDiscipline,
          waitingReason: blockReason,
        }),
      );
    });

    recordAudit("card.block", "Bloqueio registrado em cartão.");
    elements.blockModalBackdrop.classList.add("hidden");
    state.pendingBlockedMove = null;
    saveAndRender();
  }

  function submitDisciplineForm() {
    const disciplineName = elements.disciplineNameInput.value.trim();

    if (!can("disciplines.create")) {
      return;
    }

    if (!disciplineName) {
      return showDisciplineFormError("Informe um nome para a disciplina.");
    }

    const alreadyExists = state.disciplines.some(function (discipline) {
      return discipline.toLowerCase() === disciplineName.toLowerCase();
    });

    if (alreadyExists) {
      return showDisciplineFormError("Essa disciplina já existe no quadro.");
    }

    state.disciplines.push(disciplineName);
    state.disciplines.sort(function (a, b) {
      return a.localeCompare(b, "pt-BR");
    });
    saveDisciplines(state.disciplines);
    recordAudit("discipline.create", 'Disciplina "' + disciplineName + '" criada.');
    closeDisciplineModal();
    render();
    maybeRequirePasswordReset(user);
  }

  async function submitAuthForm() {
    const email = elements.authEmailInput.value.trim().toLowerCase();
    const password = elements.authPasswordInput.value;

    if (firebaseState.enabled) {
      try {
        firebaseState.pendingLoginAudit = true;
        await firebaseApi.signIn(email, password);
        closeAuthModal();
        elements.authForm.reset();
        return;
      } catch (error) {
        firebaseState.pendingLoginAudit = false;
        return showAuthFormError(mapFirebaseAuthError(error));
      }
    }

    const user = state.users.find(function (item) {
      return item.email.toLowerCase() === email;
    });

    if (!user || user.password !== password) {
      return showAuthFormError("Credenciais inválidas.");
    }

    if (!user.active) {
      return showAuthFormError("Conta desativada.");
    }

    state.sessionUserId = user.id;
    applySessionMeta(user.id);
    closeAuthModal();
    recordAudit("auth.login", user.name + " entrou na área interna.");
    render();
  }

  async function submitForgotPasswordRequest() {
    const email = elements.authEmailInput.value.trim().toLowerCase();

    if (!email) {
      return showAuthFormMessage("Informe seu e-mail para receber as instrucoes de redefinicao.", true);
    }

    if (!firebaseState.enabled) {
      return showAuthFormMessage(
        "A recuperacao automatica ainda nao esta disponivel nesta versao. Solicite a redefinicao ao administrador.",
        false,
      );
    }

    try {
      await firebaseApi.sendPasswordResetEmail(email);
      showAuthFormMessage(
        "Se existir uma conta para este e-mail, o link de redefinicao sera enviado em instantes.",
        false,
      );
    } catch (error) {
      showAuthFormMessage(mapFirebasePasswordResetError(error), true);
    }
  }

  async function logoutCurrentUser() {
    const user = getCurrentUser();

    if (user && !firebaseState.enabled) {
      recordAudit("auth.logout", user.name + " encerrou a sessão.");
    }

    if (firebaseState.enabled) {
      if (user) {
        recordAudit("auth.logout", user.name + " encerrou a sessÃ£o.");
      }

      try {
        await firebaseApi.signOut();
      } catch (error) {
        showToast("NÃ£o foi possÃ­vel encerrar a sessÃ£o no Firebase.", "error");
      }

      return;
    }

    state.sessionUserId = "";
    saveSessionUserId("");
    render();
  }

  async function logoutCurrentUser(options) {
    const source = options || {};
    const user = getCurrentUser();
    const reason = source.reason || "manual";
    const shouldOpenAuth = source.openAuth === true;

    if (user) {
      recordAudit(
        reason === "timeout" ? "auth.timeout" : "auth.logout",
        reason === "timeout"
          ? user.name + " teve a sessao expirada."
          : user.name + " encerrou a sessao.",
      );
    }

    clearSessionTimeoutTimer();
    clearSessionMeta();
    state.passwordResetRequired = false;
    resetPasswordModalState();

    if (firebaseState.enabled) {
      try {
        await firebaseApi.signOut();
      } catch (error) {
        showToast("Nao foi possivel encerrar a sessao no Firebase.", "error");
        return;
      }

      if (reason === "timeout") {
        showToast("Sua sessao expirou apos 30 minutos. Faca login novamente.", "error");
      }

      if (shouldOpenAuth) {
        window.setTimeout(openAuthModal, 120);
      }

      return;
    }

    state.sessionUserId = "";
    saveSessionUserId("");
    render();

    if (reason === "timeout") {
      showToast("Sua sessao expirou apos 30 minutos. Faca login novamente.", "error");
    }

    if (shouldOpenAuth) {
      window.setTimeout(openAuthModal, 120);
    }
  }

  function expireCurrentSession() {
    clearSessionTimeoutTimer();
    logoutCurrentUser({
      reason: "timeout",
      openAuth: true,
    });
  }

  function showPasswordFormFeedback(message, isError) {
    elements.passwordFormFeedback.textContent = message;
    elements.passwordFormFeedback.classList.remove("hidden");
    elements.passwordFormFeedback.classList.toggle("is-success", !isError);
  }

  function updateUserState(userId, patch, options) {
    var source = patch || {};
    var shouldPersistLocally = !options || options.persistLocally !== false;
    var updatedUser = null;

    state.users = state.users.map(function (user) {
      if (user.id !== userId) {
        return user;
      }

      updatedUser = normalizeUser(Object.assign({}, user, source));
      return updatedUser;
    });

    if (updatedUser && shouldPersistLocally) {
      runWithoutFirebaseSync(function () {
        saveUsers(state.users);
      });
    }

    return updatedUser;
  }

  function maybeRequirePasswordReset(user) {
    var currentUser = user || getCurrentUser();

    if (!currentUser) {
      state.passwordResetRequired = false;
      return false;
    }

    if (currentUser.mustChangePassword) {
      openPasswordModal({ required: true });
      return true;
    }

    if (state.passwordResetRequired) {
      state.passwordResetRequired = false;
      closePasswordModal();
    }

    return false;
  }

  async function submitPasswordForm() {
    var user = getCurrentUser();
    var currentPassword = elements.passwordCurrentInput.value;
    var nextPassword = elements.passwordNextInput.value;
    var confirmPassword = elements.passwordConfirmInput.value;
    var changedAt = new Date().toISOString();

    if (!user) {
      return showPasswordFormFeedback("Faca check-in novamente para atualizar sua senha.", true);
    }

    if (!currentPassword || !nextPassword || !confirmPassword) {
      return showPasswordFormFeedback("Preencha a senha atual e os dois campos da nova senha.", true);
    }

    if (nextPassword.length < PASSWORD_MIN_LENGTH) {
      return showPasswordFormFeedback("Use uma senha com pelo menos 6 caracteres.", true);
    }

    if (nextPassword !== confirmPassword) {
      return showPasswordFormFeedback("A confirmacao da nova senha nao confere.", true);
    }

    if (nextPassword === currentPassword) {
      return showPasswordFormFeedback("A nova senha precisa ser diferente da senha atual.", true);
    }

    if (firebaseState.enabled) {
      try {
        await firebaseApi.changeOwnPassword(user.email, currentPassword, nextPassword);
        await firebaseApi.saveUserProfile(user.id, {
          mustChangePassword: false,
          passwordUpdatedAt: changedAt,
        });
      } catch (error) {
        return showPasswordFormFeedback(mapFirebasePasswordChangeError(error), true);
      }
    } else if (user.password !== currentPassword) {
      return showPasswordFormFeedback("A senha atual nao confere.", true);
    }

    updateUserState(user.id, {
      password: firebaseState.enabled ? "" : nextPassword,
      mustChangePassword: false,
      passwordUpdatedAt: changedAt,
    });
    recordAudit("auth.password_change", user.name + " atualizou a propria senha.");
    state.passwordResetRequired = false;
    closePasswordModal();
    renderGovernance();
    showToast("Senha atualizada com sucesso.", "success");
  }

  function submitPrivacyRequest() {
    const name = elements.privacyRequestName.value.trim();
    const email = elements.privacyRequestEmail.value.trim();
    const type = elements.privacyRequestType.value;
    const message = elements.privacyRequestMessage.value.trim();

    if (!name || !email || !type || !message) {
      return showPrivacyRequestFeedback("Preencha nome, e-mail, tipo e detalhes.", true);
    }

    const privacyRequest = {
      id: "privacy-request-" + Date.now(),
      name: name,
      email: email,
      type: type,
      message: message,
      createdAt: new Date().toISOString(),
    };

    state.privacyRequests.unshift(privacyRequest);
    savePrivacyRequests(state.privacyRequests);

    if (firebaseState.enabled && hasFirebaseCurrentUser()) {
      firebaseApi.savePrivacyRequestEntry(privacyRequest).catch(function (error) {
        console.error("Privacy request sync failed", error);
        showToast("Nao foi possivel enviar a solicitacao ao Firebase.", "error");
      });
    }
    recordAudit("privacy.request", "Nova solicitação do titular registrada.");
    elements.privacyRequestForm.reset();
    showPrivacyRequestFeedback(
      "Solicitação registrada. Você receberá retorno em até 15 dias úteis, conforme art. 19 da LGPD.",
      false,
    );
    renderGovernance();
  }

  async function submitUserForm() {
    const name = elements.userNameInput.value.trim();
    const email = elements.userEmailInput.value.trim().toLowerCase();
    const password = elements.userPasswordInput.value.trim();
    const role = elements.userRoleInput.value;
    const isEditMode = state.governanceUserModalMode === "edit";
    const editingUserId = state.governanceEditingUserId;
    const editingUser = isEditMode ? getUserById(editingUserId) : null;
    const active =
      editingUserId && state.sessionUserId === editingUserId && editingUser && editingUser.active
        ? true
        : Boolean(elements.userActiveInput.checked);

    if (!can("users.manage")) {
      return;
    }

    if (!name || !email || !role) {
      return showUserFormFeedback("Preencha nome, e-mail e perfil.", true);
    }

    if (!isEditMode && !password) {
      return showUserFormFeedback("Informe uma senha provisória para o novo usuário.", true);
    }

    if (password && password.length < PASSWORD_MIN_LENGTH) {
      return showUserFormFeedback("Use uma senha com pelo menos 6 caracteres.", true);
    }

    if (firebaseState.enabled && isEditMode && password) {
      return showUserFormFeedback(
        "A troca de senha ainda nÃ£o estÃ¡ conectada ao Firebase. Deixe o campo em branco por enquanto.",
        true,
      );
    }

    const alreadyExists = state.users.some(function (user) {
      return user.email.toLowerCase() === email && user.id !== editingUserId;
    });

    if (alreadyExists) {
      return showUserFormFeedback("Já existe um usuário com esse e-mail.", true);
    }

    const permissions =
      role === "admin"
        ? Object.assign({}, ADMIN_PERMISSIONS)
        : normalizeUserPermissions(state.governanceUserDraftPermissions);

    if (isEditMode) {
      if (!editingUser) {
        return showUserFormFeedback("Usuário não encontrado para edição.", true);
      }

      if (firebaseState.enabled && email !== editingUser.email) {
        return showUserFormFeedback(
          "A ediÃ§Ã£o de e-mail serÃ¡ tratada depois via fluxo prÃ³prio do Firebase.",
          true,
        );
      }

      const passwordWasChanged = Boolean(!firebaseState.enabled && password);

      state.users = state.users.map(function (user) {
        if (user.id !== editingUserId) {
          return user;
        }

        return Object.assign({}, user, {
          name: name,
          email: email,
          password: firebaseState.enabled ? "" : password || user.password,
          role: role,
          active: active,
          mustChangePassword: passwordWasChanged ? true : user.mustChangePassword === true,
          passwordUpdatedAt: passwordWasChanged ? "" : user.passwordUpdatedAt || "",
          permissions: permissions,
        });
      });
      saveUsers(state.users);
      ensureCurrentUserIsValid();
      recordAudit("user.update", name + " atualizado com perfil " + getRoleLabel(role) + ".");
      state.selectedGovernanceUserId = editingUserId;
      closeUserModal();
      render();
      return;
    }

    if (firebaseState.enabled) {
      try {
        const createdUser = normalizeUser(
          await firebaseApi.createManagedUser({
            name: name,
            email: email,
            password: password,
            role: role,
            active: active,
            createdAt: new Date().toISOString(),
            mustChangePassword: true,
            passwordUpdatedAt: "",
            permissions: permissions,
          }),
        );

        state.users.unshift(createdUser);
        saveUsers(state.users);
        recordAudit("user.create", name + " criado com perfil " + getRoleLabel(role) + ".");
        state.selectedGovernanceUserId = createdUser.id;
        closeUserModal();
        renderGovernance();
      } catch (error) {
        showUserFormFeedback(mapFirebaseUserProvisioningError(error), true);
      }

      return;
    }

    const newUser = {
      id: "user-" + Date.now(),
      name: name,
      email: email,
      password: password,
      role: role,
      active: active,
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
      passwordUpdatedAt: "",
      permissions: permissions,
    };

    state.users.unshift(newUser);
    saveUsers(state.users);
    recordAudit("user.create", name + " criado com perfil " + getRoleLabel(role) + ".");
    state.selectedGovernanceUserId = newUser.id;
    closeUserModal();
    renderGovernance();
  }

  function updateUserRole(userId, role) {
    if (!can("users.manage") || !ROLE_LABELS[role]) {
      return;
    }

    state.users = state.users.map(function (user) {
      if (user.id !== userId) {
        return user;
      }

      return Object.assign({}, user, {
        role: role,
        permissions:
          role === "admin"
            ? Object.assign({}, ADMIN_PERMISSIONS)
            : user.permissions && Object.keys(user.permissions).length
              ? normalizeUserPermissions(user.permissions)
              : Object.assign({}, DEFAULT_USER_PERMISSIONS),
      });
    });
    saveUsers(state.users);
    recordAudit("user.role", "Perfil de usuário atualizado para " + getRoleLabel(role) + ".");
    renderGovernance();
  }

  function updateUserPermission(userId, permissionKey, isAllowed) {
    if (!can("users.manage")) {
      return;
    }

    state.users = state.users.map(function (user) {
      if (user.id !== userId || user.role === "admin") {
        return user;
      }

      const nextPermissions = normalizeUserPermissions(user.permissions);
      nextPermissions[permissionKey] = Boolean(isAllowed);

      return Object.assign({}, user, {
        permissions: nextPermissions,
      });
    });
    saveUsers(state.users);
    recordAudit(
      "user.permission",
      "Permissão " + permissionKey + " atualizada para " + (isAllowed ? "permitida" : "negada") + ".",
    );
    renderGovernance();
  }

  function toggleUserActive(userId) {
    if (!can("users.manage")) {
      return;
    }

    state.users = state.users.map(function (user) {
      if (user.id !== userId) {
        return user;
      }

      if (state.sessionUserId === userId && user.active) {
        return user;
      }

      return Object.assign({}, user, {
        active: !user.active,
      });
    });
    saveUsers(state.users);
    ensureCurrentUserIsValid();
    recordAudit("user.active", "Status de usuário alterado.");
    render();
  }

  function addCheckpointItem() {
    if (!can("checkpoint.create")) {
      return;
    }

    const user = getCurrentUser();
    const itemId = createCheckpointItemId();
    const topicId = createCheckpointTopicId();

    state.checkpointItems = state.checkpointItems.concat(
      normalizeCheckpointItem({
        id: itemId,
        archived: false,
        createdAt: getTodayString(),
        createdBy: user ? user.id : "",
        createdByName: user ? user.name : "",
        title: createDefaultCheckpointTitle(state.checkpointItems.length + 1),
        approvalStatus: "pending",
        topics: [
          createCheckpointTopic({
            id: topicId,
            createdBy: user ? user.id : "",
            createdByName: user ? user.name : "",
            approvalStatus: "pending",
          }),
        ],
        publicationStatus: "internal",
        publicSnapshot: null,
      }),
    );
    state.pendingCheckpointFocus = {
      itemId: itemId,
      topicId: topicId,
    };
    recordAudit(
      "checkpoint.create",
      'Assunto "' + createDefaultCheckpointTitle(state.checkpointItems.length) + '" criado como pendente.',
    );
    saveCheckpointAndRender();
    requestAnimationFrame(function () {
      const newItemEl = document.querySelector('[data-checkpoint-item-id="' + itemId + '"]');
      if (newItemEl) {
        newItemEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function updateCheckpointTitle(itemId, value) {
    const item = getCheckpointItemById(itemId);

    if (!item || !canEditCheckpointItem(item)) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (item, index) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          title: value || createDefaultCheckpointTitle(index + 1),
          approvalStatus: "pending",
          validatedAt: "",
          validatedBy: "",
          blockedAt: "",
          blockedBy: "",
        }),
      );
    });
    saveCheckpointItems(state.checkpointItems);
  }

  function addCheckpointTopic(itemId) {
    if (!can("checkpoint.create")) {
      return;
    }

    const user = getCurrentUser();
    const topicId = createCheckpointTopicId();

    state.checkpointItems = state.checkpointItems.map(function (item) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          topics: item.topics.concat(
            createCheckpointTopic({
              id: topicId,
              createdBy: user ? user.id : "",
              createdByName: user ? user.name : "",
              approvalStatus: "pending",
            }),
          ),
        }),
      );
    });
    state.pendingCheckpointFocus = {
      itemId: itemId,
      topicId: topicId,
    };
    recordAudit("checkpoint.topic.create", "Novo ponto criado como pendente.");
    saveCheckpointAndRender();
  }

  function updateCheckpointTopicText(itemId, topicId, value) {
    const item = getCheckpointItemById(itemId);
    const topic = getCheckpointTopicById(itemId, topicId);

    if (!item || !topic || !canEditCheckpointTopic(item, topic)) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (item) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          topics: item.topics.map(function (topic) {
            if (topic.id !== topicId) {
              return topic;
            }

            return Object.assign({}, topic, {
              text: value,
              approvalStatus: "pending",
              validatedAt: "",
              validatedBy: "",
              blockedAt: "",
              blockedBy: "",
            });
          }),
        }),
      );
    });
    saveCheckpointItems(state.checkpointItems);
  }

  function updateCheckpointTopicDate(itemId, topicId, value) {
    const item = getCheckpointItemById(itemId);
    const topic = getCheckpointTopicById(itemId, topicId);

    if (!item || !topic || !canEditCheckpointTopic(item, topic)) {
      return;
    }

    const nextDate = normalizeIsoDate(value);

    state.checkpointItems = state.checkpointItems.map(function (item) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          topics: item.topics.map(function (topic) {
            if (topic.id !== topicId) {
              return topic;
            }

            return Object.assign({}, topic, {
              date: nextDate,
              approvalStatus: "pending",
              validatedAt: "",
              validatedBy: "",
              blockedAt: "",
              blockedBy: "",
            });
          }),
        }),
      );
    });
    saveCheckpointItems(state.checkpointItems);
  }

  function validateCheckpointItem(itemId) {
    const item = getCheckpointItemById(itemId);
    const user = getCurrentUser();
    const validationDate = getTodayString();

    if (!item || !user || !canValidateCheckpointItem(item)) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          approvalStatus: "validated",
          validatedAt: validationDate,
          validatedBy: user.name,
          blockedAt: "",
          blockedBy: "",
          archived: false,
        }),
      );
    });
    recordAudit("checkpoint.validate", 'Assunto "' + item.title + '" validado.');
    saveCheckpointAndRender();
  }

  async function blockCheckpointItem(itemId) {
    const item = getCheckpointItemById(itemId);
    const user = getCurrentUser();
    const blockedDate = getTodayString();

    if (!item || !user || !canValidateCheckpointItem(item)) {
      return;
    }

    const confirmed = await showConfirm(
      "Bloquear este assunto e movê-lo automaticamente para o arquivo?",
    );

    if (!confirmed) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          approvalStatus: "blocked",
          blockedAt: blockedDate,
          blockedBy: user.name,
          validatedAt: "",
          validatedBy: "",
          archived: true,
          publicationStatus: "internal",
        }),
      );
    });
    recordAudit("checkpoint.block", 'Assunto "' + item.title + '" bloqueado e arquivado.');
    saveCheckpointAndRender();
  }

  function validateCheckpointTopic(itemId, topicId) {
    const item = getCheckpointItemById(itemId);
    const topic = getCheckpointTopicById(itemId, topicId);
    const user = getCurrentUser();
    const validationDate = getTodayString();

    if (!item || !topic || !user || !canValidateCheckpointTopic(topic)) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          topics: entry.topics.map(function (currentTopic) {
            if (currentTopic.id !== topicId) {
              return currentTopic;
            }

            return Object.assign({}, currentTopic, {
              approvalStatus: "validated",
              date: validationDate,
              validatedAt: validationDate,
              validatedBy: user.name,
              blockedAt: "",
              blockedBy: "",
            });
          }),
        }),
      );
    });
    recordAudit("checkpoint.topic.validate", "Ponto validado.");
    saveCheckpointAndRender();
  }

  function blockCheckpointTopic(itemId, topicId) {
    const item = getCheckpointItemById(itemId);
    const topic = getCheckpointTopicById(itemId, topicId);
    const user = getCurrentUser();
    const blockedDate = getTodayString();

    if (!item || !topic || !user || !canValidateCheckpointTopic(topic)) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          topics: entry.topics.map(function (currentTopic) {
            if (currentTopic.id !== topicId) {
              return currentTopic;
            }

            return Object.assign({}, currentTopic, {
              approvalStatus: "blocked",
              validatedAt: "",
              validatedBy: "",
              blockedAt: blockedDate,
              blockedBy: user.name,
            });
          }),
        }),
      );
    });
    recordAudit("checkpoint.topic.block", "Ponto bloqueado.");
    saveCheckpointAndRender();
  }

  function archiveCheckpointItem(itemId) {
    if (!can("checkpoint.archive")) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (item) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          archived: true,
        }),
      );
    });
    recordAudit("checkpoint.archive", "Assunto arquivado.");
    saveCheckpointAndRender();
  }

  function deleteCheckpointTopic(itemId, topicId) {
    const item = getCheckpointItemById(itemId);
    const topic = getCheckpointTopicById(itemId, topicId);

    if (!item || !topic || !can("checkpoint.delete") || topic.canDelete === false) {
      return;
    }

    state.checkpointItems = state.checkpointItems
      .map(function (checkpointItem) {
        if (checkpointItem.id !== itemId) {
          return checkpointItem;
        }

        return normalizeCheckpointItem(
          Object.assign({}, checkpointItem, {
            topics: checkpointItem.topics.filter(function (checkpointTopic) {
              return checkpointTopic.id !== topicId;
            }),
          }),
        );
      })
      .filter(function (checkpointItem) {
        return checkpointItem.topics.length > 0;
      });

    recordAudit("checkpoint.topic.delete", "Ponto excluído da ata interna.");
    saveCheckpointAndRender();
  }

  async function deleteCheckpointItem(itemId) {
    const item = getCheckpointItemById(itemId);

    if (!item || !can("checkpoint.delete")) {
      return;
    }

    const confirmed = await showConfirm(
      "Excluir este assunto inteiro e todos os pontos? Essa ação não pode ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    state.checkpointItems = state.checkpointItems.filter(function (checkpointItem) {
      return checkpointItem.id !== itemId;
    });
    recordAudit("checkpoint.delete", "Assunto excluído da ata interna.");
    saveCheckpointAndRender();
  }

  function restoreCheckpointItem(itemId) {
    if (!can("checkpoint.archive")) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (item) {
      if (item.id !== itemId) {
        return item;
      }

      return normalizeCheckpointItem(
        Object.assign({}, item, {
          archived: false,
          approvalStatus: item.approvalStatus === "blocked" ? "pending" : item.approvalStatus,
          blockedAt: item.approvalStatus === "blocked" ? "" : item.blockedAt,
          blockedBy: item.approvalStatus === "blocked" ? "" : item.blockedBy,
        }),
      );
    });
    recordAudit("checkpoint.restore", "Assunto restaurado.");
    saveCheckpointAndRender();
  }

  function toggleArchivedCheckpoint() {
    state.checkpointArchivedVisible = !state.checkpointArchivedVisible;
    saveCheckpointUiState(state.checkpointArchivedVisible);
    renderCheckpoint();
  }

  function focusPendingCheckpointItem() {
    if (!state.pendingCheckpointFocus) {
      return;
    }

    const input = document.querySelector(
      '[data-checkpoint-topic-input="true"][data-checkpoint-id="' +
        state.pendingCheckpointFocus.itemId +
        '"][data-topic-id="' +
        state.pendingCheckpointFocus.topicId +
        '"]',
    );

    state.pendingCheckpointFocus = null;

    if (!input) {
      return;
    }

    input.focus();
    const textLength = input.value.length;
    input.setSelectionRange(textLength, textLength);
  }

  function autoResizeCheckpointTitleInputs() {
    document.querySelectorAll("[data-checkpoint-title-input]").forEach(function (input) {
      resizeCheckpointTitleInput(input);
    });
  }

  function resizeCheckpointTitleInput(input) {
    if (!input) {
      return;
    }

    input.style.width = "100%";
    input.style.height = "0px";
    input.style.height = Math.max(input.scrollHeight, 48) + "px";
  }

  async function generateCardFromCheckpointTopic(itemId, topicId) {
    const topic = getCheckpointTopicById(itemId, topicId);
    const topicKey = getCheckpointTopicKey(itemId, topicId);
    let generatedCard = null;

    if (!topic || !can("ai.generate")) {
      return;
    }

    if (!topic.text.trim()) {
      setCheckpointFeedback("error", "Preencha o texto do ponto antes de gerar o cartão.");
      renderCheckpoint();
      return;
    }

    if (!ensureCheckpointAiConfiguration()) {
      setCheckpointFeedback("error", "Configure a IA antes de transformar pontos em cartões.");
      renderCheckpoint();
      return;
    }

    state.checkpointGeneratingTopics[topicKey] = true;
    setCheckpointFeedback("success", "Gerando sugestão e criando o cartão no painel...");
    renderCheckpoint();

    try {
      const suggestion = await requestCheckpointCardSuggestion(topic);
      generatedCard = normalizeCard({
        id: createCardId(),
        title: suggestion.title.trim() || createFallbackCardTitle(topic.text),
        description: suggestion.description.trim() || topic.text.trim(),
        dueDate: normalizeIsoDate(topic.date),
        discipline: resolveCheckpointDiscipline(suggestion.discipline),
        columnId: CHECKPOINT_CARD_COLUMN_ID,
        blockedBy: "",
        waitingReason: "",
        publicationStatus: "internal",
        publicSnapshot: null,
      });

      state.cards.unshift(generatedCard);
      state.checkpointItems = state.checkpointItems.map(function (item) {
        if (item.id !== itemId) {
          return item;
        }

        return normalizeCheckpointItem(
          Object.assign({}, item, {
            topics: item.topics.map(function (currentTopic) {
              if (currentTopic.id !== topicId) {
                return currentTopic;
              }

              return Object.assign({}, currentTopic, {
                linkedCardId: generatedCard.id,
              });
            }),
          }),
        );
      });

      saveCards(state.cards);
      saveCheckpointItems(state.checkpointItems);
      recordAudit("ai.generate_card", 'Cartão "' + generatedCard.title + '" gerado a partir de ponto.');
      setCheckpointFeedback(
        "success",
        'Cartão "' + generatedCard.title + '" criado em Pendências do Projeto.',
      );
    } catch (error) {
      setCheckpointFeedback(
        "error",
        error && error.message ? error.message : "Não foi possível gerar o cartão com IA.",
      );
    } finally {
      delete state.checkpointGeneratingTopics[topicKey];

      if (generatedCard) {
        render();
      } else {
        renderCheckpoint();
      }
    }
  }

  function sendCardToReview(cardId) {
    const card = getCardById(cardId);

    if (!card || !can("cards.review")) {
      return;
    }

    state.cards = state.cards.map(function (item) {
      if (item.id !== cardId) {
        return item;
      }

      return normalizeCard(
        Object.assign({}, item, {
          publicationStatus: "review",
          publicSnapshot: buildPublicCardSnapshot(item),
        }),
      );
    });
    recordAudit("card.review", 'Cartão "' + card.title + '" enviado para revisão pública.');
    saveAndRender();
  }

  function publishCard(cardId) {
    const card = getCardById(cardId);
    const validation = validateCardForPublication(card);

    if (!card || !can("cards.publish")) {
      return;
    }

    if (validation.length) {
      showToast(
        "Publicação bloqueada: possível dado pessoal detectado — " + validation.join(", "),
        "warning",
      );
      return;
    }

    state.cards = state.cards.map(function (item) {
      if (item.id !== cardId) {
        return item;
      }

      return normalizeCard(
        Object.assign({}, item, {
          publicationStatus: "published",
          publicSnapshot: buildPublicCardSnapshot(item),
        }),
      );
    });
    recordAudit("card.publish", 'Cartão "' + card.title + '" publicado.');
    saveAndRender();
  }

  function unpublishCard(cardId) {
    const card = getCardById(cardId);

    if (!card || !can("cards.publish")) {
      return;
    }

    state.cards = state.cards.map(function (item) {
      if (item.id !== cardId) {
        return item;
      }

      return normalizeCard(
        Object.assign({}, item, {
          publicationStatus: "internal",
        }),
      );
    });
    recordAudit("card.unpublish", 'Cartão "' + card.title + '" retirado da área pública.');
    saveAndRender();
  }

  function sendCheckpointToReview(itemId) {
    const item = getCheckpointItemById(itemId);

    if (!item || !can("checkpoint.review")) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          publicationStatus: "review",
          publicSnapshot: buildCheckpointPublicSnapshot(entry),
        }),
      );
    });
    recordAudit("checkpoint.review", 'Assunto "' + item.title + '" enviado para revisão pública.');
    saveCheckpointAndRender();
  }

  function publishCheckpointItem(itemId) {
    const item = getCheckpointItemById(itemId);
    const validation = validateCheckpointForPublication(item);

    if (!item || !can("checkpoint.publish")) {
      return;
    }

    if (validation.length) {
      setCheckpointFeedback(
        "error",
        "Publicação bloqueada por possível dado pessoal direto: " + validation.join("; "),
      );
      renderCheckpoint();
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          publicationStatus: "published",
          publicSnapshot: buildCheckpointPublicSnapshot(entry),
        }),
      );
    });
    recordAudit("checkpoint.publish", 'Assunto "' + item.title + '" publicado.');
    setCheckpointFeedback("success", "Assunto publicado para a área pública.");
    saveCheckpointAndRender();
  }

  function unpublishCheckpointItem(itemId) {
    const item = getCheckpointItemById(itemId);

    if (!item || !can("checkpoint.publish")) {
      return;
    }

    state.checkpointItems = state.checkpointItems.map(function (entry) {
      if (entry.id !== itemId) {
        return entry;
      }

      return normalizeCheckpointItem(
        Object.assign({}, entry, {
          publicationStatus: "internal",
        }),
      );
    });
    recordAudit("checkpoint.unpublish", 'Assunto "' + item.title + '" retirado da área pública.');
    setCheckpointFeedback("success", "Assunto retirado da área pública.");
    saveCheckpointAndRender();
  }

  function configureCheckpointAi() {
    if (!can("ai.configure")) {
      setCheckpointFeedback("error", "Apenas admin pode configurar a IA nesta V1.");
      renderCheckpoint();
      return;
    }
    openOpenAiConfigModal();
  }

  function openOpenAiConfigModal() {
    const currentConfig = state.checkpointOpenAiConfig;
    elements.openaiConfigApikeyLabel.textContent = currentConfig.apiKey
      ? "API Key (deixe em branco para manter a atual)"
      : "API Key";
    elements.openaiConfigApikey.value = "";
    elements.openaiConfigModel.value = currentConfig.model;
    elements.openaiConfigEndpoint.value = currentConfig.endpoint;
    elements.openaiConfigModalBackdrop.classList.remove("hidden");
    elements.openaiConfigApikey.focus();
    activateFocusTrap(elements.openaiConfigModalBackdrop);
  }

  function closeOpenAiConfigModal() {
    deactivateFocusTrap();
    elements.openaiConfigModalBackdrop.classList.add("hidden");
  }

  function ensureCheckpointAiConfiguration() {
    if (state.checkpointOpenAiConfig.apiKey) {
      return true;
    }

    if (!can("ai.configure")) {
      return false;
    }

    configureCheckpointAi();
    return Boolean(state.checkpointOpenAiConfig.apiKey);
  }

  async function deleteCard(cardId) {
    const card = getCardById(cardId);

    if (!card || card.columnId !== "approved" || !can("cards.delete")) {
      return;
    }

    const confirmed = await showConfirm(
      'Excluir este cartão de "Entregues"? Essa ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    state.cards = state.cards.filter(function (item) {
      return item.id !== cardId;
    });
    recordAudit("card.delete", 'Cartão "' + card.title + '" excluído.');
    saveAndRender();
  }

  function renderGovernance() {
    const canManageUsers = can("users.manage");
    const canViewAudit = can("audit.view");
    const isLoggedIn = Boolean(getCurrentUser());

    renderPrivacyNotice();
    renderPermissionModel();
    renderDataClassification();
    renderUsers();
    renderAuditLogs();

    elements.userAdminPanel.classList.toggle("hidden", !canManageUsers);
    elements.auditLogPanel.classList.toggle("hidden", !canViewAudit);
    elements.exportMyDataPanel.classList.toggle("hidden", !isLoggedIn);
    elements.passwordGovernancePanel.classList.toggle("hidden", !isLoggedIn);

    if (isLoggedIn) {
      var currentUser = getCurrentUser();
      elements.passwordGovernanceCopy.textContent =
        currentUser && currentUser.mustChangePassword
          ? "Este acesso ainda usa uma senha provisoria. Troque-a agora para liberar o ambiente interno. A sessao interna tambem expira apos 30 minutos."
          : "Atualize sua senha sempre que precisar. As sessoes internas expiram apos 30 minutos e exigem novo check-in.";
    }
  }

  function renderPrivacyNotice() {
    const requestCount = state.privacyRequests.length;

    elements.privacyNoticeContent.innerHTML =
      "<p>Esta V1 trabalha com leitura pública por padrão e operação interna autenticada. Cards e pautas podem ser vistos sem login, mas criar, editar, mover, excluir, arquivar e configurar IA depende das permissões do usuário.</p>" +
      "<p><strong>Dados tratados:</strong> contas de usuários, credenciais locais de demonstração, histórico de ações, solicitações do titular e trilha de auditoria. O princípio adotado é o da minimização: os perfis recebem apenas as autonomias necessárias.</p>" +
      "<p><strong>Base legal e finalidade:</strong> o tratamento fundamenta-se no legítimo interesse do controlador (art. 7º, IX da LGPD) para viabilizar a coordenação interna de projetos. Os dados são usados exclusivamente para autenticação, controle de acesso, rastreabilidade de operações e atendimento aos direitos do titular.</p>" +
      "<p><strong>Retenção:</strong> os dados são mantidos enquanto o acesso estiver ativo. Após solicitação de eliminação pelo titular ou inatividade superior a 180 dias, os dados são removidos da base local. Logs de auditoria são limitados aos 120 registros mais recentes.</p>" +
      "<p><strong>Encarregado (DPO):</strong> Bruno Ribeiro — <a href='mailto:contato@mykan.local'>contato@mykan.local</a>.</p>" +
      "<p>Canal do titular: o formulário dedicado registra pedidos de confirmação, acesso, correção, eliminação, oposição, revisão automatizada e incidentes. Total registrado nesta base local: <strong>" +
      String(requestCount) +
      "</strong>.</p>";
  }

  function renderPermissionModel() {
    elements.permissionModelList.innerHTML =
      '<div class="queue-item"><p><strong>Admin</strong></p><p>Tem acesso total e pode personalizar as permissões de cada usuário.</p></div>' +
      '<div class="queue-item"><p><strong>Usuário</strong></p><p>Recebe apenas as permissões habilitadas individualmente pelo admin.</p></div>';
  }

  function renderDataClassification() {
    elements.dataClassificationList.innerHTML = DATA_CLASSIFICATION.map(function (item) {
      return (
        '<div class="classification-item">' +
        "<p><strong>" +
        escapeHtml(item.label) +
        "</strong></p>" +
        "<p>" +
        escapeHtml(item.description) +
        "</p>" +
        "</div>"
      );
    }).join("");
  }

  function renderUsers() {
    if (!can("users.manage")) {
      elements.usersList.innerHTML = "";
      elements.editSelectedUserButton.disabled = true;
      return;
    }

    if (
      state.selectedGovernanceUserId &&
      !state.users.some(function (user) {
        return user.id === state.selectedGovernanceUserId;
      })
    ) {
      state.selectedGovernanceUserId = "";
    }

    elements.usersList.innerHTML = state.users
      .map(function (user) {
        const isSelected = user.id === state.selectedGovernanceUserId;
        const enabledPermissions = user.role === "admin" ? "acesso total" : countEnabledPermissions(user) + " permissões ativas";

        return (
          '<button class="user-row user-row-button' +
          (isSelected ? " is-selected" : "") +
          '" type="button" data-select-governance-user="' +
          user.id +
          '">' +
          '<div class="user-row-header">' +
          makeAvatar(user.name) +
          "<div>" +
          "<p><strong>" +
          escapeHtml(user.name) +
          "</strong></p>" +
          "<p>" +
          escapeHtml(user.email) +
          " · " +
          escapeHtml(user.active ? "ativo" : "desativado") +
          "</p>" +
          "</div>" +
          '<span class="user-row-badge"><strong>' +
          escapeHtml(getRoleLabel(user.role)) +
          "</strong></span>" +
          "</div>" +
          '<div class="user-row-summary">' +
          "<span>" +
          escapeHtml(enabledPermissions) +
          "</span>" +
          "<span>" +
          escapeHtml(user.createdAt ? "Criado em " + formatFullDate(user.createdAt) : "") +
          "</span>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");

    elements.editSelectedUserButton.disabled = !state.selectedGovernanceUserId;
  }

  function renderAuditLogs() {
    if (!can("audit.view")) {
      elements.auditLogList.innerHTML = "";
      elements.auditActorFilter.innerHTML = "";
      return;
    }

    const actors = ["all"].concat(
      Array.from(
        new Set(
          state.auditLogs.map(function (item) {
            return item.actor || "desconhecido";
          }),
        ),
      ),
    );

    if (!actors.includes(state.auditActorFilter)) {
      state.auditActorFilter = "all";
    }

    elements.auditActorFilter.innerHTML = actors
      .map(function (actor) {
        return (
          '<option value="' +
          escapeHtml(actor) +
          '"' +
          (state.auditActorFilter === actor ? " selected" : "") +
          ">" +
          escapeHtml(actor === "all" ? "Todos os usuários" : actor) +
          "</option>"
        );
      })
      .join("");

    const items = state.auditLogs
      .filter(function (item) {
        return state.auditActorFilter === "all" || item.actor === state.auditActorFilter;
      })
      .slice(0, 48);

    elements.auditLogList.innerHTML = items.length
      ? items
          .map(function (item) {
            return (
              '<div class="audit-log-item">' +
              '<div class="audit-log-head">' +
              "<strong>" +
              escapeHtml(item.action) +
              "</strong>" +
              "<span>" +
              escapeHtml(formatDateTime(item.createdAt)) +
              "</span>" +
              "</div>" +
              '<p class="audit-log-actor">' +
              escapeHtml(item.actor || "desconhecido") +
              "</p>" +
              "<p>" +
              escapeHtml(item.message) +
              "</p>" +
              "</div>"
            );
          })
          .join("")
      : '<div class="audit-log-item"><p>Nenhum evento encontrado para o filtro selecionado.</p></div>';
  }

  function createPublicationButtonsMarkup(entityType, status, entityId) {
    const buttons = [];
    const canReview =
      entityType === "card" ? can("cards.review") : can("checkpoint.review");
    const canPublish =
      entityType === "card" ? can("cards.publish") : can("checkpoint.publish");

    if (status === "internal" && canReview) {
      buttons.push(
        '<button class="publication-button is-review" type="button" data-review-' +
          entityType +
          '="' +
          entityId +
          '">Enviar p/ revisão</button>',
      );
    }

    if (status !== "published" && canPublish) {
      buttons.push(
        '<button class="publication-button is-publish" type="button" data-publish-' +
          entityType +
          '="' +
          entityId +
          '">Publicar</button>',
      );
    }

    if (status === "published" && canPublish) {
      buttons.push(
        '<button class="publication-button is-unpublish" type="button" data-unpublish-' +
          entityType +
          '="' +
          entityId +
          '">Retirar do público</button>',
      );
    }

    return buttons.join("");
  }

  function createPublicationStatusBadge(status) {
    return (
      '<span class="status-badge is-' +
      escapeHtml(status) +
      '">' +
      escapeHtml(getPublicationLabel(status)) +
      "</span>"
    );
  }

  function getPublicationLabel(status) {
    if (status === "published") {
      return "Publicado";
    }

    if (status === "review") {
      return "Em revisão";
    }

    return "Interno";
  }

  function showFormError(message) {
    elements.formError.textContent = message;
    elements.formError.classList.remove("hidden");
  }

  function showDisciplineFormError(message) {
    elements.disciplineFormError.textContent = message;
    elements.disciplineFormError.classList.remove("hidden");
  }

  function showBlockFormError(message) {
    elements.blockFormError.textContent = message;
    elements.blockFormError.classList.remove("hidden");
  }

  function showAuthFormError(message) {
    showAuthFormMessage(message, true);
  }

  function showAuthFormMessage(message, isError) {
    elements.authFormError.textContent = message;
    elements.authFormError.classList.remove("hidden");
    elements.authFormError.classList.toggle("is-success", !isError);
  }

  function showPrivacyRequestFeedback(message, isError) {
    elements.privacyRequestFeedback.textContent = message;
    elements.privacyRequestFeedback.classList.remove("hidden");
    elements.privacyRequestFeedback.classList.toggle("is-error", Boolean(isError));
  }

  function showUserFormFeedback(message, isError) {
    elements.userFormFeedback.textContent = message;
    elements.userFormFeedback.classList.remove("hidden");
    elements.userFormFeedback.classList.toggle("is-error", Boolean(isError));
  }

  function toggleColumnVisibility(columnId) {
    if (!columnId) {
      return;
    }

    const isCurrentlyHidden = state.hiddenColumns.includes(columnId);

    if (isCurrentlyHidden) {
      state.hiddenColumns = state.hiddenColumns.filter(function (item) {
        return item !== columnId;
      });
    } else {
      if (COLUMNS.length - state.hiddenColumns.length <= 1) {
        return;
      }

      state.hiddenColumns = state.hiddenColumns.concat(columnId);
    }

    saveColumnVisibility(state.hiddenColumns);
    render();
  }

  function saveAndRender() {
    state.cards = normalizeCards(normalizeBlockedState(state.cards));
    saveCards(state.cards);
    saveColumnVisibility(state.hiddenColumns);
    render();
  }

  function saveCheckpointAndRender() {
    state.checkpointItems = normalizeCheckpointItems(state.checkpointItems);
    saveCheckpointItems(state.checkpointItems);
    saveCheckpointUiState(state.checkpointArchivedVisible);
    renderCheckpoint();
    renderGovernance();
  }

  function getVisibleCardsByColumn(columnId) {
    const query = state.searchQuery.toLowerCase().trim();
    return state.cards.filter(function (card) {
      const matchesColumn = card.columnId === columnId;
      const matchesFilter =
        state.activeFilter === "Todas" || card.discipline === state.activeFilter;
      const matchesSearch =
        !query ||
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query));

      return matchesColumn && matchesFilter && matchesSearch;
    });
  }

  function getPublishedCardsByColumn(columnId) {
    return state.cards.filter(function (card) {
      const snapshot = card.publicSnapshot;
      const discipline = snapshot ? snapshot.discipline : card.discipline;
      const matchesColumn =
        card.publicationStatus === "published" && snapshot && snapshot.columnId === columnId;
      const matchesFilter =
        state.activeFilter === "Todas" || discipline === state.activeFilter;

      return Boolean(matchesColumn && matchesFilter);
    });
  }

  function getCardById(cardId) {
    return state.cards.find(function (card) {
      return card.id === cardId;
    });
  }

  function getUserById(userId) {
    return (
      state.users.find(function (user) {
        return user.id === userId;
      }) || null
    );
  }

  function getCheckpointItemById(itemId) {
    return state.checkpointItems.find(function (item) {
      return item.id === itemId;
    });
  }

  function getCheckpointTopicById(itemId, topicId) {
    const item = getCheckpointItemById(itemId);

    if (!item) {
      return null;
    }

    return item.topics.find(function (topic) {
      return topic.id === topicId;
    }) || null;
  }

  function setCheckpointFeedback(type, text) {
    state.checkpointFeedback = {
      type: type,
      text: text,
    };
  }

  function getCardViewModel(card, publicView) {
    return {
      title: card.title,
      description: card.description,
      dueDate: card.dueDate,
      discipline: card.discipline,
      columnId: card.columnId,
    };
  }

  function getTopicsForCheckpointView(item, publicView) {
    if (!publicView) {
      return item.topics;
    }

    return item.topics.filter(function (topic) {
      return topic.approvalStatus === "validated";
    });
  }

  function getPublishedCheckpointTitle(item) {
    return item.title || "Assunto publicado";
  }

  function getCheckpointItemSubtitleText(item) {
    if (item.approvalStatus === "validated" && item.validatedAt) {
      return "Validado em " + formatFullDate(item.validatedAt);
    }

    if (item.approvalStatus === "blocked" && item.blockedAt) {
      return "Bloqueado em " + formatFullDate(item.blockedAt);
    }

    return "Criado em " + formatFullDate(item.createdAt);
  }

  function getCheckpointItemCreatorText(item) {
    if (!item || !item.createdByName) {
      return "";
    }

    return "Por " + item.createdByName;
  }

  function getCheckpointTopicCreatorText(topic) {
    if (!topic || !topic.createdByName) {
      return "";
    }

    return "Por " + topic.createdByName;
  }

  function getCheckpointTopicStatusText(topic, isGenerating, hasApiKey) {
    const aiText = isGenerating
      ? "Gerando sugestão de cartão..."
      : topic.linkedCardId
        ? "Cartão criado em Pendências a partir deste ponto."
        : hasApiKey
          ? "Use IA para gerar título, descrição e disciplina."
          : "Configure a IA para habilitar esse fluxo.";

    if (topic.approvalStatus === "validated" && topic.validatedAt) {
      return "Validado em " + formatFullDate(topic.validatedAt) + ". " + aiText;
    }

    if (topic.approvalStatus === "blocked") {
      return "Ponto bloqueado. " + aiText;
    }

    return "Pendente de validação. " + aiText;
  }

  function getLatestValidatedCheckpointTopicId(item) {
    if (!item || !Array.isArray(item.topics)) {
      return "";
    }

    const latestValidatedTopic = item.topics.reduce(function (currentLatest, topic, index) {
      if (!topic || topic.approvalStatus !== "validated") {
        return currentLatest;
      }

      const topicDate = topic.validatedAt || topic.date || "";

      if (!currentLatest) {
        return {
          id: topic.id,
          date: topicDate,
          index: index,
        };
      }

      if (topicDate > currentLatest.date) {
        return {
          id: topic.id,
          date: topicDate,
          index: index,
        };
      }

      if (topicDate === currentLatest.date && index > currentLatest.index) {
        return {
          id: topic.id,
          date: topicDate,
          index: index,
        };
      }

      return currentLatest;
    }, null);

    return latestValidatedTopic ? latestValidatedTopic.id : "";
  }

  function createCheckpointWorkflowBadge(status) {
    return (
      '<span class="status-badge is-' +
      escapeHtml(status || "pending") +
      '">' +
      escapeHtml(getCheckpointWorkflowLabel(status)) +
      "</span>"
    );
  }

  function getCheckpointWorkflowLabel(status) {
    if (status === "validated") {
      return "Validado";
    }

    if (status === "blocked") {
      return "Bloqueado";
    }

    return "Pendente";
  }

  function selectGovernanceUser(userId) {
    state.selectedGovernanceUserId = state.selectedGovernanceUserId === userId ? "" : userId;
    renderGovernance();
  }

  function countEnabledPermissions(user) {
    if (!user || !user.permissions) {
      return 0;
    }

    return Object.keys(user.permissions).filter(function (key) {
      return Boolean(user.permissions[key]);
    }).length;
  }

  function buildPublicCardSnapshot(card) {
    return {
      title: sanitizePublicText(card.title),
      description: sanitizePublicText(card.description),
      dueDate: normalizeIsoDate(card.dueDate),
      discipline: card.discipline,
      columnId: card.columnId,
    };
  }

  function buildCheckpointPublicSnapshot(item) {
    return {
      title: sanitizePublicText(item.title),
      topics: item.topics.filter(function (topic) {
        return topic.approvalStatus === "validated";
      }).map(function (topic) {
        return {
          id: topic.id,
          date: normalizeIsoDate(topic.date),
          text: sanitizePublicText(topic.text),
        };
      }),
    };
  }

  function validateCardForPublication(card) {
    if (!card) {
      return ["Cartão inexistente."];
    }

    return collectPublicationIssues([card.title, card.description, card.waitingReason]);
  }

  function validateCheckpointForPublication(item) {
    if (!item) {
      return ["Assunto inexistente."];
    }

    const issues = [];

    if (item.approvalStatus !== "validated") {
      issues.push("Assunto ainda não validado.");
    }

    if (
      item.topics.some(function (topic) {
        return topic.approvalStatus !== "validated";
      })
    ) {
      issues.push("Há pontos pendentes ou bloqueados.");
    }

    return issues.concat(
      collectPublicationIssues(
        [item.title].concat(
          item.topics.map(function (topic) {
            return topic.text;
          }),
        ),
      ),
    );
  }

  function collectPublicationIssues(strings) {
    const issues = [];

    strings.forEach(function (value) {
      const result = detectDirectPersonalData(value);

      if (result) {
        issues.push(result);
      }
    });

    return Array.from(new Set(issues));
  }

  function detectDirectPersonalData(value) {
    const text = String(value || "");

    if (!text.trim()) {
      return "";
    }

    if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)) {
      return "e-mail";
    }

    if (/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/.test(text)) {
      return "CPF";
    }

    if (/\b(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/.test(text)) {
      return "telefone";
    }

    return "";
  }

  function sanitizePublicText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function canEditCheckpointItem(item) {
    const user = getCurrentUser();

    if (!item || !user) {
      return false;
    }

    return can("checkpoint.edit") || item.createdBy === user.id;
  }

  function canEditCheckpointTopic(item, topic) {
    const user = getCurrentUser();

    if (!item || !topic || !user) {
      return false;
    }

    return can("checkpoint.edit") || topic.createdBy === user.id;
  }

  function canValidateCheckpointItem(item) {
    const user = getCurrentUser();

    if (!item || !user || !can("checkpoint.validate")) {
      return false;
    }

    return user.role === "admin" || item.createdBy !== user.id;
  }

  function canValidateCheckpointTopic(topic) {
    const user = getCurrentUser();

    if (!topic || !user || !can("checkpoint.validate")) {
      return false;
    }

    return user.role === "admin" || topic.createdBy !== user.id;
  }

  function can(permission) {
    const user = getCurrentUser();

    if (!user) {
      return false;
    }

    if (user.role === "admin") {
      return Boolean(ADMIN_PERMISSIONS[permission] || ROLE_PERMISSIONS.admin[permission]);
    }

    return Boolean(user.permissions && user.permissions[permission]);
  }

  function getRoleLabel(role) {
    return ROLE_LABELS[role] || "Perfil";
  }

  function isAuthenticated() {
    return Boolean(getCurrentUser());
  }

  function exportMyData() {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    const myLogs = state.auditLogs.filter(function (log) {
      return log.actor === user.email || log.actor === user.name;
    });

    const payload = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
      auditHistory: myLogs.map(function (log) {
        return { action: log.action, detail: log.detail, timestamp: log.timestamp };
      }),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meus-dados-mykan-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Dados exportados com sucesso.", "success");
  }

  function isPublicView() {
    return !isAuthenticated();
  }

  function isInternalViewUnlocked() {
    return isAuthenticated();
  }

  function getCurrentUser() {
    if (!state.sessionUserId) {
      return null;
    }

    return (
      state.users.find(function (user) {
        return user.id === state.sessionUserId && user.active;
      }) || null
    );
  }

  function recordAudit(action, message) {
    const actor = getCurrentUser();

    const auditEntry = {
      id: "audit-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      action: action,
      message: message,
      actor: actor ? actor.email : "publico",
      createdAt: new Date().toISOString(),
    };

    state.auditLogs.unshift(auditEntry);
    state.auditLogs = state.auditLogs.slice(0, 120);
    saveAuditLogs(state.auditLogs);

    if (firebaseState.enabled && hasFirebaseCurrentUser()) {
      firebaseApi.saveAuditLogEntry(auditEntry).catch(function (error) {
        console.error("Audit log sync failed", error);
      });
    }
  }

  function normalizeBlockedState(cards) {
    return cards.map(function (card) {
      if (card.columnId === "blocked") {
        return card;
      }

      return Object.assign({}, card, {
        blockedBy: "",
        waitingReason: "",
      });
    });
  }

  function syncDisciplinesWithCards() {
    const knownDisciplines = state.disciplines.slice();

    state.cards.forEach(function (card) {
      if (!knownDisciplines.includes(card.discipline)) {
        knownDisciplines.push(card.discipline);
      }

      if (card.blockedBy && !knownDisciplines.includes(card.blockedBy)) {
        knownDisciplines.push(card.blockedBy);
      }
    });

    state.disciplines = knownDisciplines;
  }

  function populateSelects() {
    elements.disciplineSelect.innerHTML = state.disciplines
      .map(function (discipline) {
        return '<option value="' + escapeHtml(discipline) + '">' + escapeHtml(discipline) + "</option>";
      })
      .join("");

    elements.blockDisciplineSelect.innerHTML = [
      '<option value="">Selecione a disciplina</option>',
      ...state.disciplines.map(function (discipline) {
        return '<option value="' + escapeHtml(discipline) + '">' + escapeHtml(discipline) + "</option>";
      }),
    ].join("");

    elements.columnSelect.innerHTML = COLUMNS.map(function (column) {
      return '<option value="' + column.id + '">' + escapeHtml(column.title) + "</option>";
    }).join("");
  }

  function ensureCurrentUserIsValid() {
    if (!state.sessionUserId) {
      return;
    }

    const user = getCurrentUser();

    if (user) {
      return;
    }

    state.sessionUserId = "";
    saveSessionUserId("");
    clearSessionMeta();
  }

  function scheduleSessionTimeout(expiresAt) {
    if (firebaseState.sessionTimer) {
      window.clearTimeout(firebaseState.sessionTimer);
      firebaseState.sessionTimer = 0;
    }

    if (!expiresAt) {
      return;
    }

    var delay = new Date(expiresAt).getTime() - Date.now();

    if (delay <= 0) {
      expireCurrentSession();
      return;
    }

    firebaseState.sessionTimer = window.setTimeout(function () {
      expireCurrentSession();
    }, delay);
  }

  function clearSessionTimeoutTimer() {
    if (!firebaseState.sessionTimer) {
      return;
    }

    window.clearTimeout(firebaseState.sessionTimer);
    firebaseState.sessionTimer = 0;
  }

  function applySessionMeta(userId, options) {
    var sessionMeta = options && options.expiresAt
      ? {
          userId: userId,
          expiresAt: options.expiresAt,
        }
      : {
          userId: userId,
          expiresAt: createSessionExpiryIso(),
        };

    saveSessionUserId(userId);
    saveSessionMeta(sessionMeta);
    scheduleSessionTimeout(sessionMeta.expiresAt);
    return sessionMeta;
  }

  function getCurrentSessionMetaForUser(userId) {
    var sessionMeta = loadSessionMeta();

    if (!sessionMeta || sessionMeta.userId !== userId) {
      return null;
    }

    return sessionMeta;
  }

  function loadCards() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return SEED_CARDS.slice();
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return SEED_CARDS.slice();
      }

      return parsed;
    } catch (error) {
      return SEED_CARDS.slice();
    }
  }

  function saveCards(cards) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    queueFirebaseSync("cards");
  }

  function loadCheckpointItems() {
    try {
      const raw = window.localStorage.getItem(CHECKPOINT_STORAGE_KEY);

      if (!raw) {
        return getDefaultCheckpointItems();
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return getDefaultCheckpointItems();
      }

      return parsed;
    } catch (error) {
      return getDefaultCheckpointItems();
    }
  }

  function saveCheckpointItems(items) {
    window.localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify(items));
    queueFirebaseSync("checkpointItems");
  }

  function loadOpenAiConfig() {
    try {
      const raw = window.localStorage.getItem(OPENAI_CONFIG_STORAGE_KEY);

      if (!raw) {
        return normalizeOpenAiConfig({});
      }

      return normalizeOpenAiConfig(JSON.parse(raw));
    } catch (error) {
      return normalizeOpenAiConfig({});
    }
  }

  function saveOpenAiConfig(config) {
    window.localStorage.setItem(
      OPENAI_CONFIG_STORAGE_KEY,
      JSON.stringify(normalizeOpenAiConfig(config)),
    );
  }

  function loadCheckpointUiState() {
    try {
      const raw = window.localStorage.getItem(CHECKPOINT_UI_STORAGE_KEY);

      if (raw === null) {
        return true;
      }

      return JSON.parse(raw) !== false;
    } catch (error) {
      return true;
    }
  }

  function saveCheckpointUiState(isVisible) {
    window.localStorage.setItem(CHECKPOINT_UI_STORAGE_KEY, JSON.stringify(isVisible));
  }

  function loadDisciplines() {
    try {
      const raw = window.localStorage.getItem(DISCIPLINES_STORAGE_KEY);

      if (!raw) {
        return DEFAULT_DISCIPLINES.slice();
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed) || !parsed.length) {
        return DEFAULT_DISCIPLINES.slice();
      }

      return parsed;
    } catch (error) {
      return DEFAULT_DISCIPLINES.slice();
    }
  }

  function saveDisciplines(disciplines) {
    window.localStorage.setItem(DISCIPLINES_STORAGE_KEY, JSON.stringify(disciplines));
    queueFirebaseSync("appConfig");
  }

  function loadHiddenColumns() {
    try {
      const raw = window.localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(function (columnId) {
        return COLUMNS.some(function (column) {
          return column.id === columnId;
        });
      });
    } catch (error) {
      return [];
    }
  }

  function saveColumnVisibility(hiddenColumns) {
    window.localStorage.setItem(
      COLUMN_VISIBILITY_STORAGE_KEY,
      JSON.stringify(hiddenColumns),
    );
  }

  function loadActiveTab() {
    try {
      const hashTab = getTabFromHash();

      if (hashTab) {
        return hashTab;
      }

      const tabId = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);

      if (!AVAILABLE_TABS.includes(tabId)) {
        return "painel";
      }

      return tabId;
    } catch (error) {
      return "painel";
    }
  }

  function saveActiveTab(tabId) {
    window.localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, tabId);
  }

  function loadUsers() {
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY);

      if (!raw) {
        return SEED_USERS.slice();
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed) || !parsed.length) {
        return SEED_USERS.slice();
      }

      return parsed.map(normalizeUser);
    } catch (error) {
      return SEED_USERS.slice();
    }
  }

  function saveUsers(users) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    queueFirebaseSync("users");
  }

  function loadSessionUserId() {
    try {
      return window.localStorage.getItem(SESSION_STORAGE_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function saveSessionUserId(userId) {
    window.localStorage.setItem(SESSION_STORAGE_KEY, userId);
  }

  function loadSessionMeta() {
    try {
      var raw = window.localStorage.getItem(SESSION_META_STORAGE_KEY);

      if (!raw) {
        return null;
      }

      var parsed = JSON.parse(raw);
      var userId = parsed && parsed.userId ? String(parsed.userId) : "";
      var expiresAt = parsed && typeof parsed.expiresAt === "string" ? parsed.expiresAt : "";

      if (!userId || !expiresAt || Number.isNaN(new Date(expiresAt).getTime())) {
        return null;
      }

      return {
        userId: userId,
        expiresAt: expiresAt,
      };
    } catch (error) {
      return null;
    }
  }

  function saveSessionMeta(meta) {
    if (!meta || !meta.userId || !meta.expiresAt) {
      window.localStorage.removeItem(SESSION_META_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      SESSION_META_STORAGE_KEY,
      JSON.stringify({
        userId: String(meta.userId),
        expiresAt: meta.expiresAt,
      }),
    );
  }

  function clearSessionMeta() {
    saveSessionMeta(null);
  }

  function createSessionExpiryIso() {
    return new Date(Date.now() + SESSION_TIMEOUT_MS).toISOString();
  }

  function isSessionExpired(expiresAt) {
    return !expiresAt || new Date(expiresAt).getTime() <= Date.now();
  }

  function reconcileStoredSession() {
    var sessionMeta = loadSessionMeta();

    if (!sessionMeta) {
      return;
    }

    if (isSessionExpired(sessionMeta.expiresAt)) {
      saveSessionUserId("");
      if (!firebaseState.enabled) {
        clearSessionMeta();
      }
      return;
    }

    if (state.sessionUserId && sessionMeta.userId !== state.sessionUserId) {
      saveSessionUserId("");
    }
  }

  function loadPrivacyRequests() {
    try {
      const raw = window.localStorage.getItem(PRIVACY_REQUESTS_STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function savePrivacyRequests(requests) {
    window.localStorage.setItem(
      PRIVACY_REQUESTS_STORAGE_KEY,
      JSON.stringify(requests),
    );
  }

  function loadAuditLogs() {
    try {
      const raw = window.localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveAuditLogs(logs) {
    window.localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(logs));
  }

  function runWithoutFirebaseSync(work) {
    firebaseState.hydrating = true;

    try {
      return work();
    } finally {
      firebaseState.hydrating = false;
    }
  }

  function hasFirebaseCurrentUser() {
    return Boolean(firebaseState.enabled && firebaseApi.auth && firebaseApi.auth.currentUser);
  }

  function serializeUsersForFirebase(users) {
    return (Array.isArray(users) ? users : []).map(function (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active !== false,
        createdAt: user.createdAt,
        mustChangePassword: user.mustChangePassword === true,
        passwordUpdatedAt:
          typeof user.passwordUpdatedAt === "string" ? user.passwordUpdatedAt : "",
        permissions:
          user.role === "admin"
            ? Object.assign({}, ADMIN_PERMISSIONS)
            : normalizeUserPermissions(user.permissions),
      };
    });
  }

  function queueFirebaseSync(target) {
    if (!firebaseState.enabled || firebaseState.hydrating || !hasFirebaseCurrentUser()) {
      return;
    }

    if (firebaseState.syncTimers[target]) {
      window.clearTimeout(firebaseState.syncTimers[target]);
    }

    firebaseState.syncTimers[target] = window.setTimeout(function () {
      syncFirebaseTarget(target);
    }, 180);
  }

  async function syncFirebaseTarget(target) {
    delete firebaseState.syncTimers[target];

    try {
      switch (target) {
        case "cards":
          await firebaseApi.saveCards(state.cards);
          break;
        case "checkpointItems":
          await firebaseApi.saveCheckpointItems(state.checkpointItems);
          break;
        case "users":
          await firebaseApi.saveUsers(serializeUsersForFirebase(state.users));
          break;
        case "privacyRequests":
          await firebaseApi.savePrivacyRequests(state.privacyRequests);
          break;
        case "auditLogs":
          await firebaseApi.saveAuditLogs(state.auditLogs);
          break;
        case "appConfig":
          await firebaseApi.saveAppConfig({
            disciplines: state.disciplines.slice(),
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Firebase sync failed for", target, error);
      showToast("Nao foi possivel sincronizar " + target + " com o Firebase.", "error");
    }
  }

  async function setupFirebaseIntegration() {
    if (!firebaseState.enabled) {
      return;
    }

    try {
      await loadPublicDataFromFirebase();
    } catch (error) {
      console.error("Firebase public bootstrap failed", error);
      showToast("Falha ao ler dados publicos no Firebase. Ajuste as regras do Firestore.", "error");
    }

    firebaseState.authUnsubscribe = firebaseApi.onAuthStateChanged(function (authUser) {
      handleFirebaseAuthStateChanged(authUser).catch(function (error) {
        console.error("Firebase auth bootstrap failed", error);
        showToast("Falha ao carregar a sessao do Firebase.", "error");
      });
    });
  }

  async function loadPublicDataFromFirebase() {
    var publicData = await firebaseApi.loadPublicData();
    publicData = await maybeSeedPublicFirebaseData(publicData, {
      allowWrite: false,
    });
    applyPublicFirebaseData(publicData);
  }

  async function maybeSeedPublicFirebaseData(publicData, options) {
    var nextData = publicData || {};
    var allowWrite = Boolean(options && options.allowWrite);
    var seeded = false;
    var hasRemoteCards = Array.isArray(nextData.cards) && nextData.cards.length;
    var hasRemoteCheckpointItems =
      Array.isArray(nextData.checkpointItems) && nextData.checkpointItems.length;
    var hasRemoteDisciplines =
      nextData.appConfig &&
      Array.isArray(nextData.appConfig.disciplines) &&
      nextData.appConfig.disciplines.length;

    if (!allowWrite) {
      return {
        cards: hasRemoteCards ? nextData.cards : state.cards.slice(),
        checkpointItems: hasRemoteCheckpointItems
          ? nextData.checkpointItems
          : state.checkpointItems.slice(),
        appConfig: hasRemoteDisciplines
          ? nextData.appConfig
          : {
              disciplines: state.disciplines.slice(),
            },
      };
    }

    if (!hasRemoteCards && state.cards.length) {
      await firebaseApi.saveCards(state.cards);
      seeded = true;
    }

    if (!hasRemoteCheckpointItems && state.checkpointItems.length) {
      await firebaseApi.saveCheckpointItems(state.checkpointItems);
      seeded = true;
    }

    if (!hasRemoteDisciplines && state.disciplines.length) {
      await firebaseApi.saveAppConfig({
        disciplines: state.disciplines.slice(),
      });
      seeded = true;
    }

    if (!seeded) {
      return nextData;
    }

    return firebaseApi.loadPublicData();
  }

  function applyPublicFirebaseData(publicData) {
    runWithoutFirebaseSync(function () {
      state.cards = normalizeCards(Array.isArray(publicData.cards) ? publicData.cards : []);
      state.checkpointItems = normalizeCheckpointItems(
        Array.isArray(publicData.checkpointItems) ? publicData.checkpointItems : [],
      );

      if (
        publicData.appConfig &&
        Array.isArray(publicData.appConfig.disciplines) &&
        publicData.appConfig.disciplines.length
      ) {
        state.disciplines = publicData.appConfig.disciplines.slice();
      }

      saveCards(state.cards);
      saveCheckpointItems(state.checkpointItems);
      saveDisciplines(state.disciplines);
    });

    syncDisciplinesWithCards();
    render();
  }

  async function handleFirebaseAuthStateChanged(authUser) {
    if (!authUser) {
      clearSessionTimeoutTimer();
      state.passwordResetRequired = false;
      resetPasswordModalState();
      runWithoutFirebaseSync(function () {
        state.sessionUserId = "";
        state.users = [];
        state.privacyRequests = [];
        state.auditLogs = [];
        saveSessionUserId("");
        clearSessionMeta();
        savePrivacyRequests([]);
        saveAuditLogs([]);
      });

      render();
      return;
    }

    var ensuredProfile = normalizeUser(await firebaseApi.ensureUserProfile(authUser));
    var sessionMeta = getCurrentSessionMetaForUser(authUser.uid);

    if (sessionMeta && isSessionExpired(sessionMeta.expiresAt)) {
      clearSessionMeta();
      clearSessionTimeoutTimer();
      await firebaseApi.signOut();
      showToast("Sua sessao expirou apos 30 minutos. Faca login novamente.", "error");
      return;
    }

    if (firebaseState.pendingLoginAudit || !sessionMeta) {
      sessionMeta = applySessionMeta(authUser.uid);
    } else {
      scheduleSessionTimeout(sessionMeta.expiresAt);
    }

    if (!ensuredProfile.active) {
      await firebaseApi.signOut();
      showToast("Conta desativada.", "error");
      return;
    }

    if (canSeedFirebasePublicData(ensuredProfile)) {
      var refreshedPublicData = await maybeSeedPublicFirebaseData(
        await firebaseApi.loadPublicData(),
        {
          allowWrite: true,
        },
      );
      applyPublicFirebaseData(refreshedPublicData);
    }

    var canManageUsers =
      ensuredProfile.role === "admin" ||
      Boolean(ensuredProfile.permissions && ensuredProfile.permissions["users.manage"]);
    var canViewAudit =
      ensuredProfile.role === "admin" ||
      Boolean(ensuredProfile.permissions && ensuredProfile.permissions["audit.view"]);
    var governanceData = await firebaseApi.loadGovernanceData({
      includeUsers: canManageUsers,
      includePrivacyRequests: canManageUsers,
      includeAuditLogs: canViewAudit,
    });

    runWithoutFirebaseSync(function () {
      state.sessionUserId = authUser.uid;
      saveSessionUserId(authUser.uid);

      if (Array.isArray(governanceData.users) && governanceData.users.length) {
        state.users = governanceData.users.map(normalizeUser);
      } else {
        state.users = [ensuredProfile];
      }

      if (
        !state.users.some(function (user) {
          return user.id === ensuredProfile.id;
        })
      ) {
        state.users.unshift(ensuredProfile);
      }

      state.privacyRequests = Array.isArray(governanceData.privacyRequests)
        ? governanceData.privacyRequests
        : [];
      state.auditLogs = Array.isArray(governanceData.auditLogs)
        ? governanceData.auditLogs.slice(0, 120)
        : [];

      saveUsers(state.users);
      savePrivacyRequests(state.privacyRequests);
      saveAuditLogs(state.auditLogs);
    });

    ensureCurrentUserIsValid();

    if (firebaseState.pendingLoginAudit) {
      firebaseState.pendingLoginAudit = false;
      recordAudit("auth.login", ensuredProfile.name + " entrou na area interna.");
    }

    render();
    maybeRequirePasswordReset(getCurrentUser());
  }

  function canSeedFirebasePublicData(user) {
    if (!user) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    }

    return Boolean(
      (user.permissions && user.permissions["cards.create"]) ||
        (user.permissions && user.permissions["checkpoint.create"]) ||
        (user.permissions && user.permissions["disciplines.create"]),
    );
  }

  function mapFirebaseAuthError(error) {
    var code = error && error.code ? error.code : "";

    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Credenciais invalidas.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";
      case "auth/network-request-failed":
        return "Falha de rede ao falar com o Firebase.";
      case "auth/unauthorized-domain":
        return "Este dominio ainda nao foi autorizado no Firebase Auth.";
      default:
        return "Nao foi possivel fazer check-in agora.";
    }
  }

  function mapFirebasePasswordResetError(error) {
    var code = error && error.code ? error.code : "";

    switch (code) {
      case "auth/invalid-email":
        return "Informe um e-mail valido.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Tente novamente mais tarde.";
      case "auth/network-request-failed":
        return "Falha de rede ao falar com o Firebase.";
      case "auth/unauthorized-domain":
        return "Este dominio ainda nao foi autorizado no Firebase Auth.";
      case "auth/user-not-found":
        return "Se existir uma conta para este e-mail, o link de redefinicao sera enviado em instantes.";
      default:
        return "Nao foi possivel iniciar a redefinicao de senha agora.";
    }
  }

  function mapFirebasePasswordChangeError(error) {
    var code = error && error.code ? error.code : "";

    switch (code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "A senha atual nao confere.";
      case "auth/weak-password":
        return "A nova senha precisa ter pelo menos 6 caracteres.";
      case "auth/requires-recent-login":
        return "Seu check-in expirou para esta operacao. Faca login novamente e tente de novo.";
      case "auth/too-many-requests":
        return "Muitas tentativas. Aguarde um pouco antes de tentar novamente.";
      case "auth/network-request-failed":
        return "Falha de rede ao falar com o Firebase.";
      default:
        return "Nao foi possivel atualizar sua senha agora.";
    }
  }

  function mapFirebaseUserProvisioningError(error) {
    var code = error && error.code ? error.code : "";

    switch (code) {
      case "auth/email-already-in-use":
        return "Ja existe um usuario com esse e-mail no Firebase.";
      case "auth/invalid-email":
        return "O e-mail informado nao e valido.";
      case "auth/weak-password":
        return "A senha provisoria precisa ser mais forte.";
      case "auth/operation-not-allowed":
        return "Email/senha ainda nao foi liberado no Firebase Auth.";
      default:
        return "Nao foi possivel criar o usuario no Firebase.";
    }
  }

  function getTabFromHash() {
    const hash = window.location.hash.replace("#", "").trim();

    if (!AVAILABLE_TABS.includes(hash)) {
      return "";
    }

    return hash;
  }

  function scrollToActiveTab() {
    const activePanel = document.getElementById(state.activeTab);

    if (!activePanel) {
      return;
    }

    activePanel.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function normalizeCards(cards) {
    const source = Array.isArray(cards) ? cards : SEED_CARDS.slice();

    return source.map(normalizeCard);
  }

  function normalizeCard(card) {
    const normalized = {
      id: card && card.id ? String(card.id) : createCardId(),
      title: card && typeof card.title === "string" ? card.title : "Novo cartão",
      description: card && typeof card.description === "string" ? card.description : "",
      dueDate: normalizeIsoDate(card && card.dueDate),
      discipline: card && typeof card.discipline === "string" ? card.discipline : "Arquitetura",
      columnId: card && typeof card.columnId === "string" ? card.columnId : "backlog",
      blockedBy: card && typeof card.blockedBy === "string" ? card.blockedBy : "",
      waitingReason: card && typeof card.waitingReason === "string" ? card.waitingReason : "",
    };

    if (normalized.columnId !== "blocked") {
      normalized.blockedBy = "";
      normalized.waitingReason = "";
    }

    return normalized;
  }

  function normalizeCardPublicSnapshot(snapshot, card) {
    const sourceCard = card || {};

    return {
      title: typeof snapshot.title === "string" ? snapshot.title : sanitizePublicText(sourceCard.title),
      description:
        typeof snapshot.description === "string"
          ? snapshot.description
          : sanitizePublicText(sourceCard.description),
      dueDate: normalizeIsoDate(snapshot.dueDate || sourceCard.dueDate),
      discipline:
        typeof snapshot.discipline === "string" && snapshot.discipline
          ? snapshot.discipline
          : sourceCard.discipline || "Arquitetura",
      columnId:
        typeof snapshot.columnId === "string" && snapshot.columnId
          ? snapshot.columnId
          : sourceCard.columnId || "backlog",
    };
  }

  function normalizeCheckpointItems(items) {
    const source = Array.isArray(items) ? items : getDefaultCheckpointItems();
    const normalized = source
      .filter(function (item) {
        return item && typeof item === "object";
      })
      .map(normalizeCheckpointItem);

    return normalized.length ? normalized : getDefaultCheckpointItems().map(normalizeCheckpointItem);
  }

  function normalizeCheckpointItem(item, index) {
    const safeIndex = typeof index === "number" ? index : 0;
    const topicsSource = Array.isArray(item.topics) ? item.topics : [item];
    const createdAt = normalizeIsoDate(
      item.createdAt || parseLegacyCheckpointDate(item.dateLabel) || getTodayString(),
    );
    const approvalStatus = normalizeCheckpointApprovalStatus(
      item.approvalStatus,
      item.archived ? "blocked" : "validated",
    );
    const topics = topicsSource
      .filter(function (topic) {
        return topic && typeof topic === "object";
      })
      .map(function (topic, topicIndex) {
        return createCheckpointTopic({
          id:
            topic.id ||
            "checkpoint-topic-" + String(safeIndex + 1) + "-" + String(topicIndex + 1),
          text: typeof topic.text === "string" ? topic.text : "",
          date: normalizeIsoDate(
            topic.date || parseLegacyCheckpointDate(topic.dateLabel) || createdAt,
          ),
          canDelete: topic.canDelete !== false,
          linkedCardId: typeof topic.linkedCardId === "string" ? topic.linkedCardId : "",
          createdBy:
            typeof topic.createdBy === "string" ? topic.createdBy : typeof item.createdBy === "string" ? item.createdBy : "",
          createdByName:
            typeof topic.createdByName === "string"
              ? topic.createdByName
              : typeof item.createdByName === "string"
                ? item.createdByName
                : "",
          approvalStatus: normalizeCheckpointApprovalStatus(topic.approvalStatus, approvalStatus),
          validatedAt: normalizeOptionalIsoDate(topic.validatedAt),
          validatedBy: typeof topic.validatedBy === "string" ? topic.validatedBy : "",
          blockedAt: normalizeOptionalIsoDate(topic.blockedAt),
          blockedBy: typeof topic.blockedBy === "string" ? topic.blockedBy : "",
        });
      });

    const normalized = {
      id: item.id ? String(item.id) : "checkpoint-" + Date.now(),
      archived: Boolean(item.archived),
      createdAt: createdAt,
      createdBy: typeof item.createdBy === "string" ? item.createdBy : "",
      createdByName: typeof item.createdByName === "string" ? item.createdByName : "",
      approvalStatus: approvalStatus,
      validatedAt: normalizeOptionalIsoDate(item.validatedAt),
      validatedBy: typeof item.validatedBy === "string" ? item.validatedBy : "",
      blockedAt: normalizeOptionalIsoDate(item.blockedAt),
      blockedBy: typeof item.blockedBy === "string" ? item.blockedBy : "",
      title:
        typeof item.title === "string" && item.title.trim()
          ? item.title.trim()
          : createDefaultCheckpointTitle(safeIndex + 1),
      topics: topics.length
        ? topics
        : [
            createCheckpointTopic({
              id: "checkpoint-topic-" + Date.now(),
              text: typeof item.text === "string" ? item.text : "",
              date: createdAt,
              canDelete: item.canDelete !== false,
              createdBy: typeof item.createdBy === "string" ? item.createdBy : "",
              createdByName: typeof item.createdByName === "string" ? item.createdByName : "",
              approvalStatus: approvalStatus,
              validatedAt: normalizeOptionalIsoDate(item.validatedAt),
              validatedBy: typeof item.validatedBy === "string" ? item.validatedBy : "",
              blockedAt: normalizeOptionalIsoDate(item.blockedAt),
              blockedBy: typeof item.blockedBy === "string" ? item.blockedBy : "",
            }),
          ],
      publicationStatus: normalizeCheckpointPublicationStatus(item.publicationStatus),
      publicSnapshot: item.publicSnapshot ? normalizeCheckpointPublicSnapshot(item.publicSnapshot, item) : null,
    };

    return normalized;
  }

  function normalizeCheckpointPublicSnapshot(snapshot, item) {
    const title = typeof snapshot.title === "string" ? snapshot.title : sanitizePublicText(item.title);
    const topics = Array.isArray(snapshot.topics)
      ? snapshot.topics.map(function (topic, topicIndex) {
          return {
            id: topic.id || "public-topic-" + topicIndex,
            date: normalizeIsoDate(topic.date || getTodayString()),
            text:
              typeof topic.text === "string"
                ? topic.text
                : sanitizePublicText(item.topics[topicIndex] ? item.topics[topicIndex].text : ""),
          };
        })
      : buildCheckpointPublicSnapshot(item).topics;

    return {
      title: title,
      topics: topics,
    };
  }

  function normalizeOpenAiConfig(config) {
    const safeConfig = config && typeof config === "object" ? config : {};

    return {
      apiKey: typeof safeConfig.apiKey === "string" ? safeConfig.apiKey.trim() : "",
      model:
        typeof safeConfig.model === "string" && safeConfig.model.trim()
          ? safeConfig.model.trim()
          : DEFAULT_OPENAI_MODEL,
      endpoint:
        typeof safeConfig.endpoint === "string" && safeConfig.endpoint.trim()
          ? safeConfig.endpoint.trim()
          : DEFAULT_OPENAI_ENDPOINT,
    };
  }

  function normalizeUser(user) {
    return {
      id: user.id ? String(user.id) : "user-" + Date.now(),
      name: typeof user.name === "string" ? user.name : "Usuário",
      email: typeof user.email === "string" ? user.email.toLowerCase() : "",
      password: typeof user.password === "string" ? user.password : "",
      role: ROLE_LABELS[user.role] ? user.role : "user",
      active: user.active !== false,
      createdAt: typeof user.createdAt === "string" ? user.createdAt : new Date().toISOString(),
      mustChangePassword: user.mustChangePassword === true,
      passwordUpdatedAt:
        typeof user.passwordUpdatedAt === "string" ? user.passwordUpdatedAt : "",
      permissions:
        user.role === "admin"
          ? Object.assign({}, ADMIN_PERMISSIONS)
          : normalizeUserPermissions(user.permissions),
    };
  }

  function normalizeUserPermissions(permissions) {
    const safePermissions = permissions && typeof permissions === "object" ? permissions : {};

    return Object.assign({}, DEFAULT_USER_PERMISSIONS, safePermissions);
  }

  function getDefaultCheckpointItems() {
    const today = getTodayString();

    return [
      {
        id: "checkpoint-001",
        archived: false,
        createdAt: today,
        title: "Pendências críticas da semana",
        publicationStatus: "published",
        publicSnapshot: {
          title: "Pendências críticas da semana",
          topics: [
            {
              id: "checkpoint-topic-001",
              text: "Confirmar pendências críticas que ainda bloqueiam as liberações da semana.",
              date: today,
            },
          ],
        },
        topics: [
          createCheckpointTopic({
            id: "checkpoint-topic-001",
            text: "Confirmar as pendências críticas que ainda bloqueiam as liberações da semana.",
            date: today,
            canDelete: true,
          }),
          createCheckpointTopic({
            id: "checkpoint-topic-002",
            text: "Definir quem consolida os retornos de compatibilização antes do próximo ciclo.",
            date: today,
            canDelete: true,
          }),
        ],
      },
      {
        id: "checkpoint-002",
        archived: false,
        createdAt: today,
        title: "Bloqueios e responsáveis",
        publicationStatus: "review",
        publicSnapshot: {
          title: "Bloqueios e responsáveis",
          topics: [
            {
              id: "checkpoint-topic-003",
              text: "Registrar bloqueios externos que impedem a liberação desta etapa.",
              date: today,
            },
          ],
        },
        topics: [
          createCheckpointTopic({
            id: "checkpoint-topic-003",
            text: "Registrar os bloqueios externos que impedem a liberação desta etapa.",
            date: today,
            canDelete: true,
          }),
        ],
      },
      {
        id: "checkpoint-003",
        archived: true,
        createdAt: today,
        title: "Assunto encerrado no checkpoint anterior",
        publicationStatus: "published",
        publicSnapshot: {
          title: "Assunto encerrado no checkpoint anterior",
          topics: [
            {
              id: "checkpoint-topic-004",
              text: "Revisão do pacote do pavimento tipo encerrada no checkpoint anterior.",
              date: today,
            },
          ],
        },
        topics: [
          createCheckpointTopic({
            id: "checkpoint-topic-004",
            text: "Revisão do pacote do pavimento tipo encerrada no checkpoint anterior.",
            date: today,
            canDelete: true,
          }),
        ],
      },
    ];
  }

  function createDefaultCheckpointTitle(index) {
    return "Assunto " + String(index).padStart(2, "0");
  }

  function createCheckpointTopic(overrides) {
    const config = overrides || {};

    return {
      id: config.id ? String(config.id) : createCheckpointTopicId(),
      text: typeof config.text === "string" ? config.text : "",
      date: normalizeIsoDate(config.date),
      canDelete: config.canDelete !== false,
      linkedCardId: typeof config.linkedCardId === "string" ? config.linkedCardId : "",
      createdBy: typeof config.createdBy === "string" ? config.createdBy : "",
      createdByName: typeof config.createdByName === "string" ? config.createdByName : "",
      approvalStatus: normalizeCheckpointApprovalStatus(config.approvalStatus, "pending"),
      validatedAt: normalizeOptionalIsoDate(config.validatedAt),
      validatedBy: typeof config.validatedBy === "string" ? config.validatedBy : "",
      blockedAt: normalizeOptionalIsoDate(config.blockedAt),
      blockedBy: typeof config.blockedBy === "string" ? config.blockedBy : "",
    };
  }

  function normalizeOptionalIsoDate(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    return "";
  }

  function normalizeCheckpointApprovalStatus(status, fallback) {
    if (status === "validated" || status === "blocked" || status === "pending") {
      return status;
    }

    return fallback || "pending";
  }

  function normalizeCheckpointPublicationStatus(status) {
    if (status === "review" || status === "published") {
      return status;
    }

    return "internal";
  }

  function normalizeIsoDate(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    return getTodayString();
  }

  function parseLegacyCheckpointDate(value) {
    if (typeof value !== "string") {
      return "";
    }

    const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (!match) {
      return "";
    }

    return match[3] + "-" + match[2] + "-" + match[1];
  }

  function createCardId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "card-" + Date.now();
  }

  function createCheckpointItemId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "checkpoint-" + window.crypto.randomUUID();
    }

    return "checkpoint-" + Date.now();
  }

  function createCheckpointTopicId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "checkpoint-topic-" + window.crypto.randomUUID();
    }

    return "checkpoint-topic-" + Date.now();
  }

  function getTodayString() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
  }

  function getDaysUntil(dateString) {
    const today = new Date(getTodayString() + "T00:00:00");
    const target = new Date(normalizeIsoDate(dateString) + "T00:00:00");
    return Math.round((target - today) / 86400000);
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(dateString + "T12:00:00"));
  }

  function formatFullDate(dateString) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(normalizeIsoDate(dateString) + "T12:00:00"));
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function getCheckpointTopicKey(itemId, topicId) {
    return itemId + "::" + topicId;
  }

  function extractHostLabel(endpoint) {
    try {
      return new URL(endpoint).host;
    } catch (error) {
      return "endpoint customizado";
    }
  }

  async function parseJsonSafely(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function extractOpenAiStructuredPayload(payload) {
    if (payload && payload.output_parsed && typeof payload.output_parsed === "object") {
      return payload.output_parsed;
    }

    const outputText = extractOpenAiOutputText(payload);

    if (!outputText) {
      return null;
    }

    try {
      return JSON.parse(outputText);
    } catch (error) {
      return null;
    }
  }

  function extractOpenAiOutputText(payload) {
    if (payload && typeof payload.output_text === "string" && payload.output_text.trim()) {
      return payload.output_text;
    }

    if (!payload || !Array.isArray(payload.output)) {
      return "";
    }

    for (let outputIndex = 0; outputIndex < payload.output.length; outputIndex += 1) {
      const outputItem = payload.output[outputIndex];

      if (!outputItem || !Array.isArray(outputItem.content)) {
        continue;
      }

      for (let contentIndex = 0; contentIndex < outputItem.content.length; contentIndex += 1) {
        const contentItem = outputItem.content[contentIndex];

        if (contentItem && typeof contentItem.text === "string" && contentItem.text.trim()) {
          return contentItem.text;
        }
      }
    }

    return "";
  }

  function extractOpenAiErrorMessage(payload, statusCode) {
    if (payload && payload.error && typeof payload.error.message === "string") {
      return "Falha ao gerar card com IA: " + payload.error.message;
    }

    return "Falha ao gerar card com IA. Status " + statusCode + ".";
  }

  async function requestCheckpointCardSuggestion(topic) {
    const response = await fetch(state.checkpointOpenAiConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + state.checkpointOpenAiConfig.apiKey,
      },
      body: JSON.stringify({
        model: state.checkpointOpenAiConfig.model,
        store: false,
        reasoning: {
          effort: "minimal",
        },
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text:
                  "Transforme pontos de assunto em cards acionáveis para um quadro kanban de projetos. Responda somente com JSON válido no schema informado.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Ponto: " +
                  topic.text +
                  "\nData do ponto: " +
                  topic.date +
                  "\nDisciplinas disponíveis: " +
                  state.disciplines.join(", ") +
                  "\nGere um título curto, uma descrição objetiva e escolha uma disciplina da lista quando possível.",
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "checkpoint_card",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["title", "description", "discipline"],
              properties: {
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                discipline: {
                  type: "string",
                },
              },
            },
          },
        },
      }),
    });

    const payload = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(extractOpenAiErrorMessage(payload, response.status));
    }

    const parsed = extractOpenAiStructuredPayload(payload);

    if (!parsed) {
      throw new Error("A IA não devolveu um payload válido para criar o card.");
    }

    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      description: typeof parsed.description === "string" ? parsed.description : "",
      discipline: typeof parsed.discipline === "string" ? parsed.discipline : "",
    };
  }

  function resolveCheckpointDiscipline(discipline) {
    const normalizedDiscipline = String(discipline || "").trim().toLowerCase();
    const matchedDiscipline = state.disciplines.find(function (item) {
      return item.toLowerCase() === normalizedDiscipline;
    });

    return matchedDiscipline || state.disciplines[0] || "Arquitetura";
  }

  function createFallbackCardTitle(text) {
    const collapsedText = String(text || "").replace(/\s+/g, " ").trim();

    if (!collapsedText) {
      return "Novo card de ponto";
    }

    return collapsedText.slice(0, 72);
  }

  function resolveColumnTitle(columnId) {
    const column = COLUMNS.find(function (item) {
      return item.id === columnId;
    });

    return column ? column.title : "Etapa";
  }

  function findCardIndex(cardId) {
    return state.cards.findIndex(function (card) {
      return card.id === cardId;
    });
  }

  function clearDropHighlights() {
    document.querySelectorAll(".column-body.drag-over").forEach(function (zone) {
      zone.classList.remove("drag-over");
    });
    document.querySelectorAll(".column.is-drag-target").forEach(function (col) {
      col.classList.remove("is-drag-target");
    });
  }

  function getDisciplineTheme(discipline) {
    if (discipline === "Todas") {
      return {
        color: "#cbd5e1",
        background: "rgba(255,255,255,0.08)",
        pillBg: "rgba(255,255,255,0.08)",
        pillText: "#ffffff",
      };
    }

    if (DISCIPLINE_COLORS[discipline]) {
      return DISCIPLINE_COLORS[discipline];
    }

    const hue = hashString(discipline) % 360;
    return {
      color: "hsl(" + hue + " 70% 48%)",
      background: "hsl(" + hue + " 90% 96%)",
      pillBg: "hsl(" + hue + " 85% 92%)",
      pillText: "hsl(" + hue + " 80% 24%)",
    };
  }

  function hashString(value) {
    return String(value || "").split("").reduce(function (accumulator, character) {
      return accumulator + character.charCodeAt(0);
    }, 0);
  }

  function createInlineStyle(styleObject) {
    return Object.keys(styleObject)
      .map(function (key) {
        return key + ":" + styleObject[key];
      })
      .join(";");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var _focusTrapHandler = null;
  var _focusTrapTrigger = null;
  var FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function activateFocusTrap(containerEl) {
    _focusTrapTrigger = document.activeElement;

    if (_focusTrapHandler) {
      document.removeEventListener("keydown", _focusTrapHandler);
    }

    _focusTrapHandler = function (event) {
      if (event.key !== "Tab") return;
      var focusable = Array.from(containerEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(function (el) {
        return el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first || !containerEl.contains(document.activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !containerEl.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", _focusTrapHandler);
  }

  function deactivateFocusTrap() {
    if (_focusTrapHandler) {
      document.removeEventListener("keydown", _focusTrapHandler);
      _focusTrapHandler = null;
    }
    if (_focusTrapTrigger && typeof _focusTrapTrigger.focus === "function") {
      try { _focusTrapTrigger.focus(); } catch (e) {}
    }
    _focusTrapTrigger = null;
  }

  function getAvatarColor(name) {
    var sum = String(name || "").split("").reduce(function (acc, c) {
      return acc + c.charCodeAt(0);
    }, 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }

  function makeAvatar(name) {
    var words = String(name || "?").trim().split(/\s+/);
    var initials = words
      .slice(0, 2)
      .map(function (w) { return w[0] ? w[0].toUpperCase() : ""; })
      .join("");
    return (
      '<div class="user-avatar" style="background:' +
      getAvatarColor(name) +
      '" aria-hidden="true">' +
      escapeHtml(initials || "?") +
      "</div>"
    );
  }

  window.showToast = showToast;

  function showToast(message, type) {
    var container = document.getElementById("toast-container");
    if (!container) return;
    var iconMap = {
      success: '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
      error:   '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>',
      warning: '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10.29 3.86-8.57 14.85A1 1 0 0 0 2.59 20h17.82a1 1 0 0 0 .87-1.5L12.71 3.86a1 1 0 0 0-1.73 0z"/><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>',
      info:    '<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
    };
    var toast = document.createElement("div");
    toast.className = "toast toast-" + (type || "info");
    var icon = iconMap[type] || iconMap.info;
    toast.innerHTML = icon + '<span>' + escapeHtml(message) + '</span>';
    container.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add("toast-visible");
      });
    });
    setTimeout(function () {
      toast.classList.remove("toast-visible");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

  function showConfirm(message) {
    return new Promise(function (resolve) {
      elements.confirmModalMessage.textContent = message;
      elements.confirmModalBackdrop.classList.remove("hidden");
      elements.confirmModalOk.focus();
      activateFocusTrap(elements.confirmModalBackdrop);

      function cleanup() {
        deactivateFocusTrap();
        elements.confirmModalBackdrop.classList.add("hidden");
        elements.confirmModalOk.removeEventListener("click", onOk);
        elements.confirmModalCancel.removeEventListener("click", onCancel);
      }

      function onOk() { cleanup(); resolve(true); }
      function onCancel() { cleanup(); resolve(false); }

      elements.confirmModalOk.addEventListener("click", onOk);
      elements.confirmModalCancel.addEventListener("click", onCancel);
    });
  }
})();
