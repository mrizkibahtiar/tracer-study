const express = require('express');
const router = express.Router();
const userController = require('../controllers/alumni');
const { isAlumni } = require('../middleware/auth');

// router.get('alumni/profile', userController.profile);
// router.put('alumni/user/:id', userController.update);
router.get('/alumni', isAlumni, userController.index);
router.get('/alumni/profile', isAlumni, userController.profile)

router.get('/alumni/alumni-form', isAlumni, userController.showForm)
router.post('/alumni/alumni-form/:nisn', isAlumni, userController.saveForm1)

router.route('/alumni/alumni-form2-kursus/:nisn')
    .get(isAlumni, userController.showForm2Kursus)
// .post(isAlumni, userController.saveForm2Kursus)


// router.get('/alumni/alumni-form3/:nisn', isAlumni, userController.showForm3)
// router.post('/alumni/alumni-form3/:nisn', isAlumni, userController.saveForm3)

module.exports = router