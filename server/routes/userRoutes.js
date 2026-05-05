const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, usersController.getAllStudents);
router.get('/profile', verifyToken, usersController.getProfile);
router.put('/profile', verifyToken, usersController.updateProfile);

module.exports = router;
