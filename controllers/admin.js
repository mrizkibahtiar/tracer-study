const Admin = require('../models/admin');
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            const { email, role } = req.session.user;
            const admin = await Admin.findOne({ email: email });
            return res.render('pages/admin/dashboard', { admin: admin });
        }
    },

    alumniForm: function (req, res) {
        res.render('pages/admin/alumni_form');
    },

    store: async function (req, res) {
        const { nama, nisn, password } = req.body;
        try {
            // Hash password dengan bcrypt sebelum menyimpan
            const hashedPassword = await bcrypt.hash(password.trim(), 10);
            // Membuat objek untuk alumni
            const alumniData = {
                nisn: nisn.trim(),
                nama: nama.trim(),
                password: hashedPassword,
            };

            // Membuat alumni
            const alumni = await Alumni.create(alumniData);

            // Mengirim success message jika berhasil
            res.render('pages/admin/alumni_form', { success: 'Alumni berhasil ditambahkan!', alumni: alumni });
        } catch (err) {
            if (err.code === 11000 && err.keyPattern.nisn) {
                return res.render('pages/admin/alumni_form', { error: 'NISN sudah terdaftar. Mohon gunakan NISN lain.', nama, nisn });
            }
            // Error lainnya
            return res.render('pages/admin/alumni_form', { error: 'Terjadi kesalahan. Mohon coba lagi.', nama, nisn });
        }
    },

    viewAlumniList: async function (req, res) {
        const alumni = await Alumni.find({});
        return res.render('pages/admin/alumni_list', { alumni: alumni });
    },

    viewAlumniDetail: async function (req, res) {
        const { nisn } = req.params;
        const alumni = await Alumni.findOne({ nisn: nisn });
        return res.render('pages/admin/alumni_detail', { alumni: alumni });
    },

    deleteAlumni: async function (req, res) {
        try {
            const { nisn } = req.params;
            const alumni = await Alumni.findOneAndDelete({ nisn: nisn });
            return res.redirect('/admin/alumni-list');
        } catch (err) {
            return res.redirect('/admin/alumni-list/' + nisn);
        }
    },

    alumniEdit: async function (req, res) {
        const { nisn } = req.params;
        const alumni = await Alumni.findOne({ nisn: nisn });
        console.log(alumni);
        return res.render('pages/admin/alumni_edit', { alumni: alumni });
    },

    alumniUpdate: async function (req, res) {
        const { nisn } = req.params;
        const { nama, password } = req.body;

        try {
            // Persiapkan objek pembaruan
            const updateData = {
                nama: nama.trim(),
            };

            // Hanya mengubah password jika field password diisi
            if (password) {
                const hashedPassword = await bcrypt.hash(password.trim(), 10);
                updateData.password = hashedPassword;
            }

            const alumni = await Alumni.findOneAndUpdate(
                { nisn: nisn },
                updateData,
                { new: true }
            );

            req.flash('success_msg', 'Alumni berhasil diperbarui!');
            return res.redirect('/admin/alumni-edit/' + nisn);
        } catch (err) {
            console.error(err); // Logging error untuk pengecekan
            req.flash('error_msg', 'Terjadi kesalahan. Mohon coba lagi.');
            return res.redirect('/admin/alumni-edit/' + nisn);
        }
    },
    viewAlumniTracer: async function (req, res) {
        const alumni = await Alumni.find({});
        return res.render('pages/admin/alumni_tracer', { alumni: alumni });
    },

    profile: async function (req, res) {
        console.log(req.session.user);
        const { email } = req.session.user;
        const admin = await Admin.findOne({ email: email });
        return res.render('pages/admin/profile', { admin: admin });
    }
}