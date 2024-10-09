const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true

    },
    name: {
        type: String,
        optional: true

    },
    email: {
        type: String,
        optional: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
