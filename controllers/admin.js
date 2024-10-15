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
            // Membuat objek untuk alumni
            const alumniData = {
                nisn: nisn,
                name: name,
                password: password,
                // Hanya menambahkan email dan graduationYear jika ada
                ...(email && { email: email }),
                ...(graduationYear && { graduationYear: graduationYear })
            };

            // Membuat alumni
            const alumni = await Alumni.create(alumniData);

            // Redirect setelah berhasil
            res.render('pages/admin/alumni_form', { alumni: alumni });
            console.log(alumni)
            // return alumni;
        } catch (err) {
            console.log(err);
            // Jika terjadi error, redirect ke alumni-form dengan pesan error
            res.redirect('/admin/alumni-form', { error: err })
        }
    }

}