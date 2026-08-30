const cron = require("node-cron");
const { getMessaging } = require("firebase-admin/messaging");

const Notification = require("../models/Notification");
const Quote = require("../models/Quote");

require("../config/firebase");

// ======================================
// GET RANDOM QUOTE
// ======================================

const getRandomQuote = async () => {
  const result = await Quote.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
    {
      $sample: {
        size: 1,
      },
    },
  ]);

  return result.length ? result[0] : null;
};

// ======================================
// SEND NOTIFICATIONS
// ======================================

const sendDailyNotifications = async () => {
  try {
    console.log("\n================================");
    console.log("DAILY NOTIFICATION STARTED");
    console.log("================================");

    // ----------------------------------
    // Get one random quote
    // ----------------------------------

    const quote = await getRandomQuote();

    if (!quote) {
      console.log("❌ No active quote found");
      return;
    }

    console.log("✅ Random quote selected:", quote._id);

    // ----------------------------------
    // English / Hindi
    // ----------------------------------

    for (const language of ["English", "Hindi"]) {
      console.log(`\nProcessing language: ${language}`);

      // ----------------------------------
      // Get devices
      // ----------------------------------

      const devices = await Notification.find({
        language,
        isActive: true,
        fcmToken: {
          $exists: true,
          $ne: "",
        },
      });

      console.log(
        `${language} devices found: ${devices.length}`,
      );

      if (!devices.length) {
        continue;
      }

      // ----------------------------------
      // Get unique FCM tokens
      // ----------------------------------

      const tokens = [
        ...new Set(
          devices
            .map((device) => device.fcmToken)
            .filter(Boolean),
        ),
      ];

      console.log(
        `${language} unique tokens: ${tokens.length}`,
      );

      if (!tokens.length) {
        continue;
      }

      // ----------------------------------
      // Language specific content
      // ----------------------------------

      const title =
        language === "Hindi"
          ? "आज का विचार"
          : "Today's Thought";

      const body =
        language === "Hindi"
          ? quote.textHindi
          : quote.textEnglish;

      // ----------------------------------
      // Dynamic image
      // ----------------------------------

      const image = quote.imageUrl || "";

      console.log("Title:", title);
      console.log("Body:", body);
      console.log("Image:", image || "NO IMAGE");

      // ----------------------------------
      // Base FCM message
      // ----------------------------------

      const message = {
        tokens,

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
      };

      // ----------------------------------
      // IMAGE OPTIONAL
      // ----------------------------------

      if (image) {
        message.notification.imageUrl = String(image);

        message.data.image = String(image);

        message.android.notification.imageUrl =
          String(image);
      }

      // ----------------------------------
      // FCM LIMIT = 500 TOKENS
      // ----------------------------------

      const chunkSize = 500;

      for (
        let start = 0;
        start < tokens.length;
        start += chunkSize
      ) {
        const tokenChunk = tokens.slice(
          start,
          start + chunkSize,
        );

        const chunkMessage = {
          ...message,
          tokens: tokenChunk,
        };

        console.log(
          `Sending ${language} notification to ${tokenChunk.length} devices`,
        );

        // ----------------------------------
        // SEND FCM
        // ----------------------------------

        const response =
          await getMessaging().sendEachForMulticast(
            chunkMessage,
          );

        console.log(
          `${language}: Success = ${response.successCount}`,
        );

        console.log(
          `${language}: Failed = ${response.failureCount}`,
        );

        // ----------------------------------
        // HANDLE FAILED TOKENS
        // ----------------------------------

        for (
          let i = 0;
          i < response.responses.length;
          i++
        ) {
          const result = response.responses[i];

          if (!result.success) {
            const token = tokenChunk[i];

            console.log(
              "\n❌ FCM FAILED",
            );

            console.log(
              "Token:",
              token,
            );

            console.log(
              "Code:",
              result.error?.code,
            );

            console.log(
              "Message:",
              result.error?.message,
            );

            // ------------------------------
            // Remove invalid tokens
            // ------------------------------

            if (
              result.error?.code ===
                "messaging/registration-token-not-registered" ||
              result.error?.code ===
                "messaging/invalid-registration-token"
            ) {
              await Notification.deleteMany({
                fcmToken: token,
              });

              console.log(
                "🗑️ Invalid token removed:",
                token,
              );
            }
          }
        }
      }
    }

    console.log("\n================================");
    console.log("DAILY NOTIFICATION COMPLETED");
    console.log("================================\n");
  } catch (error) {
    console.error(
      "❌ Daily notification error:",
      error,
    );
  }
};

// ======================================
// DAILY 9:04 AM IST
// ======================================

cron.schedule(
  "4 9 * * *",
  async () => {
    console.log(
      "⏰ Cron triggered at 9:04 AM IST",
    );

    await sendDailyNotifications();
  },
  {
    timezone: "Asia/Kolkata",
  },
);

console.log(
  "Daily notification cron scheduled for 9:04 AM IST",
);

// ======================================
// EXPORT
// ======================================

module.exports = {
  sendDailyNotifications,
};