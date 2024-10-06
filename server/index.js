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


app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
})

app.listen(3000, function () {
    console.log('server running');
})