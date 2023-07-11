const express = require('express');
const { enroll, login, createAdmin, getUserById } = require('../controllers/user.controller');
const { authorize } = require('../middleware/auth');
const { registerDefinition } = require('swaggiffy');
const router = express.Router();

router
.post('/enroll',authorize,enroll())
.post('/admin/enroll',createAdmin())
.post('/login',login())
.get('/id',getUserById())
registerDefinition(router, {tags: 'Users', mappedSchema: 'User', basePath: '/user'});
module.exports.userRouter = router;