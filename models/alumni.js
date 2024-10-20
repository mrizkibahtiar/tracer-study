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
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        default: null
    },
    graduationYear: {
        type: Number,
        required: false,
        default: null
    },
}, { timestamps: true });


const Alumni = mongoose.model('Alumni', alumniSchema);
module.exports = Alumni;