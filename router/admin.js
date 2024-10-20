const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isAdmin } = require('../middleware/auth');


router.get('/admin', isAdmin, adminController.index);
router.route('/admin/alumni-form')
    .get(isAdmin, adminController.alumniForm)
    .post(isAdmin, adminController.store);

router.get('/admin/alumni-list', isAdmin, adminController.viewAlumniList);
router.get('/admin/alumni-list/:nisn', isAdmin, adminController.viewAlumniDetail);
router.delete('/admin/alumni-list/:nisn', isAdmin, adminController.deleteAlumni);
router.route('/admin/alumni-edit/:nisn')
    .get(isAdmin, adminController.alumniEdit)
    .put(isAdmin, adminController.alumniUpdate);
router.get('/admin/alumni-tracer', isAdmin, adminController.viewAlumniTracer);
router.get('/admin/profile', isAdmin, adminController.profile);
module.exports = router;