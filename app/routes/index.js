'use strict';
var express = require("express");
var router = express.Router();

router.get('/', function (req, res) {
    var appUrl = req.protocol + '://' + req.get('host') + '/';
    res.render('index', { appUrl: appUrl });
});

module.exports = router;