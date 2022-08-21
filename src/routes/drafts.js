const express = require('express');
const {
    getDrafts, getDraft, createDraft, editDraft, deleteDraft, getDraftsFrom
} = require('../controllers/drafts');

const router = express.Router();

router.get('/emails/drafts', getDrafts);
router.get('/emails/drafts/:draftId', getDraft);
router.post('/emails/drafts', createDraft);
router.put('/emails/drafts', editDraft);
// router.delete('/emails/drafts/:draftId', deleteDraft);
router.get('/emails/drafts/from/:userId', getDraftsFrom);

router.delete('/users/:userId/drafts/:draftId', deleteDraft);

module.exports = router;