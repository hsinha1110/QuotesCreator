const mongoose = require("mongoose");

const { getMessaging } = require("firebase-admin/messaging");

const NotificationToken = require("../models/NotificationTokens");
const Notification = require("../models/Notification");
const Quote = require("../models/Quote");

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
    const {
      userId = null,
      fcmToken,
      platform,
      language = "English",
    } = req.body || {};

    console.log("====================================");
    console.log("🔥 REGISTER DEVICE");
    console.log("userId:", userId);
    console.log("platform:", platform);
    console.log("language:", language);
    console.log("FCM token:", fcmToken);
    console.log("====================================");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!fcmToken || !fcmToken.trim()) {
      return res.status(400).json({
        success: false,
        message: "fcmToken is required",
      });
    }

    if (!platform) {
      return res.status(400).json({
        success: false,
        message: "platform is required",
      });
    }

    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Platform must be android or ios",
      });
    }

    // ==========================================
    // LANGUAGE
    // ==========================================

    if (!["English", "Hindi"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages: ["English", "Hindi"],
      });
    }

    // ==========================================
    // USER ID
    // ==========================================

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const token = fcmToken.trim();

    // ==========================================
    // FIND TOKEN
    // ==========================================

    let device = await NotificationToken.findOne({
      fcmToken: token,
    });

    // ==========================================
    // UPDATE EXISTING DEVICE
    // ==========================================

    if (device) {
      device.userId = userId || null;
      device.platform = platform;
      device.language = language;
      device.isActive = true;
      device.lastUsedAt = new Date();

      await device.save();

      console.log("✅ DEVICE UPDATED");
      console.log("Device ID:", device._id);
      console.log("Language:", device.language);

      return res.status(200).json({
        success: true,
        message: "Device updated successfully",
        device,
      });
    }

    // ==========================================
    // CREATE DEVICE
    // ==========================================

    device = await NotificationToken.create({
      userId: userId || null,
      fcmToken: token,
      platform,
      language,
      isActive: true,
      lastUsedAt: new Date(),
    });

    console.log("✅ DEVICE REGISTERED");
    console.log("Device ID:", device._id);
    console.log("Language:", device.language);

    return res.status(201).json({
      success: true,
      message: "Device registered successfully",
      device,
    });
  } catch (error) {
    console.error("❌ REGISTER DEVICE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "FCM token already registered",
      });
    }

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
// SEND DAILY QUOTE
// =====================================================
const sendNotification = async (req, res) => {
  try {
    console.log("\n====================================");
    console.log("🔥 SEND NOTIFICATION STARTED");
    console.log("====================================");

    const {
      title = "Today's Thought",
      body = "Keep working hard, success will surely come.",
      language = "English",
      type = "general",
      image = "",
    } = req.body || {};

    console.log("🔥 TITLE:", title);
    console.log("🔥 BODY:", body);
    console.log("🔥 LANGUAGE:", language);

    // ==========================================
    // GET ACTIVE DEVICES
    // ==========================================

    const devices = await NotificationToken.find({
      language,
      isActive: true,
      fcmToken: {
        $exists: true,
        $type: "string",
        $ne: "",
      },
    });

    console.log("🔥 ACTIVE DEVICES:", devices.length);

    if (!devices.length) {
      return res.status(404).json({
        success: false,
        message: "No active devices found",
      });
    }

    // ==========================================
    // UNIQUE TOKENS
    // ==========================================

    const tokens = [
      ...new Set(
        devices.map((device) => device.fcmToken?.trim()).filter(Boolean),
      ),
    ];

    console.log("🔥 UNIQUE FCM TOKENS:", tokens.length);

    if (!tokens.length) {
      return res.status(404).json({
        success: false,
        message: "No valid FCM tokens found",
      });
    }

    // ==========================================
    // SAVE NOTIFICATION HISTORY
    // ==========================================

    const userIds = [
      ...new Set(
        devices
          .map((device) => (device.userId ? device.userId.toString() : null))
          .filter(Boolean),
      ),
    ];

    console.log("🔥 USERS:", userIds.length);

    if (userIds.length) {
      const notifications = userIds.map((userId) => ({
        userId,
        title,
        body,
        type,

        data: {
          language,
          image,
        },

        isRead: false,
      }));

      await Notification.insertMany(notifications);

      console.log("✅ NOTIFICATION HISTORY SAVED:", notifications.length);
    }

    // ==========================================
    // FCM MESSAGE
    // ==========================================

    const message = {
      tokens,

      notification: {
        title,
        body,
      },

      data: {
        title: String(title),
        body: String(body),
        language: String(language),
        type: String(type),
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

    // ==========================================
    // IMAGE
    // ==========================================

    if (image) {
      message.notification.imageUrl = image;

      message.android.notification.imageUrl = image;

      message.apns.fcmOptions = {
        imageUrl: image,
      };
    }

    // ==========================================
    // SEND FCM
    // ==========================================

    console.log("🔥 SENDING FCM TO:", tokens.length, "DEVICES");

    const response = await getMessaging().sendEachForMulticast(message);

    console.log("🔥 FCM SUCCESS:", response.successCount);

    console.log("❌ FCM FAILED:", response.failureCount);

    // ==========================================
    // INVALID TOKEN CLEANUP
    // ==========================================

    for (let i = 0; i < response.responses.length; i++) {
      const result = response.responses[i];

      if (!result.success) {
        const failedToken = tokens[i];

        console.log("❌ FCM TOKEN FAILED:", failedToken);

        console.log("❌ FCM ERROR:", result.error?.code, result.error?.message);

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

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Notification sent",

      totalDevices: tokens.length,

      successCount: response.successCount,

      failureCount: response.failureCount,
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
};
