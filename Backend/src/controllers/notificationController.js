const mongoose = require("mongoose");

const { getMessaging } = require("firebase-admin/messaging");

const NotificationToken = require("../models/NotificationTokens");
const Notification = require("../models/Notification");
const User = require("../models/User");
// Firebase initialize
require("../config/firebase");

const allowedLanguages = ["English", "Hindi"];

// =====================================================
// GET QUOTE TEXT
// =====================================================

const getQuoteText = (quote, language) => {
  // Direct language
  if (quote.language === language && quote.text) {
    return String(quote.text);
  }

  // Mongoose Map
  if (quote.translations && typeof quote.translations.get === "function") {
    const translatedText = quote.translations.get(language);

    if (translatedText) {
      return String(translatedText);
    }
  }

  // Normal object
  if (quote.translations && typeof quote.translations === "object") {
    const translatedText = quote.translations[language];

    if (translatedText) {
      return String(translatedText);
    }
  }

  return "";
};

// =====================================================
// REGISTER / UPDATE DEVICE
// =====================================================
const registerDevice = async (req, res) => {
  try {
    const { userId, fcmToken, platform, language = "English" } = req.body;

    console.log("📱 REGISTER DEVICE REQUEST:", {
      userId,
      fcmToken: fcmToken ? "Available" : "Missing",
      platform,
      language,
    });

    if (!userId || !fcmToken) {
      return res.status(400).json({
        success: false,
        message: "userId and fcmToken are required",
      });
    }

    if (!["English", "Hindi"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
      });
    }

    const device = await NotificationToken.findOneAndUpdate(
      { fcmToken },
      {
        userId,
        fcmToken,
        platform,
        language,
        isActive: true,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log("✅ DEVICE REGISTERED:", {
      id: device._id,
      userId: device.userId,
      language: device.language,
      platform: device.platform,
      isActive: device.isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Device registered successfully",
      device: {
        id: device._id,
        userId: device.userId,
        fcmToken: device.fcmToken,
        platform: device.platform,
        language: device.language,
        isActive: device.isActive,
      },
    });
  } catch (error) {
    console.error("❌ Register Device Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register device",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER DEVICES
// =====================================================

const getUserDevices = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const devices = await NotificationToken.find({
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
    console.error("❌ Get User Devices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user devices",
      error: error.message,
    });
  }
};

// =====================================================
// DEACTIVATE DEVICE
// =====================================================

const deactivateDevice = async (req, res) => {
  try {
    const { fcmToken } = req.body || {};

    if (!fcmToken || !fcmToken.trim()) {
      return res.status(400).json({
        success: false,
        message: "fcmToken is required",
      });
    }

    const device = await NotificationToken.findOneAndUpdate(
      {
        fcmToken: fcmToken.trim(),
      },
      {
        $set: {
          isActive: false,
          lastUsedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    if (!device) {
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
    console.error("❌ Deactivate Device Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate device",
      error: error.message,
    });
  }
};

// =====================================================
// SEND LOCALIZED NOTIFICATION
// =====================================================

const sendNotification = async (req, res) => {
  try {
    console.log("\n==============================================");
    console.log("🔥 SEND NOTIFICATION STARTED");
    console.log("==============================================");

    const {
      quoteId,
      title = {
        English: "Today's Thought",
        Hindi: "आज का विचार",
      },
      body,
      type = "general",
      image = "",
    } = req.body || {};

    // =====================================================
    // GET QUOTE + TRANSLATIONS
    // =====================================================

    let localizedBody = {
      English: "",
      Hindi: "",
    };

    let finalImage = image || "";

    if (quoteId) {
      console.log("🔎 QUOTE ID:", quoteId);

      if (!mongoose.Types.ObjectId.isValid(quoteId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid quoteId",
        });
      }

      const quote = await mongoose.model("Quote").findById(quoteId).lean();

      if (!quote) {
        return res.status(404).json({
          success: false,
          message: "Quote not found",
        });
      }

      console.log("📝 QUOTE TEXT:", quote.text);
      console.log("🌐 QUOTE LANGUAGE:", quote.language);

      // -----------------------------------------------
      // ENGLISH
      // -----------------------------------------------

      let englishText = "";

      if (quote.translations && typeof quote.translations === "object") {
        englishText = quote.translations.English || "";
      }

      if (!englishText && quote.language === "English") {
        englishText = quote.text || "";
      }

      if (!englishText) {
        englishText = quote.text || "";
      }

      // -----------------------------------------------
      // HINDI
      // -----------------------------------------------

      let hindiText = "";

      if (quote.translations && typeof quote.translations === "object") {
        hindiText = quote.translations.Hindi || "";
      }

      // Agar Hindi translation nahi hai
      // to English fallback
      if (!hindiText) {
        hindiText = englishText;
      }

      localizedBody = {
        English: String(englishText).trim(),
        Hindi: String(hindiText).trim(),
      };

      if (!finalImage) {
        finalImage = quote.image || "";
      }

      console.log("🇬🇧 ENGLISH:", localizedBody.English);
      console.log("🇮🇳 HINDI:", localizedBody.Hindi);
      console.log("🖼️ IMAGE:", finalImage || "NO IMAGE");
    } else {
      // =====================================================
      // BACKWARD COMPATIBILITY
      // =====================================================

      if (body && typeof body === "object" && !Array.isArray(body)) {
        localizedBody = {
          English: String(body.English || "").trim(),

          Hindi: String(body.Hindi || body.English || "").trim(),
        };
      } else {
        const text = String(body || "").trim();

        localizedBody = {
          English: text || "Keep working hard, success will surely come.",

          Hindi: text || "कड़ी मेहनत करते रहें, सफलता जरूर मिलेगी।",
        };
      }
    }

    // =====================================================
    // LOCALIZED TITLE
    // =====================================================

    let localizedTitle = {
      English: "Today's Thought",
      Hindi: "आज का विचार",
    };

    if (title && typeof title === "object" && !Array.isArray(title)) {
      localizedTitle = {
        English: String(title.English || "Today's Thought").trim(),

        Hindi: String(title.Hindi || "आज का विचार").trim(),
      };
    } else if (typeof title === "string") {
      localizedTitle = {
        English: title.trim() || "Today's Thought",
        Hindi: "आज का विचार",
      };
    }

    console.log("\n==============================================");
    console.log("🌐 LOCALIZED CONTENT");
    console.log("==============================================");
    console.log("🇬🇧 TITLE:", localizedTitle.English);
    console.log("🇮🇳 TITLE:", localizedTitle.Hindi);
    console.log("🇬🇧 BODY:", localizedBody.English);
    console.log("🇮🇳 BODY:", localizedBody.Hindi);

    // =====================================================
    // GET ACTIVE DEVICES
    // =====================================================

    const devices = await NotificationToken.find({
      isActive: true,

      language: {
        $in: allowedLanguages,
      },

      fcmToken: {
        $exists: true,
        $type: "string",
        $ne: "",
      },
    }).lean();

    console.log("\n==============================================");
    console.log("📱 DEVICES FOUND:", devices.length);
    console.log("==============================================");

    if (!devices.length) {
      return res.status(404).json({
        success: false,
        message: "No active devices found",
      });
    }

    // =====================================================
    // GROUP BY LANGUAGE
    // =====================================================

    const englishDevices = devices.filter(
      (device) => device.language === "English",
    );

    const hindiDevices = devices.filter(
      (device) => device.language === "Hindi",
    );

    console.log("🇬🇧 ENGLISH DEVICES:", englishDevices.length);

    console.log("🇮🇳 HINDI DEVICES:", hindiDevices.length);

    // =====================================================
    // SEND TO LANGUAGE
    // =====================================================

    const sendToLanguage = async (language, languageDevices) => {
      if (!languageDevices.length) {
        return {
          totalDevices: 0,
          successCount: 0,
          failureCount: 0,
        };
      }

      // ===================================================
      // UNIQUE FCM TOKENS
      // ===================================================

      const tokens = [
        ...new Set(
          languageDevices
            .map((device) => device.fcmToken?.trim())
            .filter(Boolean),
        ),
      ];

      console.log("\n==============================================");
      console.log("📤 PREPARING FCM");
      console.log("==============================================");
      console.log("🌐 LANGUAGE:", language);
      console.log("📱 TOKEN COUNT:", tokens.length);

      if (!tokens.length) {
        return {
          totalDevices: 0,
          successCount: 0,
          failureCount: 0,
        };
      }

      // ===================================================
      // SELECT LANGUAGE TEXT
      // ===================================================

      const notificationTitle =
        language === "Hindi" ? localizedTitle.Hindi : localizedTitle.English;

      const notificationBody =
        language === "Hindi" ? localizedBody.Hindi : localizedBody.English;

      console.log("📝 TITLE:", notificationTitle);
      console.log("📝 BODY:", notificationBody);
      console.log("🖼️ IMAGE:", finalImage || "NO IMAGE");

      // ===================================================
      // SAVE HISTORY
      // ===================================================

      const userIds = [
        ...new Set(
          languageDevices
            .map((device) => (device.userId ? device.userId.toString() : null))
            .filter(Boolean),
        ),
      ];

      if (userIds.length) {
        const notifications = userIds.map((userId) => ({
          userId,

          title: notificationTitle,

          body: notificationBody,

          language,

          type,

          data: {
            language,
            quoteId: quoteId ? String(quoteId) : "",

            image: String(finalImage || ""),
          },

          isRead: false,
        }));

        await Notification.insertMany(notifications);

        console.log(`✅ ${language} HISTORY SAVED:`, notifications.length);
      }

      // ===================================================
      // FCM MESSAGE
      // ===================================================

      const message = {
        tokens,

        notification: {
          title: notificationTitle,
          body: notificationBody,
        },

        data: {
          title: String(notificationTitle),

          body: String(notificationBody),

          language: String(language),

          type: String(type),

          quoteId: quoteId ? String(quoteId) : "",

          image: String(finalImage || ""),
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

      // ===================================================
      // IMAGE
      // ===================================================

      if (finalImage) {
        message.notification.imageUrl = finalImage;

        message.android.notification.imageUrl = finalImage;

        message.apns.fcmOptions = {
          imageUrl: finalImage,
        };
      }

      // ===================================================
      // SEND FCM
      // ===================================================

      const response = await getMessaging().sendEachForMulticast(message);

      console.log(`🔥 ${language} SUCCESS:`, response.successCount);

      console.log(`❌ ${language} FAILED:`, response.failureCount);

      // ===================================================
      // DELETE INVALID TOKENS
      // ===================================================

      for (let i = 0; i < response.responses.length; i++) {
        const result = response.responses[i];

        if (!result.success) {
          const failedToken = tokens[i];

          console.log("❌ FCM TOKEN FAILED:", failedToken);

          console.log(
            "❌ FCM ERROR:",
            result.error?.code,
            result.error?.message,
          );

          if (
            result.error?.code ===
              "messaging/registration-token-not-registered" ||
            result.error?.code === "messaging/invalid-registration-token"
          ) {
            await NotificationToken.deleteOne({
              fcmToken: failedToken,
            });

            console.log("🗑️ Invalid FCM token deleted");
          }
        }
      }

      return {
        totalDevices: tokens.length,

        successCount: response.successCount,

        failureCount: response.failureCount,
      };
    };

    // =====================================================
    // SEND ENGLISH
    // =====================================================

    const englishResult = await sendToLanguage("English", englishDevices);

    // =====================================================
    // SEND HINDI
    // =====================================================

    const hindiResult = await sendToLanguage("Hindi", hindiDevices);

    // =====================================================
    // TOTAL
    // =====================================================

    const totalDevices = englishResult.totalDevices + hindiResult.totalDevices;

    const successCount = englishResult.successCount + hindiResult.successCount;

    const failureCount = englishResult.failureCount + hindiResult.failureCount;

    console.log("\n==============================================");
    console.log("🎉 NOTIFICATION COMPLETED");
    console.log("==============================================");
    console.log("TOTAL:", totalDevices);
    console.log("SUCCESS:", successCount);
    console.log("FAILED:", failureCount);
    console.log("🇬🇧 ENGLISH:", englishResult);
    console.log("🇮🇳 HINDI:", hindiResult);
    console.log("==============================================");

    return res.status(200).json({
      success: true,

      message: "Localized notifications sent successfully",

      totalDevices,

      successCount,

      failureCount,

      languages: {
        English: englishResult,
        Hindi: hindiResult,
      },
    });
  } catch (error) {
    console.error("\n❌ SEND NOTIFICATION ERROR:");

    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Failed to send notification",

      error: error.message,
    });
  }
};

// =====================================================
// GET NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const notifications = await Notification.find({
      userId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      total: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("❌ Get Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message,
    });
  }
};
// =====================================================
// UPDATE NOTIFICATION SETTINGS
// =====================================================

const updateNotificationSettings = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    // JWT ke andar field userId hai
    const userId = req.user?.userId;

    console.log("USER ID:", userId);

    // Validate MongoDB ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const { dailyQuote, notificationTime, timezone } = req.body;

    // Validate notification time
    if (
      notificationTime &&
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(notificationTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification time. Use HH:mm format.",
      });
    }

    // Validate timezone
    if (timezone) {
      try {
        Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid timezone",
        });
      }
    }

    const updateData = {};

    if (typeof dailyQuote === "boolean") {
      updateData["notificationSettings.dailyQuote"] = dailyQuote;
    }

    if (notificationTime) {
      updateData["notificationSettings.notificationTime"] = notificationTime;
    }

    if (timezone) {
      updateData["notificationSettings.timezone"] = timezone;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("notificationSettings");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("UPDATED SETTINGS:", user.notificationSettings);

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: user.notificationSettings,
    });
  } catch (error) {
    console.error("UPDATE NOTIFICATION SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification settings",
      error: error.message,
    });
  }
};
// =====================================================
// GET UNREAD COUNT
// =====================================================

const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("❌ Get Unread Count Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message,
    });
  }
};

// =====================================================
// MARK SINGLE AS READ
// =====================================================

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("❌ Mark Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await Notification.updateMany(
      {
        userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return res.status(200).json({
      success: true,

      message: "All notifications marked as read",

      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("❌ Mark All Read Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerDevice,
  getUserDevices,
  deactivateDevice,
  sendNotification,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateNotificationSettings,
  getQuoteText,
};
