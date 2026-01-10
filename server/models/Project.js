import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Architecture', 'Interior', 'Landscape', 'Visualisation', 'Technology']
    },
    images: [{
        type: String,
        required: true
    }],
    location: String,
    year: Number,
    client: String,
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
