var express = require('express');
var router = express.Router();

var zodiacDao = require('../dao/zodiacDao');
/* GET users listing. */
router.post('/am/zodiacList', function (req, res, next) {
    zodiacDao.queryList(req, res, next);
});

router.post('/am/zodiacType', function (req, res, next) {
    zodiacDao.zodiacType(req, res, next);
});

router.post('/am/zodiacImg', function (req, res, next) {
    zodiacDao.getImg(req, res, next);
});

module.exports = router;
