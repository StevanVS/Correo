const express = require('express');
const router = express.Router();

const { getUserEvents, editEvent } = require('../controllers/calendarEvents');

router.get('/users/:userId/events', getUserEvents);
router.put('/users/:userId/events/:eventId', editEvent);

module.exports = router;