const express = require('express');
const { loginControl, singupControl } = require('../controllers/auth');
const router = express.Router();

router.post('/login', loginControl);
router.post('/singup', singupControl);


module.exports = router