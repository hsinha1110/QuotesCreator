require("dotenv").config();

const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Quote = require("../models/Quote");

// ==========================================
// ENV
// ==========================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!MONGO_URI) {
  throw new Error("MONGO_URI / MONGODB_URI is missing in .env");
}

if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in .env");
}

// ==========================================
// GROQ
// ==========================================

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

// ==========================================
// NORMALIZE
// ==========================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

// ==========================================
// TRANSLATE
// ==========================================

const translateToEnglish = async (text) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
Translate Hindi into natural English.

Rules:
- Return ONLY the English translation.
- No explanation.
- No quotation marks.
- Preserve the meaning.
- Keep it short.
            `,
        },
        {
          role: "user",
          content: text,
        },
      ],

      temperature: 0.2,
    });

    return completion.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Translation error:", error.message);

    return "";
  }
};

// ==========================================
// CATEGORY -> SUBCATEGORIES
// ==========================================

const CATEGORY_SUBCATEGORIES = {
  motivation: [
    {
      name: "Self Motivation",
      keywords: ["प्रेरणा", "प्रेरित", "हौसला", "हिम्मत", "साहस", "उत्साह"],
    },
    {
      name: "Positive Thinking",
      keywords: ["सकारात्मक", "सकारात्मक सोच", "उम्मीद", "आशा"],
    },
    {
      name: "Hard Work",
      keywords: ["मेहनत", "परिश्रम", "कोशिश", "प्रयास", "लगन"],
    },
    {
      name: "Never Give Up",
      keywords: [
        "हार मत",
        "हार मत मानो",
        "हार नहीं",
        "हिम्मत मत हारो",
        "संघर्ष",
        "रुकना मत",
      ],
    },
    {
      name: "Confidence",
      keywords: ["आत्मविश्वास", "विश्वास", "भरोसा"],
    },
    {
      name: "Goals",
      keywords: ["लक्ष्य", "मंजिल", "उद्देश्य", "सपना", "सपने"],
    },
  ],

  love: [
    {
      name: "True Love",
      keywords: ["सच्चा प्यार", "सच्चा प्रेम", "प्यार", "प्रेम", "मोहब्बत"],
    },
    {
      name: "Relationship",
      keywords: ["रिश्ता", "रिश्ते", "संबंध"],
    },
    {
      name: "Heartbreak",
      keywords: ["दिल टूट", "जुदाई", "बिछड़", "दर्द", "अकेला"],
    },
    {
      name: "Memories",
      keywords: ["याद", "यादें", "यादों"],
    },
    {
      name: "Romance",
      keywords: ["रोमांस", "इश्क"],
    },
  ],

  life: [
    {
      name: "Life Lessons",
      keywords: ["जीवन", "जिंदगी", "जिन्दगी", "सीख", "सबक"],
    },
    {
      name: "Happiness",
      keywords: ["खुशी", "खुश", "मुस्कान", "आनंद"],
    },
    {
      name: "Struggle",
      keywords: ["संघर्ष", "मुश्किल", "कठिनाई", "परेशानी"],
    },
    {
      name: "Experience",
      keywords: ["अनुभव", "तजुर्बा"],
    },
    {
      name: "Reality",
      keywords: ["हकीकत", "सच्चाई", "वास्तविकता"],
    },
  ],

  success: [
    {
      name: "Achievement",
      keywords: ["सफलता", "कामयाबी", "उपलब्धि", "जीत", "विजय"],
    },
    {
      name: "Hard Work",
      keywords: ["मेहनत", "परिश्रम", "कोशिश", "प्रयास"],
    },
    {
      name: "Goals",
      keywords: ["लक्ष्य", "मंजिल", "उद्देश्य", "सपना"],
    },
    {
      name: "Failure",
      keywords: ["असफलता", "नाकामयाबी", "हार"],
    },
  ],

  health: [
    {
      name: "Fitness",
      keywords: ["फिटनेस", "व्यायाम", "कसरत", "योग"],
    },
    {
      name: "Healthy Life",
      keywords: ["स्वास्थ्य", "स्वस्थ", "सेहत"],
    },
    {
      name: "Wellness",
      keywords: ["कल्याण", "तनाव", "आराम", "शांति"],
    },
  ],

  wealth: [
    {
      name: "Money",
      keywords: ["पैसा", "धन", "रुपया", "दौलत"],
    },
    {
      name: "Business",
      keywords: ["व्यापार", "बिजनेस", "व्यवसाय"],
    },
    {
      name: "Prosperity",
      keywords: ["समृद्धि", "अमीर", "समृद्ध"],
    },
  ],

  "self-confidence": [
    {
      name: "Self Belief",
      keywords: ["आत्मविश्वास", "विश्वास", "भरोसा"],
    },
    {
      name: "Inner Strength",
      keywords: ["आंतरिक शक्ति", "हिम्मत", "साहस"],
    },
    {
      name: "Self Respect",
      keywords: ["आत्मसम्मान", "सम्मान"],
    },
  ],

  freedom: [
    {
      name: "Independence",
      keywords: ["स्वतंत्रता", "आजादी", "आज़ादी"],
    },
    {
      name: "Free Mind",
      keywords: ["स्वतंत्र सोच", "खुली सोच"],
    },
  ],

  childhood: [
    {
      name: "Childhood Memories",
      keywords: ["बचपन", "बचपन की याद", "यादें"],
    },
    {
      name: "Innocence",
      keywords: ["मासूम", "मासूमियत"],
    },
  ],

  goal: [
    {
      name: "Dreams",
      keywords: ["सपना", "सपने", "ख्वाब"],
    },
    {
      name: "Achievement",
      keywords: ["सफलता", "उपलब्धि", "कामयाबी"],
    },
    {
      name: "Focus",
      keywords: ["ध्यान", "एकाग्रता", "फोकस"],
    },
  ],

  selfishness: [
    {
      name: "Self Interest",
      keywords: ["स्वार्थ", "स्वार्थी", "मतलब"],
    },
  ],

  greed: [
    {
      name: "Desire",
      keywords: ["लालच", "लालसा", "लोभ"],
    },
    {
      name: "Materialism",
      keywords: ["दौलत", "पैसा", "धन"],
    },
  ],

  determination: [
    {
      name: "Resolution",
      keywords: ["संकल्प", "दृढ़ संकल्प", "इरादा"],
    },
    {
      name: "Willpower",
      keywords: ["इच्छाशक्ति", "हौसला", "हिम्मत"],
    },
  ],

  habit: [
    {
      name: "Good Habits",
      keywords: ["अच्छी आदत", "अच्छी आदतें", "अच्छी आदतों"],
    },
    {
      name: "Bad Habits",
      keywords: ["बुरी आदत", "बुरी आदतें", "गलत आदत"],
    },
    {
      name: "Discipline",
      keywords: ["अनुशासन", "नियम", "दिनचर्या"],
    },
  ],

  laziness: [
    {
      name: "Laziness",
      keywords: ["आलस्य", "आलसी", "सुस्ती"],
    },
    {
      name: "Discipline",
      keywords: ["अनुशासन", "मेहनत", "समय"],
    },
  ],

  hatred: [
    {
      name: "Hate",
      keywords: ["नफरत", "घृणा", "द्वेष"],
    },
    {
      name: "Forgiveness",
      keywords: ["माफी", "क्षमा", "माफ"],
    },
  ],

  jealousy: [
    {
      name: "Jealousy",
      keywords: ["ईर्ष्या", "जलन", "ईर्ष्यालु"],
    },
    {
      name: "Comparison",
      keywords: ["तुलना", "मुकाबला"],
    },
  ],

  anger: [
    {
      name: "Anger",
      keywords: ["गुस्सा", "क्रोध", "नाराज"],
    },
    {
      name: "Patience",
      keywords: ["धैर्य", "संयम", "सब्र"],
    },
    {
      name: "Self Control",
      keywords: ["नियंत्रण", "काबू", "संयम"],
    },
  ],

  peace: [
    {
      name: "Peace",
      keywords: ["शांति", "सुकून", "मन की शांति"],
    },
    {
      name: "Meditation",
      keywords: ["ध्यान", "मेडिटेशन", "योग"],
    },
  ],

  pain: [
    {
      name: "Emotional Pain",
      keywords: ["दर्द", "तकलीफ", "पीड़ा", "दुख"],
    },
    {
      name: "Healing",
      keywords: ["उबरना", "ठीक", "इलाज"],
    },
  ],

  world: [
    {
      name: "World",
      keywords: ["दुनिया", "विश्व", "जगत"],
    },
    {
      name: "Society",
      keywords: ["समाज", "लोग", "समुदाय"],
    },
  ],

  unity: [
    {
      name: "Togetherness",
      keywords: ["एकता", "साथ", "एकजुट"],
    },
    {
      name: "Peace",
      keywords: ["शांति", "मेलजोल"],
    },
  ],

  speech: [
    {
      name: "Words",
      keywords: ["वाणी", "शब्द", "बोल"],
    },
    {
      name: "Communication",
      keywords: ["बातचीत", "संवाद"],
    },
  ],

  character: [
    {
      name: "Good Character",
      keywords: ["चरित्र", "चरित्रवान", "संस्कार"],
    },
    {
      name: "Integrity",
      keywords: ["ईमानदारी", "सच्चाई"],
    },
  ],

  comfort: [
    {
      name: "Peace",
      keywords: ["सुकून", "आराम", "शांति"],
    },
    {
      name: "Happiness",
      keywords: ["खुशी", "खुश"],
    },
  ],

  general: [
    {
      name: "General",
      keywords: [],
    },
  ],
};

// ==========================================
// CATEGORY ALIASES
// ==========================================

const CATEGORY_ALIASES = {
  आदत: "habit",
  आलस्य: "laziness",
  स्वतंत्रता: "freedom",
  आजादी: "freedom",
  आज़ादी: "freedom",
  धन: "wealth",
  स्वास्थ्य: "health",
  बचपन: "childhood",
  स्वार्थ: "selfishness",
  लालच: "greed",
  लक्ष्य: "goal",
  आत्मविश्वास: "self-confidence",
  संकल्प: "determination",
  नफरत: "hatred",
  ईर्ष्या: "jealousy",
  क्रोध: "anger",
  गुस्सा: "anger",
  शांति: "peace",
  दर्द: "pain",
  दुनिया: "world",
  एकता: "unity",
  वाणी: "speech",
  चरित्र: "character",
  चारित्र्य: "character",
  सुविधा: "comfort",
};

// ==========================================
// CATEGORY KEY
// ==========================================

const getCategoryKey = (category) => {
  const englishName = normalize(category?.translations?.English);

  const categoryName = normalize(category?.name);

  if (CATEGORY_SUBCATEGORIES[englishName]) {
    return englishName;
  }

  if (CATEGORY_ALIASES[categoryName]) {
    return CATEGORY_ALIASES[categoryName];
  }

  return "general";
};

// ==========================================
// DEFINITIONS
// ==========================================

const getDefinitions = (category) => {
  const key = getCategoryKey(category);

  return CATEGORY_SUBCATEGORIES[key] || CATEGORY_SUBCATEGORIES.general;
};

// ==========================================
// CREATE / GET SUBCATEGORY
// ==========================================

const getOrCreateSubcategory = async (category, definition) => {
  let subcategory = await Subcategory.findOne({
    categoryId: category._id,
    name: definition.name,
  });

  if (subcategory) {
    return {
      subcategory,
      created: false,
    };
  }

  console.log(`Creating: ${category.name} → ${definition.name}`);

  const english = await translateToEnglish(definition.name);

  subcategory = await Subcategory.create({
    categoryId: category._id,

    name: definition.name,

    description: "",

    image: null,

    translations: {
      English: english || definition.name,
    },
  });

  return {
    subcategory,
    created: true,
  };
};

// ==========================================
// MATCH SUBCATEGORY
// ==========================================

const findMatchingSubcategory = (quoteText, definitions) => {
  const text = normalize(quoteText);

  // First keyword match
  for (const definition of definitions) {
    if (!definition.keywords || definition.keywords.length === 0) {
      continue;
    }

    const matched = definition.keywords.some((keyword) =>
      text.includes(normalize(keyword)),
    );

    if (matched) {
      return {
        definition,
        fallback: false,
      };
    }
  }

  // Fallback
  if (definitions.length > 0) {
    return {
      definition: definitions[0],
      fallback: true,
    };
  }

  return null;
};

// ==========================================
// MAIN
// ==========================================

const seedSubcategories = async () => {
  try {
    console.log("\n==========================================");
    console.log("       SUBCATEGORY SEED");
    console.log("==========================================\n");

    // ======================================
    // CONNECT
    // ======================================

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // ======================================
    // GET CATEGORIES
    // ======================================

    const categories = await Category.find({})
      .select("_id name translations")
      .lean();

    if (categories.length === 0) {
      throw new Error(
        "No categories found. Run npm run seed:categories first.",
      );
    }

    console.log(`Categories found: ${categories.length}`);

    // ======================================
    // IMPORTANT:
    // REMOVE OLD / INVALID SUBCATEGORY IDS
    // ======================================

    const resetResult = await Quote.updateMany(
      {
        language: "Hindi",
      },
      {
        $set: {
          subcategoryId: null,
        },
      },
    );

    console.log(
      `Old subcategory references cleared: ${resetResult.modifiedCount}`,
    );

    let createdCount = 0;
    let existingCount = 0;
    let assignedCount = 0;
    let fallbackCount = 0;
    let noCategoryQuotes = 0;

    // ======================================
    // CATEGORY LOOP
    // ======================================

    for (const category of categories) {
      console.log("\n==========================================");

      console.log(`CATEGORY: ${category.name}`);

      console.log(`CATEGORY ID: ${category._id}`);

      console.log("==========================================");

      const definitions = getDefinitions(category);

      console.log(`Subcategory definitions: ${definitions.length}`);

      // ====================================
      // CREATE SUBCATEGORIES
      // ====================================

      const subcategoryMap = new Map();

      for (const definition of definitions) {
        const result = await getOrCreateSubcategory(category, definition);

        subcategoryMap.set(definition.name, result.subcategory);

        if (result.created) {
          createdCount++;
        } else {
          existingCount++;
        }
      }

      // ====================================
      // ONLY THIS CATEGORY'S QUOTES
      // ====================================

      const quotes = await Quote.find({
        categoryId: category._id,

        language: "Hindi",
      })
        .select("_id text categoryId subcategoryId")
        .lean();

      console.log(`Quotes in category: ${quotes.length}`);

      // ====================================
      // ASSIGN QUOTES
      // ====================================

      for (const quote of quotes) {
        // Safety check
        if (String(quote.categoryId) !== String(category._id)) {
          continue;
        }

        const match = findMatchingSubcategory(quote.text, definitions);

        if (!match) {
          console.log(`⚠ No subcategory match: ${quote._id}`);

          continue;
        }

        const subcategory = subcategoryMap.get(match.definition.name);

        if (!subcategory) {
          console.log(`⚠ Subcategory missing in map: ${match.definition.name}`);

          continue;
        }

        // ==================================
        // IMPORTANT:
        // SUBCATEGORY MUST BELONG TO
        // SAME CATEGORY
        // ==================================

        if (String(subcategory.categoryId) !== String(category._id)) {
          console.log(`❌ Wrong category/subcategory relation: ${quote._id}`);

          continue;
        }

        // ==================================
        // UPDATE
        // ==================================

        const updateResult = await Quote.updateOne(
          {
            _id: quote._id,

            categoryId: category._id,
          },
          {
            $set: {
              subcategoryId: subcategory._id,
            },
          },
        );

        if (updateResult.modifiedCount > 0) {
          assignedCount++;

          if (match.fallback) {
            fallbackCount++;

            console.log(`✓ FALLBACK → ${category.name} → ${subcategory.name}`);
          } else {
            console.log(`✓ ${category.name} → ${subcategory.name}`);
          }
        }
      }
    }

    // ======================================
    // QUOTES WITHOUT CATEGORY
    // ======================================

    noCategoryQuotes = await Quote.countDocuments({
      language: "Hindi",

      $or: [
        {
          categoryId: null,
        },
        {
          categoryId: {
            $exists: false,
          },
        },
      ],
    });

    // ======================================
    // FINAL COUNTS
    // ======================================

    const totalSubcategories = await Subcategory.countDocuments();

    const totalQuotes = await Quote.countDocuments({
      language: "Hindi",
    });

    const assignedQuotes = await Quote.countDocuments({
      language: "Hindi",
      subcategoryId: {
        $ne: null,
      },
    });

    const unassignedQuotes = await Quote.countDocuments({
      language: "Hindi",
      $or: [
        {
          subcategoryId: null,
        },
        {
          subcategoryId: {
            $exists: false,
          },
        },
      ],
    });

    // ======================================
    // VERIFY RELATIONS
    // ======================================

    let wrongRelations = 0;
    let missingSubcategories = 0;

    const assignedQuoteDocuments = await Quote.find({
      language: "Hindi",
      subcategoryId: {
        $ne: null,
      },
    })
      .select("_id categoryId subcategoryId")
      .lean();

    // Cache subcategories
    const allSubcategories = await Subcategory.find({})
      .select("_id categoryId name")
      .lean();

    const subcategoryLookup = new Map();

    for (const subcategory of allSubcategories) {
      subcategoryLookup.set(String(subcategory._id), subcategory);
    }

    for (const quote of assignedQuoteDocuments) {
      const subcategory = subcategoryLookup.get(String(quote.subcategoryId));

      if (!subcategory) {
        missingSubcategories++;

        console.log(`❌ SUBCATEGORY NOT FOUND: ${quote._id}`);

        continue;
      }

      if (String(quote.categoryId) !== String(subcategory.categoryId)) {
        wrongRelations++;

        console.log(`❌ WRONG RELATION: ${quote._id}`);
      }
    }

    // ======================================
    // SUMMARY
    // ======================================

    console.log("\n==========================================");

    console.log("      SUBCATEGORY SEED COMPLETE");

    console.log("==========================================");

    console.log(`Categories            : ${categories.length}`);

    console.log(`Subcategories created : ${createdCount}`);

    console.log(`Subcategories existing: ${existingCount}`);

    console.log(`Total subcategories   : ${totalSubcategories}`);

    console.log(`Total Hindi quotes    : ${totalQuotes}`);

    console.log(`Quotes assigned       : ${assignedCount}`);

    console.log(`Fallback assigned     : ${fallbackCount}`);

    console.log(`Quotes without category: ${noCategoryQuotes}`);

    console.log(`Assigned quotes       : ${assignedQuotes}`);

    console.log(`Unassigned quotes     : ${unassignedQuotes}`);

    console.log(`Missing subcategories : ${missingSubcategories}`);

    console.log(`Wrong relations       : ${wrongRelations}`);

    console.log("==========================================");

    if (wrongRelations === 0 && missingSubcategories === 0) {
      console.log("✅ CATEGORY → SUBCATEGORY RELATIONS ARE CORRECT");
    } else {
      console.log("⚠ PLEASE CHECK RELATION COUNTS");
    }

    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ SUBCATEGORY SEED ERROR:", error);

    process.exitCode = 1;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();

        console.log("MongoDB disconnected");
      }
    } catch (error) {
      console.error("MongoDB disconnect error:", error.message);
    }
  }
};

// ==========================================
// RUN
// ==========================================

seedSubcategories();
