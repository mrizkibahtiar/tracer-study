const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    alumniId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;