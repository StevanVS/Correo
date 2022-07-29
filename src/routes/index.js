const express = require('express');

const users = require('./users');
const emails = require('./emails');
const drafts = require('./drafts');

const router = express.Router();

router.use(users);
router.use(emails);
router.use(drafts);

module.exports = router;