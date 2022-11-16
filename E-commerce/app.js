var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/E-commerceDB')
var indexRouter = require('./routes/index');
var categoryRouter = require('./routes/categories');
var productRouter = require('./routes/products');
var session = require ('express-session');
var stripe = require ('stripe')('sk_test_51LVEdWC3s1YQBsMFnqkBqhlBgYoLbn5DbV6zzyJrDl92D2QAXwHRCGRvVXq36oIlI8VYKpNfIA26JpmTaE2rCS6500soJ6hfHY');


var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

app.locals.descriptionText = function (text,length){
  return text.substring(0,length);
}

app.locals.formatMoney = function(number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

app.post('/payment',function(req,res){
  var token = req.body.stripeToken;
  var amount = req.body.amount;
  var charge = stripe.charges.create({
      amount : amount,
      currency : "usd",
      source : token
  },function(err,charge){
      if(err) throw err
  });
      req.session.destroy();
      res.redirect('/');
})

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
