const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin');
const {Product} = require('../models/product');
const Order = require('../models/order');
const { PromiseProvider } = require("mongoose");
const User = require("../models/user");

//add product
adminRouter.post('/admin/add-product', admin, async (req, res) => {
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

adminRouter.get('/admin/users/search/:oid', admin, async (req, res)=> {
    try{
        const products = await User.find({
            oid: {$regex: req.params.oid, $options: "i"}
        });
        res.json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.post('/admin/update-product', admin, async (req, res) => {
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

//get product
adminRouter.get('/admin/get-products', admin, async (req, res)=> {
    try{
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.post('/admin/delete-product', admin, async(req, res) => {
    try{
            const {id} = req.body;
            let product = await Product.findByIdAndDelete(id);
            res.json(product);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
});

adminRouter.get('/admin/get-orders', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.get('/admin/get-user', admin, async (req, res) => {
    try {
        const user = await User.findById({id: id});
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

adminRouter.post('/admin/change-order-status', admin, async(req, res) => {
    try{
            const {id, status} = req.body;
            let order = await Order.findById(id);
            order.status = status;
            order = await order.save();
            res.json(order);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
});

adminRouter.post('/admin/out-of-stock', admin, async(req, res) => {
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

adminRouter.get('/admin/analytics', admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;

        for (let i=0; i<orders.length; i++) {
            for (let j=0; j<orders[i].products.length; j++) {
                  totalEarnings += orders[i].totalPrice
//                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.retailprice
            }
        }
        //CATEGORY WISE ORDER FETCHING
        let watchesEarnings = await fetchCategoryWiseProduct('Watches');
        let keychainEarnings = await fetchCategoryWiseProduct('Key Chain');
        let headphonesEarnings = await fetchCategoryWiseProduct('Headphones');
        let speakersEarnings = await fetchCategoryWiseProduct('Speakers');
        let electronicsEarnings = await fetchCategoryWiseProduct('Electronics');
        let cosmeticsEarnings = await fetchCategoryWiseProduct('Cosmetics');
        let appliancesEarnings = await fetchCategoryWiseProduct('Appliances');

        let earnings = {
            totalEarnings,
            watchesEarnings,
            keychainEarnings,
            headphonesEarnings,
            speakersEarnings,
            electronicsEarnings,
            cosmeticsEarnings,
            appliancesEarnings,
        };
        res.json(earnings);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

async function fetchCategoryWiseProduct(category) {
    let earnings = 0;
    let categoryOrders = await Order.find({
        'products.product.category': category,
    });

    for (let i=0; i<categoryOrders.length; i++) {
                for (let j=0; j<categoryOrders[i].products.length; j++) {
                    earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.retailprice
                }
            }
            return earnings;
}

module.exports = adminRouter;