const express = require('express');
const router = express.router();
const userController = require('../controllers/user');

router.post('/login', userController.login);
// router.get('/profile', userController.profile);
// router.put('/user/:id', userController.update);
router.get('/dashboard', userController.index);

module.exports = router