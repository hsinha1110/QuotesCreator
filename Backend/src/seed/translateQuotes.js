require("dotenv").config();

const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const Quote = require("../models/Quote");

// =====================================================
// CONFIG
// =====================================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const MODEL = "openai/gpt-oss-20b";

const MAX_RETRIES = 3;
const DAILY_LIMIT = 200;
const DELAY_MS = 500;

// =====================================================
// ENV CHECK
// =====================================================

if (!MONGO_URI) {
  throw new Error("MONGO_URI / MONGODB_URI is missing in .env");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in .env");
}

// =====================================================
// GROQ
// =====================================================

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// =====================================================
// DELAY
// =====================================================

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =====================================================
// CLEAN AI RESPONSE
// =====================================================

const cleanTranslation = (text) => {
  if (!text) {
    return "";
  }

  return String(text)
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/^English\s*:\s*/i, "")
    .trim();
};

// =====================================================
// TRANSLATE HINDI → ENGLISH
// =====================================================

const translateHindiToEnglish = async (hindiText) => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`   Translation attempt ${attempt}/${MAX_RETRIES}`);

      const completion = await groq.chat.completions.create({
        model: MODEL,

        messages: [
          {
            role: "system",

            content:
              "You are an expert Hindi to English translator specializing in motivational and inspirational quotes.",
          },

          {
            role: "user",

            content: `
Translate the following Hindi quote into natural, fluent English.

IMPORTANT RULES:

1. Return ONLY the English translation.
2. Do not explain anything.
3. Do not write "English:".
4. Do not use quotation marks.
5. Preserve the exact meaning.
6. Preserve the emotional tone.
7. Do not add information.
8. Do not remove important meaning.
9. Keep the translation concise.
10. Preserve punctuation where appropriate.
11. Translate the quote, not the instructions.

Hindi quote:

${hindiText}
`,
          },
        ],

        temperature: 0.2,

        max_tokens: 300,
      });

      const result = completion?.choices?.[0]?.message?.content;

      const englishText = cleanTranslation(result);

      if (englishText) {
        return englishText;
      }

      console.log("   ⚠ Empty response from Groq");
    } catch (error) {
      console.log(`   ⚠ Groq error: ${error?.message || error}`);
    }

    if (attempt < MAX_RETRIES) {
      await sleep(1500);
    }
  }

  return "";
};

// =====================================================
// MAIN
// =====================================================

const translateQuotes = async () => {
  try {
    console.log("\n==========================================");

    console.log("       GROQ QUOTE TRANSLATION");

    console.log("==========================================\n");

    // =================================================
    // CONNECT MONGODB
    // =================================================

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // =================================================
    // GET ALL HINDI QUOTES
    // =================================================
    //
    // IMPORTANT:
    // Actual MongoDB field is `text`
    //
    // =================================================
    const quotes = await Quote.find({
      language: "Hindi",

      text: {
        $exists: true,
        $nin: ["", null],
      },

      $or: [
        { "translations.English": { $exists: false } },
        { "translations.English": "" },
        { "translations.English": null },
      ],
    })
      .select("_id text author language translations categoryId subcategoryId")
      .limit(DAILY_LIMIT)
      .lean();

    console.log(`Hindi quotes found: ${quotes.length}`);

    if (!quotes.length) {
      console.log("\n❌ No Hindi quotes found.");

      return;
    }

    // =================================================
    // COUNTERS
    // =================================================

    let translated = 0;

    let skipped = 0;

    let failed = 0;

    // =================================================
    // PROCESS EACH QUOTE
    // =================================================

    for (let index = 0; index < quotes.length; index++) {
      const quote = quotes[index];

      const hindiText = String(quote.text || "").trim();

      console.log(`\n[${index + 1}/${quotes.length}]`);

      console.log(`Hindi: ${hindiText}`);

      // =================================================
      // EMPTY TEXT
      // =================================================

      if (!hindiText) {
        console.log("⚠ Empty text - skipped");

        skipped++;

        continue;
      }

      // =================================================
      // TRANSLATE
      // =================================================

      const englishText = await translateHindiToEnglish(hindiText);

      // =================================================
      // FAILED
      // =================================================

      if (!englishText) {
        console.log("❌ Translation failed after retries");

        failed++;

        continue;
      }

      console.log(`English: ${englishText}`);

      // =================================================
      // UPDATE ONLY TRANSLATION
      // =================================================

      try {
        await Quote.updateOne(
          {
            _id: quote._id,
          },

          {
            $set: {
              "translations.English": englishText,

              // Keep Hindi original
              "translations.Hindi": hindiText,
            },
          },
        );

        translated++;

        console.log("✓ Saved");
      } catch (error) {
        failed++;

        console.log("❌ MongoDB update failed:", error?.message || error);

        continue;
      }

      // =================================================
      // DELAY
      // =================================================

      await sleep(DELAY_MS);
    }

    // =================================================
    // FINAL RESULT
    // =================================================

    console.log("\n==========================================");

    console.log("       TRANSLATION COMPLETE");

    console.log("==========================================");

    console.log(`Hindi quotes : ${quotes.length}`);

    console.log(`Translated   : ${translated}`);

    console.log(`Skipped      : ${skipped}`);

    console.log(`Failed       : ${failed}`);

    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ TRANSLATION ERROR:", error);

    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();

      console.log("MongoDB disconnected");
    } catch (error) {
      console.error("MongoDB disconnect error:", error?.message || error);
    }
  }
};

// =====================================================
// RUN
// =====================================================

translateQuotes();
