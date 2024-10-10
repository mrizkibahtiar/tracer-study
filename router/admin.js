const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isAdmin } = require('../middleware/auth');


router.get('/admin', isAdmin, adminController.index);
router.get('/admin/alumni-form', isAdmin, adminController.alumniForm);


module.exports = router;