const cron = require("node-cron");
const { getMessaging } = require("firebase-admin/messaging");

const User = require("../models/User");
const Notification = require("../models/Notification");
const NotificationToken = require("../models/NotificationTokens");
const Quote = require("../models/Quote");

require("../config/firebase");

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
// GET USER CURRENT TIME
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
// GET QUOTE TEXT BY LANGUAGE
// =====================================================

const getQuoteText = (quote, language) => {
  if (!quote) {
    return "";
  }

  const translations = quote.translations || {};

  // ---------------------------------------------------
  // Hindi
  // ---------------------------------------------------

  if (language === "Hindi") {
    return translations.Hindi || quote.text || translations.English || "";
  }

  // ---------------------------------------------------
  // English
  // ---------------------------------------------------

  return translations.English || quote.text || translations.Hindi || "";
};

// =====================================================
// GET QUOTE IMAGE
// =====================================================

const getQuoteImage = (quote) => {
  return quote?.imageUrl || quote?.image || "";
};

// =====================================================
// SEND FCM
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
    return;
  }

  if (!body || !String(body).trim()) {
    console.log("❌ QUOTE BODY EMPTY");
    console.log("QUOTE OBJECT:", quote);

    return;
  }

  const image = getQuoteImage(quote);

  // ===================================================
  // BASE MESSAGE
  // ===================================================

  const message = {
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
        },
      },
    },
  };

  // ===================================================
  // IMAGE
  // ===================================================

  if (image && String(image).trim()) {
    message.notification.imageUrl = String(image);

    message.data.image = String(image);

    message.android.notification.imageUrl = String(image);

    message.apns.fcmOptions = {
      imageUrl: String(image),
    };
  }

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

  for (let start = 0; start < tokens.length; start += chunkSize) {
    const tokenChunk = tokens.slice(start, start + chunkSize);

    try {
      console.log(`📤 FCM SENDING → ${tokenChunk.length} TOKEN(S)`);

      const response = await getMessaging().sendEachForMulticast({
        ...message,
        tokens: tokenChunk,
      });

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

      // =================================================
      // SAVE NOTIFICATION HISTORY
      // =================================================

      if (response.successCount > 0) {
        await Notification.create({
          userId,

          title: String(title),

          body: String(body),

          type: "daily_quote",

          data: {
            quoteId: String(quote._id),
            language: String(language),
            image: String(image),
          },

          isRead: false,
        });

        console.log("💾 NOTIFICATION HISTORY SAVED");
      }
    } catch (error) {
      console.error("❌ FCM SEND ERROR:", error);
    }
  }
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

    console.log("ENGLISH:", quote.translations?.English);

    console.log("HINDI:", quote.translations?.Hindi);

    console.log("IMAGE:", quote.image || quote.imageUrl || "");

    console.log("==============================================");

    // =================================================
    // PROCESS USERS
    // =================================================

    for (const user of users) {
      try {
        const settings = user.notificationSettings || {};

        const timezone = settings.timezone || "Asia/Kolkata";

        const notificationTime = settings.notificationTime;

        console.log("");
        console.log("----------------------------------------------");

        console.log("👤 USER:", String(user._id));

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
        // LANGUAGE
        // =================================================

        const language = user.language === "Hindi" ? "Hindi" : "English";

        const title = language === "Hindi" ? "आज का विचार" : "Today's Thought";

        // =================================================
        // IMPORTANT:
        // USE translations.English / translations.Hindi
        // =================================================

        const body = getQuoteText(quote, language);

        console.log("🌐 LANGUAGE:", language);

        console.log("📝 TITLE:", title);

        console.log("📝 BODY:", body);

        // =================================================
        // BODY CHECK
        // =================================================

        if (!body) {
          console.log("❌ NO QUOTE TEXT AVAILABLE");

          continue;
        }

        // =================================================
        // GET FCM DEVICES
        // =================================================

        const devices = await NotificationToken.find({
          userId: user._id,

          isActive: true,

          fcmToken: {
            $exists: true,
            $ne: "",
          },
        }).select("fcmToken");

        console.log(`📱 DEVICES FOUND: ${devices.length}`);

        if (!devices.length) {
          console.log("⚠️ NO ACTIVE FCM DEVICE");

          continue;
        }

        // =================================================
        // UNIQUE TOKENS
        // =================================================

        const tokens = [
          ...new Set(devices.map((device) => device.fcmToken).filter(Boolean)),
        ];

        console.log(`📱 UNIQUE FCM TOKENS: ${tokens.length}`);

        if (!tokens.length) {
          console.log("⚠️ NO VALID FCM TOKENS");

          continue;
        }

        // =================================================
        // SEND
        // =================================================

        await sendToTokens({
          tokens,

          title,

          body,

          language,

          quote,

          userId: user._id,
        });
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
