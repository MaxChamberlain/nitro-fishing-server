var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var db = require('./config/db');

// Get routes
var bookingsRouter = require('./routes/bookings');
var availabilitiesRouter = require('./routes/availabilities');
var usersRouter = require('./routes/users');

var app = express();

// Connect to database
db.connectDB().then(() => {
  console.log('Connected to database.');
}).catch((err) => {
  console.log('Error connecting to database: ' + err);
});

app.use(cors({ origin: true, credentials: true, exposedHeaders: ['set-cookie', 'Authorization'] }));

//set app header for access control allow origin to allow cross origin requests
const corsDetail = {
  origin: ["http://localhost:3000", 'http://localhost:5173', 'http://192.168.4.198:5173', 'http://192.168.4.129:5173', 'http://127.0.0.1:5173'],
  default: "http://localhost:3000"
}

app.use(function(req, res, next) {
  const origin = corsDetail.origin.includes(req.header('origin')) ? req.headers.origin : corsDetail.default;
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', usersRouter);
app.use('/bookings', bookingsRouter);
app.use('/availabilities', availabilitiesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
