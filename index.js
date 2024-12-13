const express = require('express');
const app = express();
const mongoose = require('mongoose');
const alumniRouter = require('./router/alumni');
const authRouter = require('./router/auth');
const adminRouter = require('./router/admin');
const bodyParser = require('body-parser');
const { checkLogin } = require('./middleware/auth');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const { flashMessage } = require('./middleware/flash');
const TracerStudy = require('./models/tracerStudy');
require('dotenv').config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_SESSION_SECRET = process.env.DB_SESSION_SECRET;
const ATLAS_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.pkv9h.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
console.log(ATLAS_URL);

async function connectDb(URL) {
    try {
        await mongoose.connect(URL);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error);
    }
}
connectDb(ATLAS_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: DB_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
    }
}));

app.use(flash());
app.use(flashMessage);

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

app.get('/', async (req, res) => {
    const tracerStudy = await TracerStudy.find({}).populate('feedback').populate('alumniId').populate('kegiatanDetail');
    let feedback = [];
    for (let i = 0; i < tracerStudy.length; i++) {
        if (tracerStudy[i].kegiatan == "Bekerja" || tracerStudy[i].kegiatan == "Melanjutkan Studi" || tracerStudy[i].kegiatan == "Berwirausaha") {
            feedback.push(tracerStudy[i]);
        }
    }
    console.log(feedback);
    res.render('pages/index', { feedback: feedback });
});

app.get('/loginPage', checkLogin, (req, res) => {
    res.render('pages/login');
});

app.use(methodOverride('_method'));
app.use(authRouter);
app.use(alumniRouter);
app.use(adminRouter);

app.listen(3000, function () {
    console.log('Server running on http://localhost:3000');
});
