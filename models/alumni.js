const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
    nisn: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        default: null
    }
}, { timestamps: true });


const Alumni = mongoose.model('Alumni', alumniSchema);
module.exports = Alumni;