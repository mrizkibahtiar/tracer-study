
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');

module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/alumni_form', { alumni: alumni })
        }
    },
    profile: async function (req, res) {
        if (!req.session.user) {

        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/profile', { alumni: alumni })
        }
    }
}