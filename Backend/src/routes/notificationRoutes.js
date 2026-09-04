const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/notificationController");

const verifyToken = require("../middleware/verifyToken");

// =====================================================
// DEVICE / FCM
// =====================================================

router.post("/register-device", registerDevice);

router.get("/user/:userId", getUserDevices);

router.put("/deactivate", deactivateDevice);

router.put("/notification-settings", verifyToken, updateNotificationSettings);

// =====================================================
// SEND NOTIFICATION
// =====================================================

router.post("/send", sendNotification);

// =====================================================
// NOTIFICATION HISTORY
// =====================================================

router.get("/history/:userId", getNotifications);

// =====================================================
// UNREAD COUNT
// =====================================================

router.get("/unread-count/:userId", getUnreadCount);

// =====================================================
// MARK ALL READ
// =====================================================

router.put("/read-all/:userId", markAllNotificationsAsRead);

// =====================================================
// MARK SINGLE READ
// =====================================================

router.put("/:id/read", markNotificationAsRead);

// =====================================================
// DELETE
// =====================================================

router.delete("/:id", deleteNotification);

module.exports = router;
