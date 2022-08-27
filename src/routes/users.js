const express = require('express');
const { login } = require('../middlewares/auth');
const {
    getUsers, getUser, createUser, editUser, deleteUser, getCurrentUser, getUserByEmail, getUserLabels
} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
// router.put('/users', editUser);
router.delete('/users/:userId', deleteUser);
router.get('/currentuser', login, getCurrentUser);
router.get('/users/email/:email', getUserByEmail);

router.put('/users/:userId', editUser);

router.get('/users/:userId/labels', getUserLabels);

module.exports = router;