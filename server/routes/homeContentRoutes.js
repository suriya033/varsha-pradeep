import express from 'express';
import HomeContent from '../models/HomeContent.js';

const router = express.Router();

// Get all content
router.get('/', async (req, res) => {
    try {
        const content = await HomeContent.find();
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new content
router.post('/', async (req, res) => {
    const content = new HomeContent({
        description: req.body.description,
        author: req.body.author,
        image: req.body.image
    });

    try {
        const newContent = await content.save();
        res.status(201).json(newContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update content
router.put('/:id', async (req, res) => {
    try {
        const content = await HomeContent.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        content.description = req.body.description || content.description;
        content.author = req.body.author || content.author;
        content.image = req.body.image || content.image;

        const updatedContent = await content.save();
        res.json(updatedContent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete content
router.delete('/:id', async (req, res) => {
    try {
        const content = await HomeContent.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        await content.deleteOne();
        res.json({ message: 'Content deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
