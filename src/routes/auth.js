const express = require('express');
const { loginControl, singupControl, authControl } = require('../controllers/auth');
const router = express.Router();

router.post('/login-singup', authControl);


module.exports = router