const { timeLog } = require('console');
const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({title: title, price: price, description: description, imageUrl: imageUrl})
  // Product.create({title: title, price: price, description: description, imageUrl: imageUrl, UserId: req.user.id})
  .then(result =>{
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err)
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findAll({
    where: {
      id: prodId
    }
  }).then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    });
  }).catch(err => console.log(err));
  // Product.findById(prodId, 
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  // const updatedProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );

  //first fetch the product from mysql table, then update
  Product.findAll({
    where: {
      id: prodId
    }
  }).then(product => {
    product[0].title=updatedTitle
    product[0].imageUrl=updatedImageUrl
    product[0].price=updatedPrice
    product[0].description=updatedDesc

    //now after setting value,save() will update the code.
    return product[0].save()
  }).then(result =>{
    console.log("updated the product ${product.title}")
    res.redirect('/admin/products');
  }).catch(err => console.log (err))
  // updatedProduct.save();
  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err))
  // Product.fetchAll(products => {
  //   res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //   });
  // });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findAll({
    where: {
      id: prodId
    }
  }).then(product=> {
     return product[0].destroy()
  }).then(result=>{
    console.log('product deleted')
    res.redirect('/admin/products')
})
  // Product.deleteById(prodId);
};
