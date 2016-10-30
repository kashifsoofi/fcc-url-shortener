'use strict';
var mongoose = require('mongoose');

var urlInfoSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
}, { capped: { size: 1048576, max: 1000 }});

var UrlInfo = mongoose.model('UrlInfo', urlInfoSchema);

module.exports = UrlInfo;