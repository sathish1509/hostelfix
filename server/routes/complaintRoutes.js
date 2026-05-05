const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');
const { verifyToken, isAdmin, isWarden } = require('../middleware/auth');

router.post('/', verifyToken, complaintsController.createComplaint);
router.get('/my', verifyToken, complaintsController.getMyComplaints);
router.get('/all', verifyToken, isAdmin, complaintsController.getAllComplaints);
router.get('/warden', verifyToken, isWarden, complaintsController.getWardenComplaints);
router.put('/:id/status', verifyToken, isWarden, complaintsController.updateStatus);
router.get('/stats', verifyToken, isAdmin, complaintsController.getStats);

module.exports = router;
