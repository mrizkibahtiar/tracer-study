const mongoose = require("mongoose");

const studiLanjutanSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'

    },
    universityName: {
        type: String,
        required: true

    },
    programStudi: {
        type: String,
        required: true

    },
    duration: {
        type: Number,
        required: true
    }, // Dalam bulan
    scholarship: {
        type: String,
        required: false,
        default: null
    }, // Beasiswa jika ada
});

const StudiLanjutan = mongoose.model('StudiLanjutan', studiLanjutanSchema);
