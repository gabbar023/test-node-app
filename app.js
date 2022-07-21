const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database')
const Product=require('./models/product')
const User=require('./models/user')
const CartItem=require('./models/cart-item')
const Cart=require('./models/cart')
const OrderItem=require('./models/order-item')
const Order=require('./models/order')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { result } = require('lodash');
const { triggerAsyncId } = require('async_hooks');
const { application } = require('express');
const { getProducts } = require('./controllers/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=> {
    return User.findAll({where: {id: 1 }}).then(
        user=> {
            req.user=user[0]
            next()
        }
    ).catch(err=> console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// const test=Product.build({id: 1})
// console.log(test instanceof Product)
// console.log(test.id,"\n",test.title)

//associate product to user
Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product)

//associate cart to user
User.hasOne(Cart)
Cart.belongsTo(User)

//asociate cart to products
Product.belongsToMany(Cart,{through: CartItem})     //product may be in many carts
Cart.belongsToMany(Product, {through: CartItem})        ///cart may have many product



//associate cart-item to cart 
CartItem.belongsTo(Cart,{constraints: true, onDelete: 'CASCADE' })
Cart.hasMany(Product)

//associate order & order-items to user
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,  {through: OrderItem})
// Product.belongsToMany(Order)


//this will automatically perform an SQL query to the database
//{force:true} basically drops existing tables & create new.
//{alter:true } basically updates existing tables.

sequelize.sync(
    {force: true}
    ).then(result=>{
    // console.log(result
    return User.findAll({where: {id: 1 }} )
    // app.listen(3000);
}).then( user => {
    if(!user[0])
    {
       return User.create({name: "deepak", emailId: "deepak@test.com"})
    }
    return user;
}
).then( user=> {
    // console.log(user)
    // return user.createCart()
}).then(cart=> {
    app.listen(3000);
}).catch(err=>{
    console.log(err)
})

//drop all tables
//sequelize.drop()