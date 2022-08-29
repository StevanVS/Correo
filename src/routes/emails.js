const express = require("express");
const {
    getEmails,
    getEmail,
    sendEmail,
    deleteEmail,
    getUserEmails,
    getHistoryId,
    changeEmailLabel,
    editEmail,
    deleteEmails,
    editEmails,
    sendEmails,
} = require("../controllers/emails");

const router = express.Router();

router.get("/emails", getEmails);
router.get("/emails/:emailId", getEmail);
router.post("/emails/send", sendEmail);
router.delete("/users/:userId/emails/:emailId", deleteEmail);

router.get("/users/:userId/historyId", getHistoryId);
// router.get('/users/:userId/emails', getUserEmails);
router.get("/users/:userId/emails/:labelId", getUserEmails);
router.patch("/users/:userId/emails", changeEmailLabel);
router.put("/users/:userId/emails/:emailId", editEmail);

router
    .route("/users/:userId/emails")
    .post(sendEmails)
    .put(editEmails)
    .delete(deleteEmails);

module.exports = router;
