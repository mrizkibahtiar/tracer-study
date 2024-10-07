const mongoose = require('mongoose');

const TracerStudySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    kegiatanSetelahLulus: {
        type: String,
        enum: ['bekerja', 'melanjutkan studi', 'berwirausaha', 'belum bekerja', 'kursus'],
        required: true
    },
    tahunLulus: {
        type: Number,
        required: true
    },
    durasiSebelumKegiatan: {
        type: Number
    }, // misalnya dalam bulan
    // Fields khusus berdasarkan pilihan
    namaPerusahaan: {
        type: String
    }, // hanya diisi jika bekerja
    posisi: {
        type: String
    },          // hanya diisi jika bekerja
    namaInstitusi: {
        type: String
    },   // hanya diisi jika melanjutkan studi
    jurusan: {
        type: String
    },         // hanya diisi jika melanjutkan studi
    jenisUsaha: {
        type: String
    },      // hanya diisi jika berwirausaha
    feedback: {
        type: mongoose.Schema.ObjectId,
        ref: 'Feedback',

    }         // bisa diisi oleh semua alumni
});


const TracerStudy = mongoose.model('TracerStudy', TracerStudySchema);
module.exports = TracerStudy;

TracerStudy.create({
    userId: '123',
    kegiatanSetelahLulus: 'bekerja',
    tahunLulus: 2018,
    durasiSebelumKegiatan: 3,
    namaPerusahaan: 'PT. ABC',
    posisi: 'Manager',
    namaInstitusi: 'Universitas ABC',
    jurusan: 'Ilmu Komputer',
    jenisUsaha: 'Pengembangan Bisnis',
    feedback: 'Sangat memuaskan'
})