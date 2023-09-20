const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const { Product } = require("../models/product");
const User = require("../models/user");

userRouter.post('/api/add-to-cart', auth, async (req, res) => {
    try {
        const {id} = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        if(user.cart.length == 0) {
            user.cart.push({product, quantity: 1});
        } else {
            let isProductFound = false;
            for(let i=0; i<user.cart.length; i++) {
                if(user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;
                }
            }
            if(isProductFound) {
                let producttt = user.cart.find((productt) => productt.product._id.equals(product._id));
                producttt.quantity += 1;
            } else {
                user.cart.push({product, quantity: 1});
            }
        }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

userRouter.post('/api/out-of-stock', auth, async(req, res) => {
    try{
        const {id} = req.body;
        let product = await Product.findById(id);
        product.quantity = 0;
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/delete-product', auth, async(req, res) => {
    try{
            const {id} = req.body;
            let product = await Product.findByIdAndDelete(id);
            res.json(product);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
});

userRouter.get('/api/get-products', auth, async (req, res)=> {
    try{
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/add-product', auth, async (req, res) => {
    try {
        const {name, description, sellername, sellerid, images, quantity, retailprice, wholesaleprice, plusmemberprice, category} = req.body;
        let product = new Product({
            name,
            description,
            sellername,
            sellerid,
            images,
            quantity,
            wholesaleprice,
            plusmemberprice,
            retailprice,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/update-product', auth, async (req, res) => {
    try {
        const{id, name, description, quantity, wholesaleprice, retailprice, plusmemberprice} = req.body;
        let product = await Product.findById(id);
        product.name = name;
        product.description = description;
        product.quantity = quantity;
        product.retailprice = retailprice;
        product.wholesaleprice = wholesaleprice;
        product.plusmemberprice = plusmemberprice;
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/update-user', auth, async (req, res) => {
    try {
        const {id, name} = req.body;
        let user = await User.findById(id);
        user.name = name;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.delete('/api/remove-from-cart/:id', auth, async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

            for(let i=0; i<user.cart.length; i++) {
                if(user.cart[i].product._id.equals(product._id)) {
                    if(user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1);
                } else {
                    user.cart[i].quantity -= 1;
                }
                }
            }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
});

//change user type
userRouter.post('/api/change-user-type', auth, async (req, res) => {
    try {
        const {type} = req.body;
        let user = await User.findById(req.user);
        user.type = type;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

//save user address
userRouter.post('/api/save-user-address', auth, async (req, res) => {
    try {
        const {address} = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

//order product
userRouter.post('/api/order', auth, async (req, res) => {
    try {
        const {cart, totalPrice, address} = req.body;
        let products = [];

        for(let i=0; i<cart.length; i++) {
            let product = await Product.findById(cart[i].product._id);
            if(product.quantity >= cart[i].quantity) {
                product.quantity -= cart[i].quantity;
                products.push({product, quantity: cart[i].quantity});
                await product.save();
            } else {
                return res.status(400).json({msg: `${product.name} is out of stock`});
            }
        }

        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        let order = new Order({
            products,
            totalPrice,
            address,
            isPaid,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

//Buy Now Product
userRouter.post('/api/buy-now', auth, async (req, res) => {
    try {
        const {id, totalPrice, address} = req.body;
        let product = await Product.findById(id);
        let user = await User.findById(req.user);
        let products = [];
        if(product.quantity >= 1) {
            product.quantity -= 1;
            products.push({product, quantity: 1});
            product = await product.save();
        } else {
            return res.status(400).json({msg: `${product.name} is out of stock`});
        }

        let order = new Order ({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);

    } catch (e) {
        return res.status(400).json({error: e.message});
    }
});

//userRouter.delete('/api/remove-order/:id', auth, async (req, res) => {
//    try {
//        const {cart, totalPrice, address} = req.params;
//        let products[];
//
//            for(let i=0; i<user.cart.length; i++) {
//                if(user.cart[i].product._id.equals(product._id)) {
//                    if(user.cart[i].quantity == 1) {
//                    user.cart.splice(i, 1);
//                } else {
//                    user.cart[i].quantity -= 1;
//                }
//                }
//            }
//        user = await user.save();
//        res.json(user);
//    } catch (e) {
//        res.status(500).json({error: e.message})
//    }
//});

userRouter.get('/api/orders/me', auth, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = userRouter;
