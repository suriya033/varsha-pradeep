import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    authorNative: {
        type: String,
        required: false,
    },
    authorStudy: {
        type: String,
        required: false,
    },
    image: {
        type: String, // URL or Base64
        required: true,
    }
}, {
    timestamps: true
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
