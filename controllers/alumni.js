
const Alumni = require('../models/alumni');
const TracerStudy = require('../models/tracerStudy');
const Feedback = require('../models/feedback');
const Pekerjaan = require('../models/pekerjaan');
const StudiLanjutan = require('../models/studiLanjutan');
const Berwirausaha = require('../models/berwirausaha');
const Kursus = require('../models/kursus');
const mongoose = require('mongoose');

module.exports = {
    index: async function (req, res) {
        if (!req.session.user) {
            return res.redirect('/loginPage'); // Redirect ke halaman login jika user belum login
        } else {
            const { nisn } = req.session.user;
            const alumni = await Alumni.findOne({ nisn: nisn });
            const tracerStudy = await TracerStudy.find({ alumniId: alumni._id }).populate('kegiatanDetail').populate('feedback');
            console.log(tracerStudy);
            return res.render('pages/alumni/dashboard', { alumni: alumni, tracerStudy: tracerStudy });
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

    saveForm: async function (req, res) {
        try {
            const validRefs = {
                "Bekerja": "Pekerjaan",
                "Melanjutkan Studi": "StudiLanjutan",
                "Berwirausaha": "Berwirausaha",
                "Kursus": "Kursus"
            };

            const { nisn } = req.session.user;
            const { email, tahunLulus, kegiatan, feedbackDetail } = req.body;

            // Cari data alumni berdasarkan NISN
            const alumni = await Alumni.findOne({ nisn: nisn });

            let kegiatanRef = null;
            let kegiatanDetailId = null;
            let feedbackId = null;

            // Proses penyimpanan berdasarkan jenis kegiatan
            if (kegiatan in validRefs) {
                kegiatanRef = validRefs[kegiatan];

                // Dapatkan model berdasarkan kegiatanRef
                const KegiatanModel = mongoose.model(kegiatanRef);

                let kegiatanData;

                // Pengkondisian untuk setiap kegiatan
                if (kegiatan === "Bekerja") {
                    const { namaPerusahaan, alamatPerusahaan, teleponPerusahaan, sektorPerusahaan, posisi, tanggalMasukBekerja } = req.body;
                    kegiatanData = new KegiatanModel({
                        alumniId: alumni._id,
                        namaPerusahaan: namaPerusahaan,
                        alamatPerusahaan: alamatPerusahaan,
                        teleponPerusahaan: teleponPerusahaan,
                        sektorPerusahaan: sektorPerusahaan,
                        posisi: posisi,
                        tanggalMasuk: tanggalMasukBekerja
                    });
                } else if (kegiatan === "Melanjutkan Studi") {
                    const { namaUniversitas, alamatUniversitas, fakultas, programStudi, tanggalMasukUniversitas } = req.body;
                    kegiatanData = new KegiatanModel({
                        alumniId: alumni._id,
                        namaUniversitas: namaUniversitas,
                        alamatUniversitas: alamatUniversitas,
                        fakultas: fakultas,
                        programStudi: programStudi,
                        tanggalMasuk: tanggalMasukUniversitas
                    });
                } else if (kegiatan === "Berwirausaha") {
                    const { namaUsaha, alamatUsaha, teleponUsaha, bidangUsaha, jumlahKaryawan, tanggalMulaiUsaha } = req.body;
                    kegiatanData = new KegiatanModel({
                        alumniId: alumni._id,
                        namaUsaha: namaUsaha,
                        alamatUsaha: alamatUsaha,
                        teleponUsaha: teleponUsaha,
                        bidangUsaha: bidangUsaha,
                        jumlahKaryawan: jumlahKaryawan,
                        tanggalMulai: tanggalMulaiUsaha
                    });
                } else if (kegiatan === "Kursus") {
                    const { namaKursus, alamatKursus, bidangKursus, tanggalMulaiKursus, tanggalSelesaiKursus } = req.body;
                    kegiatanData = new KegiatanModel({
                        alumniId: alumni._id,
                        namaKursus: namaKursus,
                        alamatKursus: alamatKursus,
                        bidangKursus: bidangKursus,
                        tanggalMulai: tanggalMulaiKursus,
                        tanggalSelesai: tanggalSelesaiKursus
                    });
                }

                // Simpan detail kegiatan
                const savedKegiatan = await kegiatanData.save();
                kegiatanDetailId = savedKegiatan._id;
            } else if (kegiatan === "Belum Ada Kegiatan") {
                kegiatanDetailId = null; // Tidak ada model untuk "Belum Ada Kegiatan"
            }

            // Simpan data feedback
            const feedbackData = new Feedback({
                alumniId: alumni._id,
                pesan: feedbackDetail
            });

            const savedFeedback = await feedbackData.save();
            feedbackId = savedFeedback._id;

            // Simpan data tracer study
            const tracerStudyData = new TracerStudy({
                alumniId: alumni._id,
                email: email.trim(),
                tahunLulus: tahunLulus.trim(),
                kegiatan: kegiatan.trim(),
                kegiatanRef: kegiatanRef,
                kegiatanDetail: kegiatanDetailId,
                belumAdaKegiatanDetail: kegiatan === "Belum Ada Kegiatan" ? req.body.kegiatanDetail : null,
                feedback: feedbackId
            });

            const savedTracerStudy = await tracerStudyData.save();


            // Redirect setelah berhasil menyimpan
            return res.redirect('/alumni');
        } catch (error) {
            console.error("Error saving data:", error);
            return res.status(500).send("Terjadi kesalahan saat menyimpan data.");
        }
    },
    editForm: async function (req, res) {
        const { alumniId } = req.params;
        const tracerStudy = await TracerStudy.findOne({ alumniId: alumniId });
        return res.render('pages/alumni/alumni-edit', { tracerStudy: tracerStudy });
    }, updateForm: async function (req, res) {
        const { nisn } = req.params;
        const { nama, password } = req.body;
        const alumni = await Alumni.findOne({ nisn: nisn });
        alumni.nama = nama;
        alumni.password = password;
        await alumni.save();
        return res.redirect('/alumni');
    }
}