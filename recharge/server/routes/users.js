var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');
/* GET users listing. */
router.post('/admin/userList', function (req, res, next) {
    userDao.queryAll(req, res, next);
});

router.post('/admin/updatePassword', function (req, res, next) {
    userDao.updatePassword(req, res, next);
});

router.post('/admin/updateAmount', function (req, res, next) {
    userDao.updateAmount(req, res, next);
});

router.post('/admin/addUser', function (req, res, next) {
    userDao.addUser(req, res, next);
});

module.exports = router;
