const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const allowedLanguages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Portuguese",
  "Italian",
];

// ======================================
// REGISTER / UPDATE DEVICE
// ======================================
const sendNotification = async (req, res) => {
  try {
    const { title, body, image, language } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "title and body are required",
      });
    }

    const notificationData = {
      title,
      body,
      image: image || null,
      language: language || null,
    };

    // Abhi sirf test response
    // Firebase FCM yahan connect karenge

    res.status(200).json({
      success: true,
      message: "Notification data received successfully",
      notification: notificationData,
    });
  } catch (error) {
    console.error("Send Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
};
const registerDevice = async (req, res) => {
  try {
    const { userId, fcmToken, platform, language = "English" } = req.body || {};

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

    // Validate userId if provided
    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Existing device
    let notification = await Notification.findOne({
      fcmToken,
    });

    if (notification) {
      notification.userId = userId || null;
      notification.platform = platform;
      notification.language = language;
      notification.isActive = true;
      notification.lastUsedAt = new Date();

      await notification.save();

      return res.status(200).json({
        success: true,
        message: "Device updated successfully",
        notification,
      });
    }

    // New device
    notification = await Notification.create({
      userId: userId || null,
      fcmToken,
      platform,
      language,
      isActive: true,
      lastUsedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Device registered successfully",
      notification,
    });
  } catch (error) {
    console.error("Register Device Error:", error);

    res.status(500).json({
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

    res.status(200).json({
      success: true,
      total: devices.length,
      devices,
    });
  } catch (error) {
    console.error("Get User Devices Error:", error);

    res.status(500).json({
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
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Device deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Device Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to deactivate device",
      error: error.message,
    });
  }
};

module.exports = {
  sendNotification,
  registerDevice,
  getUserDevices,
  deactivateDevice,
};
