const express = require("express");

const {
    verifyToken, verifyAdmin
} = require("../middlewares/authentication");

const Product = require("../models/products");

const app = express();


app.get('/products', verifyToken, function(req, res){

    const limit = Number(req.query.limit) || 4;
    const skip = Number(req.query.skip) || 0;

    Product.find()
    .populate('user', 'name email')
    .populate('category', 'description')
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            products
        });
    });
});

app.get('/products/:id', verifyToken, function(req, res){

    const productId = req.params.id;

    Product.findById(productId)
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!product){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Product with id:${productId} does not exist`
                }
            });
        }

        res.json({
            product
        });
    });
});

app.post('/products', verifyToken, async function(req, res){

    try {
        const body = req.body;

        let newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            available: req.body.available,
            category: req.body.categoryId,
            user: req.user._id
        });

        const product = await newProduct.save();

        res.json({
            product
        })
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
});

app.put('/products/:id', verifyToken, function(req, res){

    let id = req.params.id;

    let body = req.body;

    Product.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, product) => {    
        if(err){
            if(!err.errors){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Product with id:${id} does not exist`
                    }
                });
            }

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product
        });
    });
});

app.delete('/products/:id', [verifyToken, verifyAdmin], function(req, res){

    let id = req.params.id;

    Product.findByIdAndRemove(id, {
        useFindAndModify: true
    }, (err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            deletedProduct
        });
    });
});

app.get('/products/search/:word', verifyToken, function(req, res){

    let word = req.params.word;

    let regexWord = new RegExp(word, 'i');

    Product.find({name: regexWord})
    .populate('user', 'name email')
    .populate('category', 'description')
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            products
        });
    });
});

module.exports = app;