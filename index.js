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

// Ganti dengan kredensial MongoDB Atlas Anda
const DB_USERNAME = 'tracer-study';
const DB_PASSWORD = 'tracerStudy';
const DB_NAME = 'tracer-study';
const ATLAS_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.7wix7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

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
    secret: '12345-67890-09876-54321',
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
