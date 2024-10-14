const Alumni = require('../models/alumni');
const Admin = require('../models/admin');
const mongoose = require('mongoose');



module.exports = {

    login: async (req, res) => {
        const { nisn, password } = req.body;
        const alumni = await Alumni.findOne({
            $or: [
                { nisn: nisn.trim() },
                { email: nisn.trim() }
            ]
        });
        const admin = await Admin.findOne({ email: nisn.trim() });
        const user = alumni || admin;
        if (!user) {
            return res.render('pages/login', { error: 'User not found' });
        }
        if (user.password !== password.trim()) {
            return res.render('pages/login', { error: 'Password incorrect' });
        }
        if (alumni) {
            req.session.user = { ...alumni, role: 'alumni' };
            req.session.save();
            return res.redirect('/alumni');
        } else {
            req.session.user = { ...admin, role: 'admin' };
            req.session.save();
            console.log(req.session.user)
            return res.redirect('/admin');
        }
    },
    logout: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}