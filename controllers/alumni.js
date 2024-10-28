
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');

module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            console.log(req.session.user);
            const { nisn, role } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            return res.render('pages/alumni/dashboard', { alumni: alumni });
        }
    },
    alumniForm: function (req, res) {
        res.render('pages/alumni/alumni_form');
    }
}