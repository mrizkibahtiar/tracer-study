const express = require('express');
const app = express();
const mongoose = require('mongoose');
const alumniRouter = require('./router/alumni');
const authRouter = require('./router/auth');
const adminRouter = require('./router/admin');
const URL = 'mongodb://localhost:27017/tracer-study';
const bodyParser = require('body-parser');
const session = require('express-session');

async function connectDb(URL) {
    try {
        await mongoose.connect(URL);
        console.log('connected to mongoDB');
    } catch (error) {
        console.log(error);
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '12345-67890-09876-54321',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: null,
        secure: false,
    }
}))

connectDb(URL)

app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))

app.get('/', (req, res) => {
    res.render('pages/index');
})

app.get('/loginPage', (req, res) => {
    res.render('pages/login');
})


app.use(authRouter);
app.use(alumniRouter);
app.use(adminRouter);

app.listen(3000, function () {
    console.log('server running');
})