const express = require('express');
const router = express.Router();
const userController = require('../controllers/alumni');


// router.get('alumni/profile', userController.profile);
// router.put('alumni/user/:id', userController.update);
router.get('/alumni', userController.index);

module.exports = router