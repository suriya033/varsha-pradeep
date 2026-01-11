import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Save, X, RefreshCw, Image as ImageIcon } from 'lucide-react';
import './AdminDashboard.css';

// Import assets for seeding
import greatLakesImg from '../assets/great lakes.png';
import auditoriumfinalImg from '../assets/auditorium final.png';
import bdplfinalImg from '../assets/bdpl final.png';
import cognizantinteriorImg from '../assets/cognizant interior.png';
import hinduschoolImg from '../assets/hindu school.png';
import whirpoolImg from '../assets/whirpool.png';

const initialData = [
    {
        description: "Having worked with them over the last five years their ability to understand the customer’s requirements, come up with refreshing ideas, creative solutions to problems, balance the omnipresent issue of costs and deliverables etc. singularly superlative.",
        author: "Late Dr. Bala Balachandran great lakes institute of management",
        image: greatLakesImg,
    },
    {
        description: "Your designs are simply wonderful and the workmanship that results from your guidance is of very high quality.",
        author: "Dr.ashok jhunjhunwala professor, IIT-Madras",
        image: auditoriumfinalImg,
    },
    {
        description: "You have shown excellent management skills, ensuring quality and timeliness. It is to be noted that you have pointed to opportunities for cost savings. This has allowed ending project on budget.",
        author: "Pau Vila cases ph.D",
        image: bdplfinalImg,
    },
    {
        description: "Your creative ideas, contrarian views and diligence helped us to create a world class facility. I would gladly recommend you for architectural and interior works, based on your values, business integrity and above all your creative instincts.",
        author: "N.lakshmi Narayana president and ceo",
        image: cognizantinteriorImg,
    },
    {
        description: "We greatly appreciate his sense of commitment, the values he brings to bear on his entire team and on everyone associated with the project, the attention given to minor details while embarking on ambitiously creative ideas, the ease with which abstract concepts are translated to executable drawings and above all the humility that enables him to accept ideas and suggestions from all around him.",
        author: "Sri. Narayan Ramaswamy, HEO, Secretary",
        image: hinduschoolImg,
    },
    {
        description: "Your seamless collaboration with the cross-functional team and all the related Whirlpool team members was truly impressive, your dedication to delivering top-notch results was evident throughout the project’s lifecycle.",
        author: "Rajesh Sharma",
        image: whirpoolImg,
    },
];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('home'); // 'home' or 'projects'
    const [content, setContent] = useState([]);
    const [projects, setProjects] = useState([]);

    // Home Content Form State
    const [homeFormData, setHomeFormData] = useState({
        description: '',
        author: '',
        image: ''
    });

    // Project Form State
    const [projectFormData, setProjectFormData] = useState({
        title: '',
        description: '',
        category: 'Architecture',
        location: '',
        year: new Date().getFullYear(),
        client: '',
        images: [] // Array of base64 strings
    });

    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin');
            return;
        }
        fetchContent();
        fetchProjects();
    }, [navigate]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/home-content`);
            setContent(response.data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Helper to convert URL to Base64
    const convertUrlToBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleSeedData = async () => {
        if (!window.confirm('This will add the default data to the database. Continue?')) return;
        setLoading(true);
        try {
            for (const item of initialData) {
                let imageToSend = item.image;
                try {
                    imageToSend = await convertUrlToBase64(item.image);
                } catch (e) {
                    console.warn("Could not convert image to base64, sending as is", e);
                }

                await axios.post(`${API_URL}/api/home-content`, {
                    ...item,
                    image: imageToSend
                });
            }
            fetchContent();
            alert('Default data loaded successfully!');
        } catch (error) {
            console.error('Error seeding data:', error);
            alert('Failed to load default data.');
        } finally {
            setLoading(false);
        }
    };

    // Input Handlers
    const handleHomeInputChange = (e) => {
        const { name, value } = e.target;
        setHomeFormData({ ...homeFormData, [name]: value });
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData({ ...projectFormData, [name]: value });
    };

    // Helper to compress image before upload
    const compressImage = (file, maxWidth = 1920, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (maxWidth / width) * height;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with quality compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleHomeImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setLoading(true);
            try {
                const compressedImage = await compressImage(file);
                setHomeFormData({ ...homeFormData, image: compressedImage });
            } catch (error) {
                console.error('Error compressing image:', error);
                alert('Failed to process image. Please try a different one.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleProjectImagesUpload = async (e) => {
        const files = Array.from(e.target.files);
        setLoading(true);
        try {
            const compressedImages = await Promise.all(
                files.map(file => compressImage(file))
            );
            setProjectFormData(prev => ({
                ...prev,
                images: [...prev.images, ...compressedImages]
            }));
        } catch (error) {
            console.error('Error compressing images:', error);
            alert('Failed to process some images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const removeProjectImage = (index) => {
        setProjectFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Submit Handlers
    const handleHomeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/home-content/${editingId}`, homeFormData);
                alert('Slide updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/home-content`, homeFormData);
                alert('Slide added successfully!');
            }
            resetForm();
            fetchContent();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error saving content:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Error saving content: ${errorMessage}\n\nPlease check:\n1. Server is running on port 5000\n2. MongoDB is connected\n3. Image size is not too large`);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();

        // Validate that at least one image is uploaded
        if (projectFormData.images.length === 0) {
            alert('Please upload at least one image for the project');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/projects/${editingId}`, projectFormData);
                alert('Project updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/projects`, projectFormData);
                alert('Project added successfully!');
            }
            resetForm();
            fetchProjects();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error saving project:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Error saving project: ${errorMessage}\n\nPlease check:\n1. Server is running on port 5000\n2. MongoDB is connected\n3. All required fields are filled\n4. Images are not too large`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item, type) => {
        if (type === 'home') {
            setHomeFormData({
                description: item.description,
                author: item.author,
                image: item.image
            });
        } else {
            // Project edit
            setProjectFormData({
                title: item.title,
                description: item.description,
                category: item.category,
                location: item.location || '',
                year: item.year || new Date().getFullYear(),
                client: item.client || '',
                images: item.images || []
            });
        }
        setEditingId(item._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id, type) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLoading(true);
            try {
                const endpoint = type === 'home' ? 'home-content' : 'projects';
                // Note: Delete route for projects might need to be verified/added
                await axios.delete(`${API_URL}/api/${endpoint}/${id}`);
                if (type === 'home') fetchContent();
                else fetchProjects();
            } catch (error) {
                console.error('Error deleting content:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setHomeFormData({ description: '', author: '', image: '' });
        setProjectFormData({
            title: '',
            description: '',
            category: 'Architecture',
            location: '',
            year: new Date().getFullYear(),
            client: '',
            images: []
        });
        setEditingId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="nav-brand">
                    <h1>Admin Dashboard</h1>
                </div>
                <div className="nav-actions">
                    <button onClick={handleLogout} className="btn btn-outline">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <main className="admin-content">
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        Home Slider
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </button>
                </div>

                <div className="content-header">
                    <h2>{activeTab === 'home' ? 'Manage Home Slides' : 'Manage Projects'}</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus size={18} /> {activeTab === 'home' ? 'Add New Slide' : 'Add New Project'}
                    </button>
                </div>

                {/* Modal / Form Overlay */}
                {isFormOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>
                                    {editingId ? 'Edit' : 'Add New'} {activeTab === 'home' ? 'Slide' : 'Project'}
                                </h3>
                                <button className="close-btn" onClick={() => setIsFormOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            {activeTab === 'home' ? (
                                /* HOME FORM */
                                <form onSubmit={handleHomeSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label>Description </label>
                                        <textarea
                                            name="description"
                                            value={homeFormData.description}
                                            onChange={handleHomeInputChange}
                                            required
                                            placeholder="Enter the testimonial text..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={homeFormData.author}
                                            onChange={handleHomeInputChange}
                                            required
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Background Image</label>
                                        <div className="image-upload-container">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleHomeImageUpload}
                                                id="home-file-upload"
                                                className="file-input"
                                                required={!editingId && !homeFormData.image}
                                            />
                                            <label htmlFor="home-file-upload" className="file-label">
                                                {homeFormData.image ? 'Change Image' : 'Choose Image'}
                                            </label>
                                            {homeFormData.image && (
                                                <div className="preview-container">
                                                    <img src={homeFormData.image} alt="Preview" className="image-preview" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="btn btn-text" onClick={() => setIsFormOpen(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            <Save size={18} /> {editingId ? 'Update Slide' : 'Save Slide'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* PROJECT FORM */
                                <form onSubmit={handleProjectSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label>Project Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={projectFormData.title}
                                            onChange={handleProjectInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={projectFormData.category}
                                            onChange={handleProjectInputChange}
                                            className="form-select"
                                        >
                                            <option value="Architecture">Architecture</option>
                                            <option value="Interior">Interior</option>
                                            <option value="Landscape">Landscape</option>
                                            <option value="Visualisation">Visualisation</option>
                                            <option value="Technology">Technology</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            value={projectFormData.description}
                                            onChange={handleProjectInputChange}
                                            required
                                            rows={4}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group half">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={projectFormData.location}
                                                onChange={handleProjectInputChange}
                                            />
                                        </div>
                                        <div className="form-group half">
                                            <label>Year</label>
                                            <input
                                                type="number"
                                                name="year"
                                                value={projectFormData.year}
                                                onChange={handleProjectInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Client</label>
                                        <input
                                            type="text"
                                            name="client"
                                            value={projectFormData.client}
                                            onChange={handleProjectInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Project Images (Select Multiple)</label>
                                        <div className="image-upload-container">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleProjectImagesUpload}
                                                id="project-file-upload"
                                                className="file-input"
                                            />
                                            <label htmlFor="project-file-upload" className="file-label">
                                                <Plus size={16} /> Add Images
                                            </label>

                                            <div className="images-grid-preview">
                                                {projectFormData.images.map((img, idx) => (
                                                    <div key={idx} className="preview-thumb">
                                                        <img src={img} alt={`Preview ${idx}`} />
                                                        <button
                                                            type="button"
                                                            className="remove-img-btn"
                                                            onClick={() => removeProjectImage(idx)}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="btn btn-text" onClick={() => setIsFormOpen(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            <Save size={18} /> {editingId ? 'Update Project' : 'Save Project'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="slides-grid">
                    {activeTab === 'home' ? (
                        content.length === 0 && !loading ? (
                            <div className="empty-state">
                                <p>No slides found. Click "Load Defaults" to start.</p>
                            </div>
                        ) : (
                            content.map((item) => (
                                <div key={item._id} className="slide-card">
                                    <div className="slide-image-wrapper">
                                        <img src={item.image} alt="Slide Background" />
                                        <div className="slide-overlay">
                                            <div className="slide-actions">
                                                <button onClick={() => handleEdit(item, 'home')} className="action-btn edit" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id, 'home')} className="action-btn delete" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slide-details">
                                        <p className="slide-author">{item.author}</p>
                                        <p className="slide-desc">{item.description}</p>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        /* PROJECTS GRID */
                        projects.length === 0 && !loading ? (
                            <div className="empty-state">
                                <p>No projects found. Add your first project!</p>
                            </div>
                        ) : (
                            projects.map((item) => (
                                <div key={item._id} className="slide-card">
                                    <div className="slide-image-wrapper">
                                        <img src={item.images[0]} alt="Project Cover" />
                                        <div className="slide-overlay">
                                            <div className="slide-actions">
                                                <button onClick={() => handleEdit(item, 'projects')} className="action-btn edit" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item._id, 'projects')} className="action-btn delete" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slide-details">
                                        <p className="slide-author">{item.title}</p>
                                        <span className="badge">{item.category}</span>
                                        <p className="slide-desc" style={{ marginTop: '0.5rem' }}>{item.description}</p>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
