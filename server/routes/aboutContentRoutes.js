import express from 'express';
import AboutContent from '../models/AboutContent.js';

const router = express.Router();

// Get all about content
router.get('/', async (req, res) => {
    try {
        const content = await AboutContent.find().sort({ order: 1 }).lean();
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new about content
router.post('/', async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const content = new AboutContent({
            content: req.body.content,
            order: req.body.order || 0
        });

        const newContent = await content.save();
        res.status(201).json(newContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update about content
router.put('/:id', async (req, res) => {
    try {
        const content = await AboutContent.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        content.content = req.body.content || content.content;
        content.order = req.body.order !== undefined ? req.body.order : content.order;

        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete about content
router.delete('/:id', async (req, res) => {
    try {
        const content = await AboutContent.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        await content.deleteOne();
        res.json({ message: 'Content deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
