const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/index',authController.index);
router.post('/Warehousing',authController.Warehousing);
router.post('/editmaterial',authController.editmaterial);
router.post('/addbom',authController.addbom);
router.post('/purchase',authController.purchase);
router.post('/haha',authController.haha);


module.exports = router;