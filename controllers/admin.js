const Admin = require('../models/admin');
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');


module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            const { email, role } = req.session.user._doc;
            const admin = await Admin.findOne({ email: email });
            console.log(admin);
            return res.render('pages/admin/dashboard', { admin: admin });
        }
    },

    alumniForm: function (req, res) {
        res.render('pages/admin/alumni_form');
    },

    store: async function (req, res) {
        const { name, nisn, password, email, graduationYear } = req.body;
        try {
            if (email && password) {
                const alumni = await Alumni.create({
                    nisn: nisn,
                    name: name,
                    password: password,
                    email: email,
                    graduationYear: graduationYear
                });
                res.redirect('/admin/alumni-form');
                return alumni
            } else {
                const alumni = Alumni.create({
                    nisn: nisn,
                    name: name,
                    password: password,
                });
                res.redirect('/admin/alumni-form');
                return alumni
            }
        } catch (err) {
            console.log(err);
            res.redirect('/admin/alumni-form');
        }
        res.redirect('/admin');
    }
}