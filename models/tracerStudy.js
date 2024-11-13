const mongoose = require('mongoose');

const tracerStudySchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'
    },
    email: {
        type: String,
        required: true
    },
    tahunLulus: {
        type: Number,
        required: true
    },
    kegiatan: {
        type: String,
        required: true,
        enum: ["Bekerja", "Melanjutkan Studi", "Berwirausaha", "Belum Ada Kegiatan", "Kursus"]
    },
    kegiatanDetail: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        refPath: 'kegiatanRef' // Dinamis berdasarkan kegiatan
    },
    kegiatanRef: {
        type: String,
        required: false,
        default: null,
        enum: ["Pekerjaan", "StudiLanjutan", "Berwirausaha", "Kursus"]
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        required: false,
        ref: 'Feedback'
    }
});


const TracerStudy = mongoose.model('TracerStudy', tracerStudySchema);
module.exports = TracerStudy;