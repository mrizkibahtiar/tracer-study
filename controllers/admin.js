const Admin = require('../models/admin');
const mongoose = require('mongoose');


module.exports = {
    index: function (req, res) {
        const { nisn } = req.session.user;
        const admin = Admin.findOne({ email: nisn });
        res.render('pages/admin/dashboard', { admin: admin });
    }
}