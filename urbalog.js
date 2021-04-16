#!/usr/bin/env node
var debug = require('debug')('foo');
var app = require('./app');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "172.21.226.61";
var port = process.env.OPENSHIFT_NODEJS_PORT || 3200;

var server = app.listen(port, ipaddress, function() {
  debug('Express server listening on port ' + server.address().port);
});
