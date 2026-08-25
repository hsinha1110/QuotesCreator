require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../config/quotescreator-ebcb6-firebase-adminsdk-fbsvc-3e2c40bc65.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

/**
 * ==========================================
 * LANGUAGES
 * ==========================================
 */

const languages = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    isActive: true,
  },

  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    isActive: true,
  },
};

/**
 * ==========================================
 * CATEGORY TRANSLATIONS
 * ==========================================
 */

const categoryTranslations = {
  motivation: {
    en: "Motivation",
    hi: "प्रेरणा",
  },

  love: {
    en: "Love",
    hi: "प्यार",
  },

  life: {
    en: "Life",
    hi: "ज़िंदगी",
  },

  success: {
    en: "Success",
    hi: "सफलता",
  },

  inspirational: {
    en: "Inspirational",
    hi: "प्रेरणादायक",
  },

  happiness: {
    en: "Happiness",
    hi: "खुशियाँ",
  },

  sad: {
    en: "Sad",
    hi: "उदास",
  },

  friendship: {
    en: "Friendship",
    hi: "दोस्ती",
  },

  attitude: {
    en: "Attitude",
    hi: "रवैया",
  },

  "self-respect": {
    en: "Self Respect",
    hi: "आत्मसम्मान",
  },

  positive: {
    en: "Positive",
    hi: "सकारात्मक",
  },

  breakup: {
    en: "Breakup",
    hi: "ब्रेकअप",
  },

  relationship: {
    en: "Relationship",
    hi: "रिश्ता",
  },

  family: {
    en: "Family",
    hi: "परिवार",
  },

  funny: {
    en: "Funny",
    hi: "मज़ेदार",
  },
};

/**
 * ==========================================
 * SUBCATEGORY TRANSLATIONS
 * ==========================================
 *
 * Add/change names here whenever required.
 */

const subcategoryTranslations = {
  "self-motivation": {
    en: "Self Motivation",
    hi: "आत्म प्रेरणा",
  },

  "hard-work": {
    en: "Hard Work",
    hi: "कड़ी मेहनत",
  },

  discipline: {
    en: "Discipline",
    hi: "अनुशासन",
  },

  "never-give-up": {
    en: "Never Give Up",
    hi: "कभी हार मत मानो",
  },

  "romantic-love": {
    en: "Romantic Love",
    hi: "रोमांटिक प्यार",
  },

  "true-love": {
    en: "True Love",
    hi: "सच्चा प्यार",
  },

  "love-feelings": {
    en: "Love Feelings",
    hi: "प्यार की भावनाएँ",
  },

  "broken-love": {
    en: "Broken Love",
    hi: "टूटा हुआ प्यार",
  },

  "life-lessons": {
    en: "Life Lessons",
    hi: "ज़िंदगी के सबक",
  },

  "life-quotes": {
    en: "Life Quotes",
    hi: "ज़िंदगी के विचार",
  },

  "life-experience": {
    en: "Life Experience",
    hi: "ज़िंदगी का अनुभव",
  },

  "reality-of-life": {
    en: "Reality of Life",
    hi: "ज़िंदगी की हकीकत",
  },

  "success-mindset": {
    en: "Success Mindset",
    hi: "सफलता की सोच",
  },

  goals: {
    en: "Goals",
    hi: "लक्ष्य",
  },

  achievement: {
    en: "Achievement",
    hi: "उपलब्धि",
  },

  "career-success": {
    en: "Career Success",
    hi: "करियर में सफलता",
  },

  inspiration: {
    en: "Inspiration",
    hi: "प्रेरणा",
  },

  positivity: {
    en: "Positivity",
    hi: "सकारात्मकता",
  },

  hope: {
    en: "Hope",
    hi: "उम्मीद",
  },

  courage: {
    en: "Courage",
    hi: "हिम्मत",
  },

  "happy-life": {
    en: "Happy Life",
    hi: "खुशहाल ज़िंदगी",
  },

  smile: {
    en: "Smile",
    hi: "मुस्कान",
  },

  joy: {
    en: "Joy",
    hi: "खुशी",
  },

  peace: {
    en: "Peace",
    hi: "शांति",
  },

  "sad-feelings": {
    en: "Sad Feelings",
    hi: "उदास भावनाएँ",
  },

  loneliness: {
    en: "Loneliness",
    hi: "अकेलापन",
  },

  heartbreak: {
    en: "Heartbreak",
    hi: "दिल टूटना",
  },

  pain: {
    en: "Pain",
    hi: "दर्द",
  },

  "best-friends": {
    en: "Best Friends",
    hi: "सबसे अच्छे दोस्त",
  },

  "true-friendship": {
    en: "True Friendship",
    hi: "सच्ची दोस्ती",
  },

  "missing-friends": {
    en: "Missing Friends",
    hi: "दोस्तों की याद",
  },

  "positive-attitude": {
    en: "Positive Attitude",
    hi: "सकारात्मक रवैया",
  },

  "bold-attitude": {
    en: "Bold Attitude",
    hi: "बेबाक रवैया",
  },

  "self-respect": {
    en: "Self Respect",
    hi: "आत्मसम्मान",
  },

  swag: {
    en: "Swag",
    hi: "स्वैग",
  },

  "self-worth": {
    en: "Self Worth",
    hi: "आत्म-मूल्य",
  },

  "self-love": {
    en: "Self Love",
    hi: "खुद से प्यार",
  },

  boundaries: {
    en: "Boundaries",
    hi: "सीमाएँ",
  },

  "positive-thinking": {
    en: "Positive Thinking",
    hi: "सकारात्मक सोच",
  },

  "positive-life": {
    en: "Positive Life",
    hi: "सकारात्मक जीवन",
  },

  "good-vibes": {
    en: "Good Vibes",
    hi: "अच्छी ऊर्जा",
  },

  "moving-on": {
    en: "Moving On",
    hi: "आगे बढ़ना",
  },

  "broken-heart": {
    en: "Broken Heart",
    hi: "टूटा हुआ दिल",
  },

  couples: {
    en: "Couples",
    hi: "जोड़े",
  },

  trust: {
    en: "Trust",
    hi: "भरोसा",
  },

  understanding: {
    en: "Understanding",
    hi: "समझ",
  },

  parents: {
    en: "Parents",
    hi: "माता-पिता",
  },

  mother: {
    en: "Mother",
    hi: "माँ",
  },

  father: {
    en: "Father",
    hi: "पिता",
  },

  "family-love": {
    en: "Family Love",
    hi: "परिवार का प्यार",
  },

  "funny-life": {
    en: "Funny Life",
    hi: "मज़ेदार ज़िंदगी",
  },

  "funny-friends": {
    en: "Funny Friends",
    hi: "मज़ेदार दोस्त",
  },

  "funny-attitude": {
    en: "Funny Attitude",
    hi: "मज़ेदार रवैया",
  },
};

