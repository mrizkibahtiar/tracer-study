const mongoose = require('mongoose');

const pekerjaanSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'Alumni'

    },
    companyName: {
        type: String,
        required: true

    },
    jobPosition: {
        type: String,
        required: true

    },
    duration: {
        type: Number,
        required: true

    }, // Dalam bulan
    salary: {
        type: Number,
        optional: true

    }, // Opsional
    responsibilities: {
        type: String,
        optional: true

    }, // Tanggung jawab di pekerjaan
});

const Pekerjaan = mongoose.model('Pekerjaan', pekerjaanSchema);