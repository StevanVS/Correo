const express = require('express');
const router = express.Router();

const { getUserEvents, createEvent, editEvent } = require('../controllers/calendarEvents');

router.get('/users/:userId/events', getUserEvents);
router.post('/users/:userId/events', createEvent);
router.put('/users/:userId/events/:eventId', editEvent);

module.exports = router;