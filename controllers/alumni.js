
const Alumni = require('../models/alumni');
const TracerStudy = require('../models/tracerStudy');
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
            console.log(alumni)
            return res.render('pages/alumni/alumni_form', { alumni: alumni });
        }
    },

    saveForm1: async function (req, res) {
        const { nisn } = req.session.user;
        const email = req.body.email.trim();
        const tahunLulus = req.body.tahunLulus.trim();
        const kegiatan = req.body.kegiatan.trim();
        try {
            const alumni = await Alumni.findOne({ nisn: nisn });
            const newTracerStudy = {
                alumniId: alumni._id,
                email: email,
                tahunLulus: tahunLulus,
                kegiatan: kegiatan
            };
            await TracerStudy.create(newTracerStudy);
            const kegiatanUrl = kegiatan.toLowerCase().replace(/\s+/g, '-');
            return res.redirect(`/alumni/alumni-form2-${kegiatanUrl}/${nisn}`);
        } catch (err) {
            console.error(err);
            return res.render('pages/alumni/alumni_form', { error: 'Terjadi kesalahan. Mohon coba lagi.' });
        }
    },

    showForm2Kursus: async function (req, res) {
        const nisn = req.params.nisn;
        const alumni = await Alumni.findOne({ nisn: nisn });
        const form1 = await TracerStudy.findOne({ alumniId: alumni._id });
        return res.render('pages/alumni/kursus', { form1: form1 });
    }
}