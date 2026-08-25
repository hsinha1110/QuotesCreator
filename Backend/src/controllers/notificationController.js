const mongoose = require("mongoose");
const { getMessaging } = require("firebase-admin/messaging");

const Notification = require("../models/Notification");

// Firebase Admin initialize
require("../config/firebase");

const allowedLanguages = ["English", "Hindi"];

// ======================================
// LANGUAGE CONTENT
// ======================================

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

// ======================================
// SEND DAILY NOTIFICATION
// ======================================

const sendNotification = async (req, res) => {
  try {
    console.log("================================");
    console.log("Starting notification broadcast...");
    console.log("================================");

    let totalDevices = 0;
    let totalSuccess = 0;
    let totalFailed = 0;

    const languageResults = {};

    // ======================================
    // ENGLISH + HINDI
    // ======================================

    for (const language of allowedLanguages) {
      console.log(`\nProcessing language: ${language}`);

      const content = notificationContent[language];

      // ======================================
      // FIND DEVICES
      // ======================================

      const devices = await Notification.find({
        language,
        isActive: true,
        fcmToken: {
          $exists: true,
          $ne: "",
        },
      });

      console.log(`${language} devices found:`, devices.length);

      if (!devices.length) {
        languageResults[language] = {
          devices: 0,
          success: 0,
          failed: 0,
        };

        continue;
      }

      // ======================================
      // GET TOKENS
      // ======================================

      const tokens = devices.map((device) => device.fcmToken).filter(Boolean);

      if (!tokens.length) {
        languageResults[language] = {
          devices: 0,
          success: 0,
          failed: 0,
        };

        continue;
      }

      totalDevices += tokens.length;

      console.log(
        `Sending ${language} notification to ${tokens.length} devices`,
      );

      // ======================================
      // FCM MESSAGE
      // ======================================

      const message = {
        tokens,

        notification: {
          title: content.title,
          body: content.body,

          ...(content.image
            ? {
                imageUrl: content.image,
              }
            : {}),
        },

        data: {
          title: String(content.title),
          body: String(content.body),
          image: String(content.image || ""),
          language: String(language),
          type: "daily_quote",
        },

        android: {
          priority: "high",

          notification: {
            channelId: "quotes",
            sound: "default",

            ...(content.image
              ? {
                  imageUrl: content.image,
                }
              : {}),
          },
        },
      };

      // ======================================
      // SEND
      // ======================================

      const response = await getMessaging().sendEachForMulticast(message);

      console.log(`${language} Success:`, response.successCount);

      console.log(`${language} Failed:`, response.failureCount);

      totalSuccess += response.successCount;
      totalFailed += response.failureCount;

      // ======================================
      // FAILED TOKENS
      // ======================================

      response.responses.forEach((result, index) => {
        if (!result.success) {
          console.log(`FCM Failed [${language}]`);

          console.log("Token:", tokens[index]);

          console.log("Code:", result.error?.code);

          console.log("Message:", result.error?.message);
        }
      });

      languageResults[language] = {
        devices: tokens.length,
        success: response.successCount,
        failed: response.failureCount,
      };
    }

    // ======================================
    // FINAL RESPONSE
    // ======================================

    console.log("\n================================");
    console.log("FCM BROADCAST COMPLETE");
    console.log("Total Devices:", totalDevices);
    console.log("Total Success:", totalSuccess);
    console.log("Total Failed:", totalFailed);
    console.log("================================");

    return res.status(200).json({
      success: true,
      message: "Notifications sent successfully",

      totalDevices,

      totalSuccess,

      totalFailed,

      languages: languageResults,
    });
  } catch (error) {
    console.error("Send Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send notifications",
      error: error.message,
    });
  }
};

// ======================================
// REGISTER / UPDATE DEVICE
// ======================================

const registerDevice = async (req, res) => {
  try {
    const { userId, fcmToken, platform, language = "English" } = req.body || {};

    // ======================================
    // VALIDATION
    // ======================================

    if (!fcmToken || !platform) {
      return res.status(400).json({
        success: false,
        message: "fcmToken and platform are required",
      });
    }

    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Platform must be android or ios",
      });
    }

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // USER ID VALIDATION
    // ======================================

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // ======================================
    // FIND EXISTING TOKEN
    // ======================================

    let notification = await Notification.findOne({
      fcmToken,
    });

    // ======================================
    // UPDATE DEVICE
    // ======================================

    if (notification) {
      notification.userId = userId || null;

      notification.platform = platform;

      notification.language = language;

      notification.isActive = true;

      notification.lastUsedAt = new Date();

      await notification.save();

      console.log("Device updated:", language);

      return res.status(200).json({
        success: true,
        message: "Device updated successfully",
        notification,
      });
    }

    // ======================================
    // CREATE DEVICE
    // ======================================

    notification = await Notification.create({
      userId: userId || null,

      fcmToken,

      platform,

      language,

      isActive: true,

      lastUsedAt: new Date(),
    });

    console.log("Device registered:", language);

    return res.status(201).json({
      success: true,
      message: "Device registered successfully",
      notification,
    });
  } catch (error) {
    console.error("Register Device Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register device",
      error: error.message,
    });
  }
};

// ======================================
// GET USER DEVICES
// ======================================

const getUserDevices = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const devices = await Notification.find({
      userId,
      isActive: true,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      total: devices.length,
      devices,
    });
  } catch (error) {
    console.error("Get User Devices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user devices",
      error: error.message,
    });
  }
};

// ======================================
// DEACTIVATE DEVICE
// ======================================

const deactivateDevice = async (req, res) => {
  try {
    const { fcmToken } = req.body || {};

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: "fcmToken is required",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { fcmToken },
      {
        isActive: false,
        lastUsedAt: new Date(),
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Device deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Device Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate device",
      error: error.message,
    });
  }
};

// ======================================
// EXPORT
// ======================================

module.exports = {
  sendNotification,
  registerDevice,
  getUserDevices,
  deactivateDevice,
};
