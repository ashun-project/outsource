var express = require('express');
var router = express.Router();

var loginDao = require('../dao/loginDao');
/* GET users listing. */
router.post('/admin/login', function (req, res, next) {
    loginDao.login(req, res, next);
});

router.post('/admin/loginOut', function (req, res, next) {
    loginDao.loginOut(req, res, next);
});

router.post('/admin/loginInfo', function (req, res, next) {
    loginDao.loginInfo(req, res, next);
});

module.exports = router;
