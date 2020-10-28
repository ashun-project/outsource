var express = require('express');
var router = express.Router();

var noteDao = require('../dao/noteDao');
/* GET users listing. */
router.post('/am/noteList', function (req, res, next) {
    noteDao.queryAll(req, res, next);
});

router.post('/admin/createOrder', function (req, res, next) {
    noteDao.createOrder(req, res, next);
});

router.post('/admin/updateOrder', function (req, res, next) {
    noteDao.updateOrder(req, res, next);
});

module.exports = router;
