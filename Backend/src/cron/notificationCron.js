const cron = require("node-cron");
const { getMessaging } = require("firebase-admin/messaging");

const User = require("../models/User");
const Notification = require("../models/Notification");
const NotificationToken = require("../models/NotificationTokens");
const Quote = require("../models/Quote");

require("../config/firebase");

// =====================================================
// CONSTANTS
// =====================================================

const ALLOWED_LANGUAGES = ["English", "Hindi"];

// Prevent duplicate execution in same Node process
const processedUsers = new Map();

// =====================================================
// GET RANDOM ACTIVE QUOTE
// =====================================================

const getRandomQuote = async () => {
  try {
    const result = await Quote.aggregate([
      {
        $match: {
          isActive: true,
          isDraft: false,
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ]);

    if (!result.length) {
      console.log("❌ NO ACTIVE QUOTE FOUND");
      return null;
    }

    return result[0];
  } catch (error) {
    console.error("❌ RANDOM QUOTE ERROR:", error);
    return null;
  }
};

// =====================================================
// GET CURRENT USER TIME
// =====================================================

const getCurrentTimeForTimezone = (timezone) => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date());
  } catch (error) {
    console.error(`❌ TIMEZONE ERROR [${timezone}]:`, error.message);

    return null;
  }
};

// =====================================================
// GET TRANSLATION FROM MAP / OBJECT
// =====================================================

const getTranslation = (quote, language) => {
  if (!quote) {
    return "";
  }

  const translations = quote.translations;

  if (!translations) {
    return "";
  }

  // Mongoose Map
  if (typeof translations.get === "function") {
    return String(translations.get(language) || "").trim();
  }

  // Normal object
  if (typeof translations === "object") {
    return String(translations[language] || "").trim();
  }

  return "";
};

// =====================================================
// GET QUOTE TEXT BY LANGUAGE
// =====================================================

const getQuoteText = (quote, language) => {
  if (!quote) {
    return "";
  }

  const english = getTranslation(quote, "English");

  const hindi = getTranslation(quote, "Hindi");

  // ===================================================
  // HINDI
  // ===================================================

  if (language === "Hindi") {
    return (
      hindi ||
      (quote.language === "Hindi" ? String(quote.text || "").trim() : "") ||
      english ||
      String(quote.text || "").trim()
    );
  }

  // ===================================================
  // ENGLISH
  // ===================================================

  return (
    english ||
    (quote.language === "English" ? String(quote.text || "").trim() : "") ||
    hindi ||
    String(quote.text || "").trim()
  );
};

// =====================================================
// GET QUOTE IMAGE
// =====================================================

const getQuoteImage = (quote) => {
  return quote?.imageUrl || quote?.image || "";
};

// =====================================================
// GET LOCALIZED TITLE
// =====================================================

const getNotificationTitle = (language) => {
  return language === "Hindi" ? "आज का विचार" : "Today's Thought";
};

// =====================================================
// SEND FCM TO TOKENS
// =====================================================

