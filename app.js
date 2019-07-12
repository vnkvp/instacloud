const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Conectar ao mongoose
mongoose.connect('mongodb://localhost/instacloud', {
    useNewUrlParser: true,
})

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection succeeded.");
});

// Carregar post model
require('./models/post');
const post = mongoose.model('post');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

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

// Post request
app.post('/cloud', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            const newUser = {
                image: req.file.filename,
                title: req.body.title,
                details: req.body.details,
                date: req.body.date
            }
            new post(newUser)
                .save((err)=>{
                    res.redirect('/cloud');
                    if(err){
                        console.log(err);
                    }
                })
        }
    });
});

// Rota index
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome'
    });
});

// Rota about
app.get('/about', (req, res) => {
    res.render('about');
});

// Rota cloud
app.get('/cloud', (req, res) => {
    post.find({})
        .sort({date: 'Desc'})
        .then(posts => {
            res.render('cloud/cloud', {
                posts: posts
            });
        });
});

// Rota adicionar post
app.get('/cloud/add', (req, res) => {
    res.render('cloud/add');
});

const port = 1337;
app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});

