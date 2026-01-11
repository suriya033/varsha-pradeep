import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a project
router.post('/', async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.title || !req.body.description || !req.body.category) {
            return res.status(400).json({
                message: 'Missing required fields. Please provide title, description, and category.'
            });
        }

        if (!req.body.images || req.body.images.length === 0) {
            return res.status(400).json({
                message: 'At least one image is required for the project.'
            });
        }

        const project = new Project(req.body);
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(400).json({ message: err.message });
    }
});

export default router;
