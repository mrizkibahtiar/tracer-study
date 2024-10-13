const mongoose = require('mongoose');

const berwirausahaSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'

    },
    businessName: {
        type: String,
        required: true

    },
    businessType: {
        type: String,
        required: true

    }, // Jenis usaha
    duration: {
        type: Number,
        required: true

    }, // Dalam bulan
    revenue: {
        type: Number,
        optional: true

    }, // Pendapatan jika ada
    challenges: {
        type: String,
        optional: true
    }, // Tantangan yang dihadapi
});

const Berwirausaha = mongoose.model('Berwirausaha', berwirausahaSchema);
