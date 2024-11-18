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
        const { nisn } = req.params;
        try {
            const alumni = await Alumni.findOneAndDelete({ nisn: nisn });

            if (!alumni) {
                req.flash('error_msg', 'Data alumni tidak ditemukan.');
                return res.redirect('/admin/alumni-list');
            }

            req.flash('success_msg', `Data alumni dengan NISN ${nisn} berhasil dihapus.`);
            return res.redirect('/admin/alumni-list');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Terjadi kesalahan saat menghapus data.');
            return res.redirect('/admin/alumni-list');
        }
    },

    alumniUpdate: async function (req, res) {
        const { nisn } = req.params; // NISN dari URL
        const { nisnBaru, nama } = req.body; // Data dari form

        try {
            // Validasi apakah NISN baru sudah ada di database
            if (nisnBaru !== nisn) {
                const existingAlumni = await Alumni.findOne({ nisn: nisnBaru });
                if (existingAlumni) {
                    req.flash('error_msg', 'NISN baru sudah digunakan.');
                    return res.redirect('/admin/alumni-list/' + nisn);
                }
            }

            // Data yang akan diperbarui
            const updateData = {
                nisn: nisnBaru,
                nama: nama,
            };

            // Update data alumni berdasarkan NISN lama
            const alumni = await Alumni.findOneAndUpdate(
                { nisn: nisn }, // Kondisi pencarian
                updateData, // Data yang diperbarui
                { new: true } // Mengembalikan data terbaru setelah update
            );

            // Flash pesan sukses
            req.flash('success_msg', 'Alumni berhasil diperbarui!');
            return res.redirect('/admin/alumni-list/' + nisnBaru);
        } catch (err) {
            console.error('Error saat update alumni:', err.message, err.stack);

            // Flash pesan error dan redirect kembali
            req.flash('error_msg', 'Terjadi kesalahan. Mohon coba lagi.');
            return res.redirect('/admin/alumni-list/' + nisn);
        }
    },

    alumniUpdatePassword: async function (req, res) {
        const { nisn } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            req.flash('error_msg', 'Semua field wajib diisi.');
            return res.redirect('/admin/alumni-list/' + nisn);
        }

        if (password !== confirmPassword) {
            req.flash('error_msg', 'Password dan konfirmasi password tidak cocok.');
            return res.redirect('/admin/alumni-list/' + nisn);
        }

        try {
            // Hash password sebelum menyimpannya
            const hashedPassword = await bcrypt.hash(password.trim(), 10);

            const alumni = await Alumni.findOneAndUpdate(
                { nisn: nisn },
                { password: hashedPassword },
                { new: true }
            );

            if (!alumni) {
                req.flash('error_msg', 'Alumni tidak ditemukan.');
                return res.redirect('/admin/alumni-list');
            }

            req.flash('success_msg', 'Password berhasil diperbarui!');
            return res.redirect('/admin/alumni-list/' + nisn);
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Terjadi kesalahan. Mohon coba lagi.');
            return res.redirect('/admin/alumni-list/' + nisn);
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