const otpController = require('../controller/otp.controller');
const express = require('express');
const router = express.Router();

router.post("/api/otp-login", otpController.otpLogin);
router.post("/api/otp-verify", otpController.verifyOTP);

module.exports = router;