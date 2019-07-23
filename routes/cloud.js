const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Carregar post model
require('../models/post');
const post = mongoose.model('post');

// Multer Middleware
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage
}).single('image');

// Rota cloud
router.get('/', (req, res) => {
    post.find({})
        .sort({ date: 'Desc' })
        .then(posts => {
            res.render('cloud/cloud', {
                posts: posts
            });
        });
});

// Rota adicionar post
router.get('/add', (req, res) => {
    res.render('cloud/add');
});

// Post request
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        let subtitle = req.body.subtitle;
        if (subtitle.length > 64) {
            res.render('cloud/add', {
                msg: err
            });
        } else {
            const newUser = {
                id: req.body._id,
                image: req.file.filename,
                subtitle: req.body.subtitle,
                date: req.body.date
            }
            new post(newUser)
                .save((err) => {
                    res.redirect('/cloud');
                    if (err) {
                        console.log(err);
                    }
                });
        }
    });
});

/* Delete request ******** bugado
router.delete('/cloud:id', (req, res) => {
    post.deleteOne({ id: req.body._id })
        .then(() => {
            res.redirect('/cloud');
        });
}); */

module.exports = router;