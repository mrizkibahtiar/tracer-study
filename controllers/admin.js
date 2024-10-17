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
        console.log(req.body);
        try {
            // Membuat objek untuk alumni
            const alumniData = {
                nisn: nisn.trim(),
                name: name.trim(),
                password: password.trim(),
                ...(email && { email: email.trim() }),
                ...(graduationYear && { graduationYear: graduationYear.trim() })
            };

            // Membuat alumni
            const alumni = await Alumni.create(alumniData);

            // Mengirim success message jika berhasil
            res.render('pages/admin/alumni_form', { success: 'Alumni berhasil ditambahkan!', alumni: alumni });
        } catch (err) {
            if (err.code === 11000 && err.keyPattern.nisn) {
                return res.render('pages/admin/alumni_form', { error: 'NISN sudah terdaftar. Mohon gunakan NISN lain.', alumni: req.body });
            }
            // Error lainnya
            return res.render('pages/admin/alumni_form', { error: 'Terjadi kesalahan. Mohon coba lagi.', alumni: req.body });
        }
    },

    viewAlumniList: async function (req, res) {
        const alumni = await Alumni.find({});
        console.log(alumni);
        return res.render('pages/admin/alumni_list', { alumni: alumni });
    },

}