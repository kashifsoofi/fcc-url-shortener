'use strict';
var express = require("express");
var router = express.Router();

var mongoose = require('mongoose');
var urlInfo = require('../models/UrlInfo.js');

router.get('/new', function(req, res) {
    var appUrl = req.protocol + '://' + req.get('host') + '/';
    res.render('index', {
        appUrl: appUrl,
        error: 'Error: You need to provide a proper url.'
    });
});

router.get('/:url', function (req, res) {
    var url = '' + req.params.url;
    urlInfo.findOne({ short_url: url }, function (err, result) {
        if (err) {
            throw err;
        }
        
        if (result) {
            var urlInfoObj = result.toObject();
            console.log('Found: ' + urlInfoObj);
            console.log('Redirecting to: ' + urlInfoObj.original_url);
            res.redirect(301, urlInfoObj.original_url);
        }
        else {
            res.json({
                'error': 'Site not found'
            });
        }
    });
});

router.get('/new/:url*', function (req, res) {
    var appUrl = req.protocol + '://' + req.get('host') + '/';
    var url = req.url.slice(5);
    if (validateUrl(url)) {
        urlInfo.findOne({ original_url: url }, function (err, result) {
           if (err) {
               throw err;
           }
           
           if (result) {
               var urlInfoObj = result.toObject();
               console.log(url + 'already registered.');
               res.json({
                   original_url: urlInfoObj.original_url,
                   short_url: appUrl + urlInfoObj.short_url
               });
           }
           else {
               var short_link = generateShortLink();
               var urlInfoToSave = new urlInfo({
                   original_url: url,
                   short_url: short_link
               });
               
               urlInfoToSave.save(function (err, objSaved) {
                   if (err) {
                       throw err;
                   }
                   
                   console.log('Saved: ', objSaved);
                   res.json({
                       original_url: objSaved.original_url,
                       short_link: appUrl + objSaved.short_url
                   });
               });
           }
        });
    }
    else {
        res.json({
           error: 'Invalid URL, please make sure you have a valid protocol, sitename and domain.' 
        });
    }
});

function generateShortLink() {
    // Generates random four digit number for link
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 4);
}

function validateUrl(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

module.exports = router;