const sendToTokens = async ({
  tokens,
  title,
  body,
  language,
  quote,
  userId,
}) => {
  if (!tokens || !tokens.length) {
    console.log("⚠️ NO FCM TOKENS");
    return {
      successCount: 0,
      failureCount: 0,
    };
  }

  if (!body || !String(body).trim()) {
    console.log("❌ QUOTE BODY EMPTY");
    console.log("QUOTE OBJECT:", quote);

    return {
      successCount: 0,
      failureCount: 0,
    };
  }

  const image = getQuoteImage(quote);

  console.log("");
  console.log("==============================================");
  console.log("📤 PREPARING FCM");
  console.log("==============================================");
  console.log("👤 USER:", String(userId));
  console.log("🌐 LANGUAGE:", language);
  console.log("📝 TITLE:", title);
  console.log("📝 BODY:", body);
  console.log("🖼️ IMAGE:", image || "NO IMAGE");
  console.log("📱 TOKEN COUNT:", tokens.length);
  console.log("==============================================");

  // ===================================================
  // MAX 500 TOKENS
  // ===================================================

  const chunkSize = 500;

  let totalSuccess = 0;
  let totalFailure = 0;

  for (let start = 0; start < tokens.length; start += chunkSize) {
    const tokenChunk = tokens.slice(start, start + chunkSize);

    try {
      console.log(`📤 FCM SENDING → ${tokenChunk.length} TOKEN(S)`);

      const message = {
        tokens: tokenChunk,

        notification: {
          title: String(title),
          body: String(body),
        },

        data: {
          title: String(title),
          body: String(body),
          language: String(language),
          type: "daily_quote",
          quoteId: String(quote._id),
          image: String(image || ""),
        },

        android: {
          priority: "high",

          notification: {
            channelId: "quotes",
            sound: "default",
          },
        },

        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      // =================================================
      // IMAGE
      // =================================================

      if (image && String(image).trim()) {
        message.notification.imageUrl = String(image);

        message.data.image = String(image);

        message.android.notification.imageUrl = String(image);

        message.apns.fcmOptions = {
          imageUrl: String(image),
        };
      }

      // =================================================
      // SEND FCM
      // =================================================

      const response = await getMessaging().sendEachForMulticast(message);

      totalSuccess += response.successCount;
      totalFailure += response.failureCount;

      console.log(`✅ FCM SUCCESS: ${response.successCount}`);

      console.log(`❌ FCM FAILED: ${response.failureCount}`);

      // =================================================
      // HANDLE FAILED TOKENS
      // =================================================

      for (let i = 0; i < response.responses.length; i++) {
        const result = response.responses[i];

        if (!result.success) {
          const failedToken = tokenChunk[i];

          console.log("");
          console.log("❌ FCM TOKEN FAILED");

          console.log("CODE:", result.error?.code);

          console.log("MESSAGE:", result.error?.message);

          // ---------------------------------------------
          // DELETE INVALID TOKEN
          // ---------------------------------------------

          if (
            result.error?.code ===
              "messaging/registration-token-not-registered" ||
            result.error?.code === "messaging/invalid-registration-token"
          ) {
            await NotificationToken.deleteMany({
              fcmToken: failedToken,
            });

            console.log("🗑️ INVALID FCM TOKEN DELETED");
          }
        }
      }
    } catch (error) {
      console.error("❌ FCM SEND ERROR:", error);
    }
  }

  // ===================================================
  // SAVE NOTIFICATION HISTORY
  // ===================================================

  if (totalSuccess > 0) {
    try {
      await Notification.create({
        userId,

        title: String(title),

        body: String(body),

        language,

        type: "daily_quote",

        data: {
          quoteId: String(quote._id),

          language: String(language),

          image: String(image || ""),
        },

        isRead: false,
      });

      console.log("💾 NOTIFICATION HISTORY SAVED");
    } catch (historyError) {
      console.error("❌ HISTORY SAVE ERROR:", historyError);
    }
  }

  return {
    successCount: totalSuccess,
    failureCount: totalFailure,
  };
};

// =====================================================
// SEND DAILY NOTIFICATIONS
// =====================================================

const sendDailyNotifications = async () => {
  try {
    console.log("");
    console.log("");
    console.log("==============================================");
    console.log("⏰ DAILY NOTIFICATION CHECK");
    console.log("==============================================");

    console.log("SERVER UTC:", new Date().toISOString());

    // =================================================
    // GET USERS
    // =================================================

    const users = await User.find({
      "notificationSettings.dailyQuote": true,

      "notificationSettings.notificationTime": {
        $exists: true,
        $ne: "",
      },

      "notificationSettings.timezone": {
        $exists: true,
        $ne: "",
      },
    }).select("_id language notificationSettings");

    console.log(`👥 USERS FOUND: ${users.length}`);

    if (!users.length) {
      console.log("⚠️ NO USERS WITH DAILY QUOTE ENABLED");

      return;
    }

    // =================================================
    // RANDOM QUOTE
    // =================================================

    const quote = await getRandomQuote();

    if (!quote) {
      return;
    }

    console.log("");
    console.log("==============================================");
    console.log("📝 RANDOM QUOTE SELECTED");
    console.log("==============================================");

    console.log("QUOTE ID:", quote._id);

    console.log("QUOTE TEXT:", quote.text);

    console.log("ENGLISH:", getTranslation(quote, "English"));

    console.log("HINDI:", getTranslation(quote, "Hindi"));

    console.log("IMAGE:", getQuoteImage(quote));

    console.log("==============================================");

    // =================================================
    // PROCESS USERS
    // =================================================

    for (const user of users) {
      try {
        const userId = String(user._id);

        const settings = user.notificationSettings || {};

        const timezone = settings.timezone || "Asia/Kolkata";

        const notificationTime = settings.notificationTime;

        console.log("");
        console.log("----------------------------------------------");

        console.log("👤 USER:", userId);

        console.log("🌍 TIMEZONE:", timezone);

        console.log("🔔 SAVED TIME:", notificationTime);

        // =================================================
        // CURRENT USER TIME
        // =================================================

        const currentTime = getCurrentTimeForTimezone(timezone);

        console.log("⏰ CURRENT USER TIME:", currentTime);

        // =================================================
        // TIME MATCH
        // =================================================

        if (!currentTime || currentTime !== notificationTime) {
          console.log("⏭️ TIME NOT MATCHED");

          continue;
        }

        console.log("🎯🎯🎯 TIME MATCHED!");

        // =================================================
        // DUPLICATE PROTECTION
        // =================================================

        const processKey = `${userId}_${timezone}_${notificationTime}_${new Date()
          .toISOString()
          .slice(0, 16)}`;

        if (processedUsers.has(processKey)) {
          console.log("⏭️ ALREADY PROCESSED THIS MINUTE");

          continue;
        }

        processedUsers.set(processKey, true);

        // Cleanup old keys
        if (processedUsers.size > 1000) {
          const firstKey = processedUsers.keys().next().value;

          if (firstKey) {
            processedUsers.delete(firstKey);
          }
        }

        // =================================================
        // GET USER DEVICES
        // =================================================

        const devices = await NotificationToken.find({
          userId: user._id,

          isActive: true,

          fcmToken: {
            $exists: true,

            $type: "string",

            $ne: "",
          },

          language: {
            $in: ALLOWED_LANGUAGES,
          },
        }).select("fcmToken language platform");

        console.log(`📱 DEVICES FOUND: ${devices.length}`);

        if (!devices.length) {
          console.log("⚠️ NO ACTIVE FCM DEVICE");

          continue;
        }

        // =================================================
        // GROUP DEVICES BY LANGUAGE
        // =================================================

        const englishDevices = devices.filter(
          (device) => device.language === "English",
        );

        const hindiDevices = devices.filter(
          (device) => device.language === "Hindi",
        );

        console.log("🇬🇧 ENGLISH DEVICES:", englishDevices.length);

        console.log("🇮🇳 HINDI DEVICES:", hindiDevices.length);

        // =================================================
        // ENGLISH DEVICES
        // =================================================

        if (englishDevices.length) {
          const englishTokens = [
            ...new Set(
              englishDevices
                .map((device) => String(device.fcmToken || "").trim())
                .filter(Boolean),
            ),
          ];

          const englishBody = getQuoteText(quote, "English");

          if (englishBody) {
            await sendToTokens({
              tokens: englishTokens,

              title: getNotificationTitle("English"),

              body: englishBody,

              language: "English",

              quote,

              userId: user._id,
            });
          } else {
            console.log("❌ ENGLISH QUOTE EMPTY");
          }
        }

        // =================================================
        // HINDI DEVICES
        // =================================================

        if (hindiDevices.length) {
          const hindiTokens = [
            ...new Set(
              hindiDevices
                .map((device) => String(device.fcmToken || "").trim())
                .filter(Boolean),
            ),
          ];

          const hindiBody = getQuoteText(quote, "Hindi");

          if (hindiBody) {
            await sendToTokens({
              tokens: hindiTokens,

              title: getNotificationTitle("Hindi"),

              body: hindiBody,

              language: "Hindi",

              quote,

              userId: user._id,
            });
          } else {
            console.log("❌ HINDI QUOTE EMPTY");
          }
        }
      } catch (userError) {
        console.error(`❌ USER NOTIFICATION ERROR [${user._id}]:`, userError);
      }
    }

    console.log("");
    console.log("==============================================");

    console.log("✅ DAILY NOTIFICATION CHECK COMPLETED");

    console.log("==============================================");

    console.log("");
  } catch (error) {
    console.error("❌ DAILY NOTIFICATION JOB ERROR:", error);
  }
};

// =====================================================
// CRON EVERY MINUTE
// =====================================================

cron.schedule(
  "* * * * *",
  async () => {
    console.log("");
    console.log("⏰ CRON TRIGGERED:", new Date().toISOString());

    await sendDailyNotifications();
  },
  {
    timezone: "UTC",
  },
);

// =====================================================
// START
// =====================================================

console.log("");
console.log("🚀 DAILY NOTIFICATION CRON STARTED");

console.log("⏰ CHECKING EVERY MINUTE");

console.log("");

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendDailyNotifications,
};
