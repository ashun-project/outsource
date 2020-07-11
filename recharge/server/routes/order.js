var express = require('express');
var router = express.Router();

var orderDao = require('../dao/orderDao');
/* GET users listing. */
router.post('/admin/orderList', function (req, res, next) {
    orderDao.queryAll(req, res, next);
});

router.post('/admin/createOrder', function (req, res, next) {
    orderDao.createOrder(req, res, next);
});

router.post('/admin/updateOrder', function (req, res, next) {
    orderDao.updateOrder(req, res, next);
});

module.exports = router;
