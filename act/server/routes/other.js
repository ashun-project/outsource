var express = require('express');
var router = express.Router();
var otherDao = require('../dao/otherDao');

router.post('/am/dianzhang', function (req,res, next) {
    otherDao.dianzhang(req, res, next);
});

router.post('/am/dlDianzhang', function (req,res, next) {
    otherDao.dlDianzhang(req, res, next);
});

router.post('/am/dianzhangList', function (req,res, next) {
    otherDao.dianzhangList(req, res, next);
});

router.post('/am/collectList', function (req,res, next) {
    otherDao.collectList(req, res, next);
});

router.post('/am/addCollect', function (req,res, next) {
    otherDao.addCollect(req, res, next);
});

router.post('/am/dlCollect', function (req,res, next) {
    otherDao.dlCollect(req, res, next);
});

router.post('/am/addComment', function (req,res, next) {
    otherDao.addComment(req, res, next);
});

router.post('/am/commentList', function (req,res, next) {
    otherDao.commentList(req, res, next);
});

router.post('/am/bannerList', function (req,res, next) {
    otherDao.bannerList(req, res, next);
});

router.post('/am/noticeList', function (req,res, next) {
    otherDao.noticeList(req, res, next);
});

module.exports = router;
