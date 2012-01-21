#!/usr/bin/node

var express = require('express');
var relyingParty = require('./relyingParty.js');

var app = module.exports = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jshtml');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ 
    dumpExceptions: true, 
    showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});

app.get('/', function(req, res) {
  res.render('index', {
    title: 'Express'
  });
});

app.post('/auth', function(req, res) {
  relyingParty.authenticate(req.body.identifier, req.headers.origin + '/verify', function(error, authUrl) {
    if (error) {
      console.log(error);
      res.render('auth', { 'error': error });
    } else if (!authUrl) {
      res.render('auth', { 'error': 'Authentication Failed' });
    } else {
      console.log(authUrl);
      res.redirect(authUrl);
    }
  });
});

app.get('/verify', function(req, res) {
  relyingParty.verifyAssertion(req, function(error, result) {
    if(result)
    {
      console.log(result);
      res.render('verify', { authenticated: result.authenticated }); 
      return; 
    }

    res.render('verify', { authenticated: false });
  });
});


app.listen(process.env.PORT, '0.0.0.0');
console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);

