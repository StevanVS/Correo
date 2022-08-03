const express = require('express');
const { login } = require('../middlewares/login');
const {
    getUsers, getUser, createUser, editUser, deleteUser, getCurrentUser
} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.put('/users', editUser);
router.delete('/users/:userId', deleteUser);
router.get('/currentuser', login, getCurrentUser)

module.exports = router;