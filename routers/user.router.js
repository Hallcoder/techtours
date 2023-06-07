const express = require('express');
const { enroll, login } = require('../controllers/user.controller');
const { authorize } = require('../middleware/auth');
const router = express.Router();

router
.post('/enroll',authorize,enroll())
.post('/login',login())
module.exports.userRouter = router;