const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const app = express();

const User = require('../models/users');
const Product = require('../models/products');

app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        });
    }

    let validTypes = ['users', 'products'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Invalid type. Allowed types: ' + validTypes.join(', '),
                type
            }
        });
    }

    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    let file = req.files.file;
    let fileName = file.name.split('.');
    let extension = fileName[fileName.length - 1];

    let validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Invalid file. Allowed extensions: ' + validExtensions.join(', '),
                extension
            }
        });
    }

    let date = new Date();
    let validFileName = `${id}-${date.getMonth()}-${date.getDay()}-${date.getFullYear()}-${date.getTime()}.${extension}`;

    let args = {
        id,
        type,
        fileName: validFileName,
        file
    };

    saveImage(args, res);
});

async function saveImage(args, res) {
    try {
        let result;

        switch (args.type) {
            case 'users':
                result = await User.findByIdAndUpdate(args.id, {
                    img: args.fileName
                }, {
                    context: 'query',
                    useFindAndModify: false
                });
            break;

            case 'products':
                result = await Product.findByIdAndUpdate(args.id, {
                    img: args.fileName
                }, {
                    context: 'query',
                    useFindAndModify: false
                });
            break;
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `id:${args.id} does not exist`
                }
            });
        }

        // Use the mv() method to place the file somewhere on your server
        let imagePath = path.resolve(__dirname, `../../uploads/${args.type}/${result.img}`);

        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }

        let newImagePath = path.resolve(__dirname, `../../uploads/${args.type}/${args.fileName}`);
        await args.file.mv(newImagePath);

        res.json({
            ok: true,
            fileName: args.fileName,
            message: 'File created!'
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

module.exports = app;