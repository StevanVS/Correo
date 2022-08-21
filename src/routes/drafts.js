const express = require('express');
const {
    getDrafts, getDraft, createDraft, editDraft, deleteDraft, getDraftsFrom
} = require('../controllers/drafts');

const router = express.Router();

router.get('/emails/drafts', getDrafts);
router.get('/emails/drafts/:draftId', getDraft);
router.put('/emails/drafts', editDraft);
router.get('/emails/drafts/from/:userId', getDraftsFrom);

router.post('/users/:userId/drafts', createDraft);
router.delete('/users/:userId/drafts/:draftId', deleteDraft);

module.exports = router;