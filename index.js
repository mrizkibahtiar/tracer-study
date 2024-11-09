const express = require('express');
const app = express();
const mongoose = require('mongoose');
const alumniRouter = require('./router/alumni');
const authRouter = require('./router/auth');
const adminRouter = require('./router/admin');
const URL = 'mongodb://localhost:27017/tracer-study';
const bodyParser = require('body-parser');
const { checkLogin } = require('./middleware/auth');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const { flashMessage } = require('./middleware/flash');

async function connectDb(URL) {
    try {
        await mongoose.connect(URL);
        console.log('connected to mongoDB');
    } catch (error) {
        console.log(error);
    }
}
connectDb(URL)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '12345-67890-09876-54321',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
    }
}))

app.use(flash());
app.use(flashMessage);

app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))

app.get('/', (req, res) => {
    res.render('pages/index');
})

app.get('/loginPage', checkLogin, (req, res) => {
    res.render('pages/login');
})

app.use(methodOverride('_method'));
app.use(authRouter);
app.use(alumniRouter);
app.use(adminRouter);

app.listen(3000, function () {
    console.log('server running on = ' + `localhost:3000`);
})