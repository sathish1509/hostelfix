const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, roomsController.getAllRooms);
router.post('/', verifyToken, isAdmin, roomsController.addRoom);
router.put('/:id', verifyToken, isAdmin, roomsController.updateRoom);

module.exports = router;
