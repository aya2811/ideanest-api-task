const express = require('express');
const { signUp, signIn, refreshToken} = require('../controller/userController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/refresh-token',refreshToken);

module.exports = router;