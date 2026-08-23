const express = require("express");

const router = express.Router();

const {
  registerDevice,
  getUserDevices,
  deactivateDevice,
  sendNotification,
} = require("../controllers/notificationController");

// ======================================
// REGISTER / UPDATE DEVICE
// ======================================

router.post("/register-device", registerDevice);

// ======================================
// GET USER DEVICES
// ======================================

router.get("/user/:userId", getUserDevices);

// ======================================
// DEACTIVATE DEVICE
// ======================================

router.put("/deactivate", deactivateDevice);
router.post("/send", sendNotification);
module.exports = router;
