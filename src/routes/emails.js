const express = require('express');
const {
    getEmails, getEmailsFrom, getEmailsTo, getEmail, sendEmail, deleteEmail, getUserEmails,getHistoryId, changeEmailLabel
} = require('../controllers/emails');

const router = express.Router();

router.get('/emails', getEmails);
router.get('/emails/from/:userId', getEmailsFrom);
router.get('/emails/to/:userId', getEmailsTo);
router.get('/emails/:emailId', getEmail);
router.post('/emails/send', sendEmail);
router.delete('/emails/:emailId', deleteEmail);


router.get('/users/:userId/historyId', getHistoryId);
router.get('/users/:userId/emails', getUserEmails);
router.patch('/users/:userId/emails', changeEmailLabel);

module.exports = router;