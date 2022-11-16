const e = require('express');
var express = require('express');
var router = express.Router();
var {check,validationResult} = require('express-validator');
var mongodb = require('mongodb');
var db = require('monk')('localhost:27017/E-commerceDB')




/* GET home page. */
router.get('/add', function(req, res, next) {
  var categories =db.get('categories');
  categories.find({},{},function(err,category){
      res.render('addproduct',{categories:category});
  })
});

router.post('/add',[
    check('name','กรุณาป้อนชื่อสินค้า').not().isEmpty(),
    check('description','กรุณาป้อนรายละเอียดสินค้า').not().isEmpty(),
    check('price','กรุณาป้อนราคาสินค้า').not().isEmpty(),
    check('img','กรุณาป้อนชื่อภาพสินค้า').not().isEmpty(),
],function(req, res, next) {
    const result = validationResult(req);
    var error = result.errors;
    var products = db.get('products');
    var categories =db.get('categories');

    if(!result.isEmpty()){
      categories.find({},{},function(err,category){
          res.render('addproduct',{categories:category,errors:error});
      })
    }else{
      products.insert({
        name:req.body.name,
        description:req.body.description,
        price:parseFloat(req.body.price),
        img:req.body.img,
        category:req.body.category
      },function(err,success){
        if(err){
          res.send(err);
        }else{
          res.location('/');
          res.redirect('/');
        }
      })
    }
});

router.get('/show/:id', function(req, res, next) {
  var categories =db.get('categories');
  var products =db.get('products');

  products.find(req.params.id,{},function(err,product){
    categories.find({},{},function(err,category){
      res.render('show',{categories:category,products:product}
      );
    })
  })
});


router.get('/show/', function(req, res, next) {
  var categories =db.get('categories');
  var products =db.get('products');
  var categoryname = req.query.category
  console.log(categoryname);
  if (categoryname) {
  products.find({category:categoryname},{},function(err,product){
    categories.find({},{},function(err,category){
      res.render('searchproduct',{categories:category,products:product
      });
    })
  })
}
});

router.post('/cart/', function(req, res, next) {
    var product_id = req.body.product_id;
    var products = db.get('products');
    req.session.cart = req.session.cart || {};
    var cart = req.session.cart;

    products.find({_id:product_id},{},function(err,product){
        if(cart[product_id]){
          cart[product_id].qty++;
        }else{
           product.forEach(function(item){
              cart[product_id] = {
                item : item._id,
                title : item.name,
                price : item.price,
                qty : 1
              }
           });
        }
        console.log(cart);
        res.redirect('/products/cart');
    });
});


router.get('/cart', function(req, res, next) {
    var cart = req.session.cart;
    var displayCart = {items:[],total:0};
    var total=0;
    for(item in cart){
      displayCart.items.push(cart[item]);
      total += (cart[item].qty * cart[item].price); //2*17000 3*1000
    }
    displayCart.total = total;
    res.render('cart',{cart:displayCart});
});
  

module.exports = router;
