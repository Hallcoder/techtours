const express = require('express');
const { enroll } = require('../controllers/user.controller');
const router = express.Router();

router
.post('/admin/enroll',enroll())

module.exports.userRouter = router;