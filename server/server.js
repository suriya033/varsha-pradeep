import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import projectRoutes from './routes/projectRoutes.js';
import homeContentRoutes from './routes/homeContentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/home-content', homeContentRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/varsha-pradeep';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('---------------------------------');
        console.log('✅ Connected to MongoDB');
        console.log(`📍 URI: ${MONGODB_URI}`);
        console.log('---------------------------------');
    })
    .catch((err) => {
        console.log('---------------------------------');
        console.log('❌ MongoDB connection error:');
        console.error(err.message);
        console.log('---------------------------------');
        console.log('Tip: Make sure your local MongoDB service is running or check your MONGODB_URI in .env');
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
