
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var credentials = require('./routes/database');

var routes = require('./routes/routes');
var myClient = routes.client;

var app = express();
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '150mb'}));

// view engine setup - it is set with the public folder views
app.set('views', path.join(__dirname, 'public/views'));
// specifically require html for rendering
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));

// default fallback
app.use('/urbalog/', routes);

app.disable('etag');

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.all("/urbalog/*", routes);

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log('error '+err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

