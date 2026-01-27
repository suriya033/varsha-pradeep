import mongoose from 'mongoose';

const aboutContentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

export default AboutContent;
