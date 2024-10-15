const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { isAdmin, isAlumni } = require('../middleware/auth');


router.post('/login', authController.login);
// router.get('/profile', userController.profile);
// router.put('/user/:id', userController.update);
router.get('/logout', authController.logout);

module.exports = router