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

// Update a project
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Update fields if they exist in req.body
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.category = req.body.category || project.category;
        project.images = req.body.images || project.images;
        project.location = req.body.location || project.location;
        project.year = req.body.year || project.year;
        project.client = req.body.client || project.client;
        project.featured = req.body.featured !== undefined ? req.body.featured : project.featured;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
