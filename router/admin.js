const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/admin', adminController.index);
router.get('/admin/alumni-form', adminController.alumniForm);


module.exports = router;