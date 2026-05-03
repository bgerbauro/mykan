(function (window) {
  var firebaseConfig = {
    apiKey: "AIzaSyBd9IulJQoaftkl24MsRI6u-aJI5OpfcXQ",
    authDomain: "mykan-web.firebaseapp.com",
    projectId: "mykan-web",
    storageBucket: "mykan-web.firebasestorage.app",
    messagingSenderId: "480841661712",
    appId: "1:480841661712:web:cbdd26aadee0d5c1acf995",
    measurementId: "G-CFCKDS7JSE",
  };

  function createDisabledApi(reason) {
    function reject() {
      return Promise.reject(new Error(reason));
    }

    return {
      enabled: false,
      reason: reason,
      config: firebaseConfig,
      ready: Promise.resolve(null),
      signIn: reject,
      signOut: reject,
      sendPasswordResetEmail: reject,
      onAuthStateChanged: function () {
        return function () {};
      },
      loadPublicData: reject,
      loadGovernanceData: reject,
      saveCards: reject,
      saveCheckpointItems: reject,
      saveUsers: reject,
      savePrivacyRequests: reject,
      savePrivacyRequestEntry: reject,
      saveAuditLogs: reject,
      saveAuditLogEntry: reject,
      saveAppConfig: reject,
      saveUserProfile: reject,
      changeOwnPassword: reject,
      ensureUserProfile: reject,
      createManagedUser: reject,
    };
  }

  if (!window.firebase) {
    window.mykanFirebaseApi = createDisabledApi("Firebase SDK não carregado.");
    return;
  }

  var firebase = window.firebase;
  var app = firebase.apps && firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth(app);
  var db = firebase.firestore(app);
  var secondaryAppCounter = 0;

  function toSerializableDocument(snapshot) {
    var data = snapshot.data() || {};
    return Object.assign({ id: snapshot.id }, data);
  }

  function sortByPosition(items, newestFirst) {
    return items.slice().sort(function (left, right) {
      var leftPosition = typeof left.position === "number" ? left.position : Number.MAX_SAFE_INTEGER;
      var rightPosition = typeof right.position === "number" ? right.position : Number.MAX_SAFE_INTEGER;

      if (leftPosition !== rightPosition) {
        return leftPosition - rightPosition;
      }

      var leftCreatedAt = typeof left.createdAt === "string" ? left.createdAt : "";
      var rightCreatedAt = typeof right.createdAt === "string" ? right.createdAt : "";

      if (leftCreatedAt === rightCreatedAt) {
        return 0;
      }

      if (newestFirst) {
        return leftCreatedAt < rightCreatedAt ? 1 : -1;
      }

      return leftCreatedAt > rightCreatedAt ? 1 : -1;
    });
  }

  async function loadCollection(collectionName, options) {
    var snapshot = await db.collection(collectionName).get();
    var items = snapshot.docs.map(toSerializableDocument);
    var newestFirst = Boolean(options && options.newestFirst);
    return sortByPosition(items, newestFirst);
  }

  async function replaceCollection(collectionName, items) {
    var collectionRef = db.collection(collectionName);
    var currentSnapshot = await collectionRef.get();
    var batch = db.batch();
    var nextIds = {};

    (Array.isArray(items) ? items : []).forEach(function (item, index) {
      if (!item || typeof item !== "object") {
        return;
      }

      var source = Object.assign({}, item);
      var documentId = source.id ? String(source.id) : collectionRef.doc().id;
      nextIds[documentId] = true;
      source.id = documentId;
      source.position = index;
      source.updatedAt = new Date().toISOString();
      batch.set(collectionRef.doc(documentId), source, { merge: true });
    });

    currentSnapshot.forEach(function (documentSnapshot) {
      if (!nextIds[documentSnapshot.id]) {
        batch.delete(documentSnapshot.ref);
      }
    });

    await batch.commit();
  }

  async function saveAppConfig(payload) {
    await db
      .collection("appConfig")
      .doc("main")
      .set(
        Object.assign({}, payload || {}, {
          updatedAt: new Date().toISOString(),
        }),
        { merge: true },
      );
  }

  async function saveDocument(collectionName, item) {
    var collectionRef = db.collection(collectionName);
    var source = Object.assign({}, item || {});
    var documentId = source.id ? String(source.id) : collectionRef.doc().id;

    source.id = documentId;
    source.updatedAt = new Date().toISOString();

    await collectionRef.doc(documentId).set(source, { merge: true });

    return source;
  }

  async function saveUserProfile(userId, payload) {
    await db
      .collection("users")
      .doc(String(userId))
      .set(
        Object.assign({}, payload || {}, {
          updatedAt: new Date().toISOString(),
        }),
        { merge: true },
      );
  }

  async function loadAppConfig() {
    var snapshot = await db.collection("appConfig").doc("main").get();
    return snapshot.exists ? snapshot.data() || {} : {};
  }

  function getSecondaryApp() {
    secondaryAppCounter += 1;
    return firebase.initializeApp(firebaseConfig, "mykan-secondary-" + String(secondaryAppCounter));
  }

  async function cleanupSecondaryApp(secondaryApp, secondaryAuth) {
    if (!secondaryApp) {
      return;
    }

    try {
      if (secondaryAuth) {
        await secondaryAuth.signOut();
      }
    } catch (error) {
      // noop
    }

    try {
      await secondaryApp.delete();
    } catch (error) {
      // noop
    }
  }

  async function ensureUserProfile(authUser) {
    var userRef = db.collection("users").doc(authUser.uid);
    var snapshot = await userRef.get();

    if (snapshot.exists) {
      return toSerializableDocument(snapshot);
    }

    var bootstrapRef = db.collection("system").doc("bootstrap");
    var bootstrapSnapshot = await bootstrapRef.get();
    var isFirstUser = !bootstrapSnapshot.exists;
    var profile = {
      name:
        typeof authUser.displayName === "string" && authUser.displayName.trim()
          ? authUser.displayName.trim()
          : String(authUser.email || "Usuário").split("@")[0],
      email: String(authUser.email || "").toLowerCase(),
      role: isFirstUser ? "admin" : "user",
      active: true,
      createdAt: new Date().toISOString(),
      mustChangePassword: false,
      passwordUpdatedAt: new Date().toISOString(),
      permissions: {},
    };
    var batch = db.batch();

    batch.set(userRef, profile, { merge: true });

    if (isFirstUser) {
      batch.set(
        bootstrapRef,
        {
          ownerUid: authUser.uid,
          initializedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    await batch.commit();

    return Object.assign({ id: authUser.uid }, profile);
  }

  async function createManagedUser(userInput) {
    var secondaryApp = null;
    var secondaryAuth = null;

    try {
      secondaryApp = getSecondaryApp();
      secondaryAuth = secondaryApp.auth();

      var credential = await secondaryAuth.createUserWithEmailAndPassword(
        userInput.email,
        userInput.password,
      );
      var userRecord = {
        name: userInput.name,
        email: String(userInput.email || "").toLowerCase(),
        role: userInput.role || "user",
        active: userInput.active !== false,
        createdAt: userInput.createdAt || new Date().toISOString(),
        mustChangePassword: userInput.mustChangePassword === true,
        passwordUpdatedAt:
          typeof userInput.passwordUpdatedAt === "string" ? userInput.passwordUpdatedAt : "",
        permissions: userInput.permissions || {},
      };

      await db.collection("users").doc(credential.user.uid).set(userRecord, { merge: true });

      return Object.assign({ id: credential.user.uid }, userRecord);
    } finally {
      await cleanupSecondaryApp(secondaryApp, secondaryAuth);
    }
  }

  async function loadGovernanceData(options) {
    var source = options || {};
    var response = {};

    if (source.includeUsers) {
      response.users = await loadCollection("users");
    }

    if (source.includePrivacyRequests) {
      response.privacyRequests = await loadCollection("privacyRequests", { newestFirst: true });
    }

    if (source.includeAuditLogs) {
      response.auditLogs = await loadCollection("auditLogs", { newestFirst: true });
    }

    return response;
  }

  async function loadPublicData() {
    var results = await Promise.all([
      loadCollection("cards"),
      loadCollection("checkpointItems"),
      loadAppConfig(),
    ]);

    return {
      cards: results[0],
      checkpointItems: results[1],
      appConfig: results[2],
    };
  }

  async function changeOwnPassword(email, currentPassword, nextPassword) {
    if (!auth.currentUser) {
      throw new Error("Nenhum usuario autenticado.");
    }

    var credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
    await auth.currentUser.reauthenticateWithCredential(credential);
    await auth.currentUser.updatePassword(nextPassword);
  }

  window.mykanFirebaseApi = {
    enabled: true,
    config: firebaseConfig,
    app: app,
    auth: auth,
    db: db,
    ready: Promise.resolve(true),
    signIn: function (email, password) {
      return auth.signInWithEmailAndPassword(email, password);
    },
    signOut: function () {
      return auth.signOut();
    },
    sendPasswordResetEmail: function (email) {
      return auth.sendPasswordResetEmail(email);
    },
    onAuthStateChanged: function (callback) {
      return auth.onAuthStateChanged(callback);
    },
    loadPublicData: loadPublicData,
    loadGovernanceData: loadGovernanceData,
    saveCards: function (cards) {
      return replaceCollection("cards", cards);
    },
    saveCheckpointItems: function (items) {
      return replaceCollection("checkpointItems", items);
    },
    saveUsers: function (users) {
      return replaceCollection("users", users);
    },
    savePrivacyRequests: function (requests) {
      return replaceCollection("privacyRequests", requests);
    },
    savePrivacyRequestEntry: function (requestEntry) {
      return saveDocument("privacyRequests", requestEntry);
    },
    saveAuditLogs: function (logs) {
      return replaceCollection("auditLogs", logs);
    },
    saveAuditLogEntry: function (logEntry) {
      return saveDocument("auditLogs", logEntry);
    },
    saveAppConfig: saveAppConfig,
    saveUserProfile: saveUserProfile,
    changeOwnPassword: changeOwnPassword,
    ensureUserProfile: ensureUserProfile,
    createManagedUser: createManagedUser,
  };
})(window);
