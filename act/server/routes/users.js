var express = require('express');
var router = express.Router();
var mutipart= require('connect-multiparty');
var mutipartMiddeware = mutipart({
    uploadDir: './public/tmp'
});

var userDao = require('../dao/userDao');
/* GET users listing. */
router.post('/am/login', function (req, res, next) {
    userDao.login(req, res, next);
});

router.post('/am/register', function (req, res, next) {
    userDao.register(req, res, next);
});

router.post('/am/updatePassword', function (req, res, next) {
    userDao.updatePassword(req, res, next);
});

router.post('/am/upload/tx',mutipartMiddeware,function (req,res, next) {
    userDao.uploadTx(req, res, next);
});

router.post('/am/loginOut', function (req,res, next) {
    userDao.loginOut(req, res, next);
});

module.exports = router;
