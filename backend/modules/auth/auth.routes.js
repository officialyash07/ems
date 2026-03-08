const express = require('express');

const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

module.exports = router;
