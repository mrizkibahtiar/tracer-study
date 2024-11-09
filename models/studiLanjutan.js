const mongoose = require("mongoose");

const studiLanjutanSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Alumni'

    },
    namaUniveritas: {
        type: String,
        required: true
    },
    alamatUniveritas: {
        type: String,
        required: true
    },
    fakultas: {
        type: String,
        required: true
    },
    programStudi: {
        type: String,
        required: true
    },
    tanggalMasuk: {
        type: Date,
        required: true
    }, // Dalam bulan
});

const StudiLanjutan = mongoose.model('StudiLanjutan', studiLanjutanSchema);
