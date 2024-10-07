
const User = require('../models/user');
const mongoose = require('mongoose');

media.exports = {
    index: async (req, res) => {
        const data = await User.find();
    },
    login: async (req, res) => {
        const { nisn, password } = req.body;

        if (!nisn || !password) {
            return res.status(400).json({
                status: 'fail',
            })
        } else {
            const data = await User.findOne({ nisn: nisn, $and: { password: password } });
            if (!user) {
                return res.status(400).json({
                    status: 'fail'
                })
            } else {
                res.redirect('/dashboard', { user: user });
            }
        }
    }
}