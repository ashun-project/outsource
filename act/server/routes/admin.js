var express = require('express');
var router = express.Router();
var mutipart= require('connect-multiparty');
var mutipartMiddeware = mutipart({
    uploadDir: './public/tmp'
});

var adminDao = require('../dao/adminDao');
/* GET users listing. */
router.post('/admin/login', function (req, res, next) {
    adminDao.login(req, res, next);
});

router.post('/admin/loginOut', function (req, res, next) {
    adminDao.loginOut(req, res, next);
});

router.post('/admin/userList', function (req, res, next) {
    adminDao.queryUserAll(req, res, next);
});

router.post('/admin/updatePassword', function (req, res, next) {
    adminDao.updatePassword(req, res, next);
});

router.post('/admin/commentList', function (req, res, next) {
    adminDao.queryCommentAll(req, res, next);
});

router.post('/admin/updateCont', function (req, res, next) {
    adminDao.updateCont(req, res, next);
});

router.post('/admin/deleteComment', function (req, res, next) {
    adminDao.deleteComment(req, res, next);
});

router.post('/admin/collectList', function (req, res, next) {
    adminDao.queryCollectAll(req, res, next);
});

router.post('/admin/dzList', function (req, res, next) {
    adminDao.queryDzAll(req, res, next);
});

router.post('/admin/bannerList', function (req, res, next) {
    adminDao.queryBannerAll(req, res, next);
});

router.post('/admin/addBanner', function (req, res, next) {
    adminDao.addBanner(req, res, next);
});

router.post('/admin/deleteBanner', function (req, res, next) {
    adminDao.deleteBanner(req, res, next);
});

router.post('/admin/noticeList', function (req, res, next) {
    adminDao.queryNoticeAll(req, res, next);
});

router.post('/admin/addNotice', function (req, res, next) {
    adminDao.addNotice(req, res, next);
});

router.post('/admin/deleteNotice', function (req, res, next) {
    adminDao.deleteNotice(req, res, next);
});

router.post('/admin/noteList', function (req, res, next) {
    adminDao.queryNoteAll(req, res, next);
});

router.post('/admin/zodiacList', function (req, res, next) {
    adminDao.queryZodiacAll(req, res, next);
});

router.post('/admin/downloadImg', function (req, res, next) {
    adminDao.downloadImg(req, res, next);
});

router.post('/admin/editImg', function (req, res, next) {
    adminDao.editImg(req, res, next);
});

router.post('/admin/examine', function (req, res, next) {
    adminDao.examine(req, res, next);
});

router.post('/admin/updateExamine', function (req, res, next) {
    adminDao.updateExamine(req, res, next);
});

router.post('/admin/getExamineStatus', function (req, res, next) {
    adminDao.getExamineStatus(req, res, next);
});

router.post('/admin/upload',mutipartMiddeware,function (req,res) {  
    var fileName = '';
    var code = 1;
    if (req.files && req.files.file && req.files.file.path) {
        code = 0;
        fileName = req.files.file.path.replace(/\\/g, '\/').replace('public/tmp/', '');
    };
    res.json({code: code, fileName: fileName});
});








module.exports = router;
