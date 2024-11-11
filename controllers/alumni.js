
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');

module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/dashboard', { alumni: alumni })
        }
    },
    profile: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage')
        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/profile', { alumni: alumni })
        }
    },
    showForm: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage');
        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/alumni_form', { alumni: alumni });
        }
    },

    saveForm1: async function (req, res) {
        const { nisn } = req.params;
        const email = req.body.email.trim();
        const tahunLulus = req.body.tahunLulus.trim();
        const kegiatan = req.body.kegiatan.trim();
        console.log(nisn, email, tahunLulus, kegiatan);
    }
}