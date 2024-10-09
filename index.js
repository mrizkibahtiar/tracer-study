const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const URL = 'mongodb://localhost:27017/tracer-study';

async function connectDb(URL) {
    try {
        await mongoose.connect(URL);
        console.log('connected to mongoDB');
    } catch (error) {
        console.log(error);
    }
}

connectDb(URL)

app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))

app.get('/', (req, res) => {
    res.render('pages/index');
})

app.get('/loginPage', (req, res) => {
    res.render('pages/login');
})

app.listen(3000, function () {
    console.log('server running');
})