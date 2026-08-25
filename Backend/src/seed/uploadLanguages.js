require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../config/quotescreator-ebcb6-firebase-adminsdk-fbsvc-3e2c40bc65.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const languagesData = require("./languages.json");

const uploadLanguages = async () => {
  try {
    const languages = languagesData.languages;

    const batch = db.batch();

    Object.entries(languages).forEach(([documentId, data]) => {
      const ref = db.collection("languages").doc(documentId);

      batch.set(ref, data, { merge: true });
    });

    await batch.commit();

    console.log("\n================================");
    console.log("✅ Languages uploaded!");
    console.log("================================\n");

    Object.entries(languages).forEach(([id, data]) => {
      console.log(`✓ ${id} → ${data.name}`);
    });

    console.log(`\nTotal: ${Object.keys(languages).length} languages`);
  } catch (error) {
    console.error("\n❌ Upload failed:");
    console.error(error);
  }
};

uploadLanguages();
