const Alumni = require('../models/alumni');
const Admin = require('../models/admin');
const mongoose = require('mongoose');



module.exports = {

    login: async (req, res) => {
        const { nisn, password } = req.body;
        const alumni = await Alumni.findOne({
            $or: [
                { nisn: nisn },
                { email: nisn }
            ]
        });
        const admin = await Admin.findOne({ email: nisn });
        const user = alumni || admin;
        if (!user) {
            return res.render('login', { error: 'User not found' });
        }
        if (user.password !== password) {
            return res.render('login', { error: 'Password incorrect' });
        }
        if (alumni) {
            req.session.destroy();
            req.session.user = alumni;
            return res.redirect('/alumni');
        } else {
            req.session.user = admin;
            return res.redirect('/admin');
        }

        res.redirect('/');
    },
    logout: async (req, res) => {
        res.redirect('/');
    }
}