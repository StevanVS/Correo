const express = require('express');
const { authControl, logoutControl, } = require('../controllers/auth');
const router = express.Router();

router.post('/login-singup', authControl);
router.get('/logout', logoutControl)


module.exports = router