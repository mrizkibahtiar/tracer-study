
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
        const alumni = await Alumni.findOne({ nisn: req.session.user.nisn });
        const tracerStudy = await TracerStudy.findOne({ alumniId: alumniId }).populate('kegiatanDetail').populate('feedback');
        return res.render('pages/alumni/alumni-edit', { tracerStudy: tracerStudy, alumni: alumni });
    }, updateForm: async function (req, res) {
        try {
            const validRefs = {
                "Bekerja": "Pekerjaan",
                "Melanjutkan Studi": "StudiLanjutan",
                "Berwirausaha": "Berwirausaha",
                "Kursus": "Kursus"
            };

            const { nisn } = req.session.user;
            const { email, tahunLulus, kegiatan, feedbackDetail } = req.body;

            // Cari data tracer study berdasarkan NISN
            const tracerStudy = await TracerStudy.findOne({ alumniId: (await Alumni.findOne({ nisn }))._id });

            if (!tracerStudy) {
                return res.status(404).send("Data tracer study tidak ditemukan.");
            }

            let kegiatanRef = validRefs[kegiatan] || null;
            let kegiatanDetailId = tracerStudy.kegiatanDetail;
            let feedbackId = tracerStudy.feedback;

            // Jika kegiatan berubah, hapus dokumen lama dan buat dokumen baru
            if (tracerStudy.kegiatan !== kegiatan) {
                if (tracerStudy.kegiatanRef) {
                    const PreviousModel = mongoose.model(tracerStudy.kegiatanRef);
                    await PreviousModel.findByIdAndDelete(tracerStudy.kegiatanDetail);
                    kegiatanDetailId = null; // Set kegiatanDetailId ke null
                }

                if (kegiatan in validRefs) {
                    const KegiatanModel = mongoose.model(kegiatanRef);
                    let kegiatanData;

                    if (kegiatan === "Bekerja") {
                        const { namaPerusahaan, alamatPerusahaan, teleponPerusahaan, sektorPerusahaan, posisi, tanggalMasukBekerja } = req.body;
                        kegiatanData = new KegiatanModel({
                            alumniId: tracerStudy.alumniId,
                            namaPerusahaan,
                            alamatPerusahaan,
                            teleponPerusahaan,
                            sektorPerusahaan,
                            posisi,
                            tanggalMasuk: tanggalMasukBekerja
                        });
                    } else if (kegiatan === "Melanjutkan Studi") {
                        const { namaUniversitas, alamatUniversitas, fakultas, programStudi, tanggalMasukUniversitas } = req.body;
                        kegiatanData = new KegiatanModel({
                            alumniId: tracerStudy.alumniId,
                            namaUniversitas,
                            alamatUniversitas,
                            fakultas,
                            programStudi,
                            tanggalMasuk: tanggalMasukUniversitas
                        });
                    } else if (kegiatan === "Berwirausaha") {
                        const { namaUsaha, alamatUsaha, teleponUsaha, bidangUsaha, jumlahKaryawan, tanggalMulaiUsaha } = req.body;
                        kegiatanData = new KegiatanModel({
                            alumniId: tracerStudy.alumniId,
                            namaUsaha,
                            alamatUsaha,
                            teleponUsaha,
                            bidangUsaha,
                            jumlahKaryawan,
                            tanggalMulai: tanggalMulaiUsaha
                        });
                    } else if (kegiatan === "Kursus") {
                        const { namaKursus, alamatKursus, bidangKursus, tanggalMulaiKursus, tanggalSelesaiKursus } = req.body;
                        kegiatanData = new KegiatanModel({
                            alumniId: tracerStudy.alumniId,
                            namaKursus,
                            alamatKursus,
                            bidangKursus,
                            tanggalMulai: tanggalMulaiKursus,
                            tanggalSelesai: tanggalSelesaiKursus
                        });
                    }

                    const savedKegiatan = await kegiatanData.save();
                    kegiatanDetailId = savedKegiatan._id;
                } else if (kegiatan === "Belum Ada Kegiatan") {
                    kegiatanDetailId = null;
                }
            } else if (kegiatan in validRefs) {
                // Jika kegiatan sama, update dokumen kegiatan
                const KegiatanModel = mongoose.model(kegiatanRef);
                const existingKegiatan = await KegiatanModel.findById(kegiatanDetailId);

                if (existingKegiatan) {
                    if (kegiatan === "Bekerja") {
                        const { namaPerusahaan, alamatPerusahaan, teleponPerusahaan, sektorPerusahaan, posisi, tanggalMasukBekerja } = req.body;
                        Object.assign(existingKegiatan, {
                            namaPerusahaan,
                            alamatPerusahaan,
                            teleponPerusahaan,
                            sektorPerusahaan,
                            posisi,
                            tanggalMasuk: tanggalMasukBekerja
                        });
                    } else if (kegiatan === "Melanjutkan Studi") {
                        const { namaUniversitas, alamatUniversitas, fakultas, programStudi, tanggalMasukUniversitas } = req.body;
                        Object.assign(existingKegiatan, {
                            namaUniversitas,
                            alamatUniversitas,
                            fakultas,
                            programStudi,
                            tanggalMasuk: tanggalMasukUniversitas
                        });
                    } else if (kegiatan === "Berwirausaha") {
                        const { namaUsaha, alamatUsaha, teleponUsaha, bidangUsaha, jumlahKaryawan, tanggalMulaiUsaha } = req.body;
                        Object.assign(existingKegiatan, {
                            namaUsaha,
                            alamatUsaha,
                            teleponUsaha,
                            bidangUsaha,
                            jumlahKaryawan,
                            tanggalMulai: tanggalMulaiUsaha
                        });
                    } else if (kegiatan === "Kursus") {
                        const { namaKursus, alamatKursus, bidangKursus, tanggalMulaiKursus, tanggalSelesaiKursus } = req.body;
                        Object.assign(existingKegiatan, {
                            namaKursus,
                            alamatKursus,
                            bidangKursus,
                            tanggalMulai: tanggalMulaiKursus,
                            tanggalSelesai: tanggalSelesaiKursus
                        });
                    }

                    await existingKegiatan.save();
                }
            }

            // Update data feedback
            const feedback = await Feedback.findById(feedbackId);
            if (feedback) {
                feedback.pesan = feedbackDetail;
                await feedback.save();
            } else {
                const newFeedback = new Feedback({
                    alumniId: tracerStudy.alumniId,
                    pesan: feedbackDetail
                });
                const savedFeedback = await newFeedback.save();
                feedbackId = savedFeedback._id;
            }

            // Update data tracer study
            tracerStudy.email = email.trim();
            tracerStudy.tahunLulus = tahunLulus.trim();
            tracerStudy.kegiatan = kegiatan.trim();
            tracerStudy.kegiatanRef = kegiatanRef;
            tracerStudy.kegiatanDetail = kegiatanDetailId;
            tracerStudy.belumAdaKegiatanDetail = kegiatan === "Belum Ada Kegiatan" ? req.body.kegiatanDetail : null;
            tracerStudy.feedback = feedbackId;

            await tracerStudy.save();

            // Redirect setelah berhasil menyimpan
            return res.redirect('/alumni');
        } catch (error) {
            console.error("Error editing data:", error);
            return res.status(500).send("Terjadi kesalahan saat mengedit data.");
        }
    }

}