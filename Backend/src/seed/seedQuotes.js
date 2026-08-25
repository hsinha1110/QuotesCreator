require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../config/quotescreator-ce9a1-firebase-adminsdk-fbsvc-b31d75fb2b.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const categoriesData = require("./quotes_categories.json");

const uploadCategories = async () => {
  try {
    const categories = categoriesData.categories;

    const batch = db.batch();

    Object.entries(categories).forEach(([documentId, data]) => {
      const ref = db.collection("categories").doc(documentId);

      batch.set(ref, data, { merge: true });
    });

    await batch.commit();

    console.log("\n================================");
    console.log("✅ Categories uploaded successfully!");
    console.log("================================\n");

    Object.entries(categories).forEach(([id, data]) => {
      console.log(`✓ ${id} → ${data.name}`);
    });

    console.log(`\nTotal: ${Object.keys(categories).length} categories`);
  } catch (error) {
    console.error("\n❌ Upload failed:");
    console.error(error);
  }
};

uploadCategories();
