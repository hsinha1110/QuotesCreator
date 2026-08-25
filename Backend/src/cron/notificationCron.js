const cron = require("node-cron");
const { getMessaging } = require("firebase-admin/messaging");

const Notification = require("../models/Notification");

require("../config/firebase");

const notificationContent = {
  English: {
    title: "Today's Thought",
    body: "Keep working hard, success will surely come.",
    image:
      "https://res.cloudinary.com/dxd249q5q/image/upload/v1787467299/QuotesCreator/subcategories/qhhrfbwohda1f0em8yvo.jpg",
  },

  Hindi: {
    title: "आज का विचार",
    body: "मेहनत करते रहो, सफलता जरूर मिलेगी।",
    image:
      "https://res.cloudinary.com/dxd249q5q/image/upload/v1787467299/QuotesCreator/subcategories/qhhrfbwohda1f0em8yvo.jpg",
  },
};

const sendDailyNotifications = async () => {
  try {
    console.log("\n==============================");
    console.log("DAILY NOTIFICATION STARTED");
    console.log("==============================");

    for (const language of ["English", "Hindi"]) {
      const content = notificationContent[language];

      const devices = await Notification.find({
        language,
        isActive: true,
        fcmToken: {
          $exists: true,
          $ne: "",
        },
      });

      console.log(`${language} devices: ${devices.length}`);

      if (!devices.length) {
        continue;
      }

      const tokens = devices.map((device) => device.fcmToken).filter(Boolean);

      if (!tokens.length) {
        continue;
      }

      const message = {
        tokens,

        notification: {
          title: content.title,
          body: content.body,
          imageUrl: content.image,
        },

        data: {
          title: content.title,
          body: content.body,
          image: content.image,
          language,
          type: "daily_quote",
        },

        android: {
          priority: "high",

          notification: {
            channelId: "quotes",
            sound: "default",
            imageUrl: content.image,
          },
        },
      };

      const response = await getMessaging().sendEachForMulticast(message);

      console.log(
        `${language}:`,
        "Success =",
        response.successCount,
        "Failed =",
        response.failureCount,
      );

      // ======================================
      // REMOVE INVALID TOKENS
      // ======================================

      for (let i = 0; i < response.responses.length; i++) {
        const result = response.responses[i];

        if (!result.success) {
          console.log("FCM Error:", result.error?.code);

          if (
            result.error?.code ===
              "messaging/registration-token-not-registered" ||
            result.error?.code === "messaging/invalid-registration-token"
          ) {
            await Notification.deleteOne({
              fcmToken: tokens[i],
            });

            console.log("Invalid token removed from DB:", tokens[i]);
          }
        }
      }
    }

    console.log("\n==============================");
    console.log("DAILY NOTIFICATION COMPLETED");
    console.log("==============================\n");
  } catch (error) {
    console.error("Daily notification error:", error);
  }
};

// ======================================
// EVERY DAY 10:00 AM INDIA TIME
// ======================================

cron.schedule(
  "0 10 * * *",
  async () => {
    await sendDailyNotifications();
  },
  {
    timezone: "Asia/Kolkata",
  },
);

console.log("Daily notification cron scheduled for 10:00 AM IST");

module.exports = {
  sendDailyNotifications,
};
