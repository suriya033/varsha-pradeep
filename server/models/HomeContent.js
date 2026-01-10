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
    image: {
        type: String, // URL or Base64
        required: true,
    }
}, {
    timestamps: true
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

export default HomeContent;