/**
 * ==========================================
 * MAIN MIGRATION
 * ==========================================
 */

const migrateLanguageData = async () => {
  try {
    console.log("\n======================================");
    console.log("   LANGUAGE DATA MIGRATION");
    console.log("======================================\n");

    /**
     * --------------------------------------
     * 1. LANGUAGES
     * --------------------------------------
     */

    console.log("🌐 Uploading languages...");

    const languageBatch = db.batch();

    Object.entries(languages).forEach(([id, data]) => {
      const ref = db.collection("languages").doc(id);

      languageBatch.set(ref, data, {
        merge: true,
      });
    });

    await languageBatch.commit();

    console.log("✅ Languages completed\n");

    /**
     * --------------------------------------
     * 2. CATEGORIES
     * --------------------------------------
     */

    console.log("📂 Updating categories...");

    const categorySnapshot = await db.collection("categories").get();

    let categoryCount = 0;

    let categoryBatch = db.batch();
    let categoryBatchCount = 0;

    for (const document of categorySnapshot.docs) {
      const id = document.id;

      const translation = categoryTranslations[id];

      if (!translation) {
        console.log(`⚠️ Translation missing: category ${id}`);
        continue;
      }

      const ref = db.collection("categories").doc(id);

      categoryBatch.set(
        ref,
        {
          translations: {
            en: {
              name: translation.en,
            },

            hi: {
              name: translation.hi,
            },
          },

          isActive: true,
        },
        {
          merge: true,
        },
      );

      categoryCount++;
      categoryBatchCount++;

      /**
       * Firestore batch maximum = 500 operations
       */
      if (categoryBatchCount === 450) {
        await categoryBatch.commit();

        categoryBatch = db.batch();
        categoryBatchCount = 0;
      }
    }

    if (categoryBatchCount > 0) {
      await categoryBatch.commit();
    }

    console.log(`✅ Categories updated: ${categoryCount}\n`);

    /**
     * --------------------------------------
     * 3. SUBCATEGORIES
     * --------------------------------------
     */

    console.log("📁 Updating subcategories...");

    const subcategorySnapshot = await db.collection("subcategories").get();

    let subcategoryCount = 0;

    let subcategoryBatch = db.batch();
    let subcategoryBatchCount = 0;

    for (const document of subcategorySnapshot.docs) {
      const id = document.id;

      const translation = subcategoryTranslations[id];

      if (!translation) {
        console.log(`⚠️ Translation missing: subcategory ${id}`);

        continue;
      }

      const ref = db.collection("subcategories").doc(id);

      subcategoryBatch.set(
        ref,
        {
          translations: {
            en: {
              name: translation.en,
            },

            hi: {
              name: translation.hi,
            },
          },

          isActive: true,
        },
        {
          merge: true,
        },
      );

      subcategoryCount++;
      subcategoryBatchCount++;

      if (subcategoryBatchCount === 450) {
        await subcategoryBatch.commit();

        subcategoryBatch = db.batch();
        subcategoryBatchCount = 0;
      }
    }

    if (subcategoryBatchCount > 0) {
      await subcategoryBatch.commit();
    }

    console.log(`✅ Subcategories updated: ${subcategoryCount}\n`);

    /**
     * --------------------------------------
     * COMPLETE
     * --------------------------------------
     */

    console.log("======================================");
    console.log("✅ LANGUAGE MIGRATION COMPLETE");
    console.log("======================================\n");

    console.log(`Languages       : ${Object.keys(languages).length}`);
    console.log(`Categories      : ${categoryCount}`);
    console.log(`Subcategories   : ${subcategoryCount}`);

    console.log("\nFirestore is now language-ready! 🚀\n");
  } catch (error) {
    console.error("\n❌ MIGRATION FAILED");
    console.error(error);
  } finally {
    process.exit(0);
  }
};

migrateLanguageData();
