const express = require('express');

const users = require('./users');
const emails = require('./emails');
const drafts = require('./drafts');
const calendarEvents = require('./calendarEvents');
const { login } = require('../middlewares/auth');

const router = express.Router();

// router.use(login);

router.use(users);
router.use(emails);
router.use(drafts);
router.use(calendarEvents);

module.exports = router;