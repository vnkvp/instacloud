const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
// const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Conectar ao mongoose
mongoose.connect('mongodb://localhost/instacloud', {
    useNewUrlParser: true,
})

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", (callback) => {
    console.log("Connection succeeded.");
});

const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const cloud = require('./routes/cloud');
const users = require('./routes/users');

// Passport cfg
require('./config/passport')(passport);

// Usar Rotas
app.use('/cloud', cloud);
app.use('/users', users);

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Override Middleware
app.use(methodOverride('_method'));

// Connect-flash / session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true,
              maxAge: 60000 }
  }));
  app.use(flash());
  
  // Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

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

// Delete request ******** bugado
require('./models/post');
const post = mongoose.model('post');
app.delete('/cloud:id', (req, res) => {
    post.deleteOne({ id: req.body._id })
        .then(() => {
            res.redirect('/cloud');
        });
});

const port = 1337;
app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});

