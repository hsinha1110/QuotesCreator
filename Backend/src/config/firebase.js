const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./quotescreator-ebcb6-firebase-adminsdk-fbsvc-e71c9fa2f0.json");

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

const messaging = getMessaging(app);

module.exports = {
  app,
  messaging,
};
