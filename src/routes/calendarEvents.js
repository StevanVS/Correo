const express = require('express');
const router = express.Router();

const { getUserEvents, createEvent, editEvent, deleteEvent } = require('../controllers/calendarEvents');

router.get('/users/:userId/events', getUserEvents);
router.post('/users/:userId/events', createEvent);
router.put('/users/:userId/events/:eventId', editEvent);
router.delete('/users/:userId/events/:eventId', deleteEvent);

module.exports = router;