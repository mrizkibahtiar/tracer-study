
const Alumni = require('../models/alumni');
const mongoose = require('mongoose');

module.exports = {
    index: async function (req, res) {
        const { nisn } = req.session.user;
        const alumni = await Alumni.findOne({ nisn: nisn });
        res.render('pages/alumni/dashboard', { alumni: alumni });
    }
}