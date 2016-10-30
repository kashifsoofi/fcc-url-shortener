var express = require("express");
var path = require("path");
var mongoose = require('mongoose');

var index = require("./app/routes/index.js");
var url_shortener = require("./app/routes/url_shortener.js");

var app = express();
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener-app', function (err) {
  if (err) {
    throw new Error('Database connection failed.');
  }
  else {
    console.log('Database connection successfully.')
  }
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  app.use('/', index);
  app.use('/', url_shortener);
  
  var port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('URL Shortener Microservice listening on port ' + port + '!');
  });
});
