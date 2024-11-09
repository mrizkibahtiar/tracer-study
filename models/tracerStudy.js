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
    graduationYear: {
        type: Number,
        required: true
    },
    activity: {
        type: String,
        required: true,
        enum: ["Bekerja", "Melanjutkan Studi", "Berwirausaha", "Belum ada kegiatan", "Kursus"]
    },
    pekerjaanId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Pekerjaan'
    },
    studiLanjutanId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'StudiLanjutan'
    },
    berwirausahaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Berwirausaha'
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Feedback'
    }
});

const TracerStudy = mongoose.model('TracerStudy', tracerStudySchema);
module.exports = TracerStudy;