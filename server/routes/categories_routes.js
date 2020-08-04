const express = require("express");

const _ = require("underscore");

const {
    verifyToken, verifyAdmin
} = require("../middlewares/authentication");

const Category = require("../models/categories");

const app = express();

app.get("/categories", verifyToken, function (req, res) {

    Category.find()
    //Sorts the collections by the given criteria
    .sort('description')
    //Brings data from the referenced table and it filters the information e.g: name, email
    .populate('user', 'name email')
    .exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            categories
        });
    });
});

app.get("/categories/:id", verifyToken, function (req, res) {

    const categoryId = req.params.id;

    Category.findById(categoryId, (err, category) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!category){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Category with id:${categoryId} does not exist`
                }
            });
        }

        res.json({
            category
        });
    });
});

app.post('/categories', verifyToken, async function (req, res) {

    try {
        const body = req.body;

        let newCategory = new Category({
            description: body.description,
            user: req.user._id
        });

        const category = await newCategory.save();

        res.json({
            category
        })
    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
});

app.put('/categories/:id', verifyToken, function(req, res){
    
    let id = req.params.id;

    let body = {
        description: req.body.description
    }

    Category.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, category) => {    
        if(err){
            if(!err.errors){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `id:${id} does not exist`
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
            category
        });
    });
});

app.delete('/categories/:id', [verifyToken, verifyAdmin], function(req, res){

    let id = req.params.id;

    Category.findByIdAndRemove(id, {
        useFindAndModify: true
    }, (err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            deletedCategory
        });
    });
});

module.exports = app;