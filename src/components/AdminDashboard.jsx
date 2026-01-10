import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Save, X, RefreshCw } from 'lucide-react';
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
    const [content, setContent] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        author: '',
        image: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin');
            return;
        }
        fetchContent();
    }, [navigate]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/home-content');
            setContent(response.data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to convert image URL to Base64
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
                // Convert imported image path to base64 if needed, or send as is if backend handles it
                // Since these are local dev assets, we might need to fetch them to get base64
                // For simplicity in dev, we'll try sending the path, but for real persistence, base64 is safer here
                // as the backend won't have access to Vite's dev server paths easily.

                // Let's try to convert to base64 for storage
                let imageToSend = item.image;
                try {
                    imageToSend = await convertUrlToBase64(item.image);
                } catch (e) {
                    console.warn("Could not convert image to base64, sending as is", e);
                }

                await axios.post('http://localhost:5000/api/home-content', {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/home-content/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/home-content', formData);
            }
            resetForm();
            fetchContent();
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            description: item.description,
            author: item.author,
            image: item.image
        });
        setEditingId(item._id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:5000/api/home-content/${id}`);
                fetchContent();
            } catch (error) {
                console.error('Error deleting content:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({ description: '', author: '', image: '' });
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
                    <span className="badge">Home Section</span>
                </div>
                <div className="nav-actions">
                    <button onClick={handleSeedData} className="btn btn-secondary" disabled={loading}>
                        <RefreshCw size={18} /> Load Defaults
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <main className="admin-content">
                <div className="content-header">
                    <h2>Manage Slides</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus size={18} /> Add New Slide
                    </button>
                </div>

                {/* Modal / Form Overlay */}
                {isFormOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{editingId ? 'Edit Slide' : 'New Slide'}</h3>
                                <button className="close-btn" onClick={() => setIsFormOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="admin-form">
                                <div className="form-group">
                                    <label>Description (Testimonial)</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter the testimonial text..."
                                        rows={4}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Author / Client</label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Dr. John Doe, CEO"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Background Image</label>
                                    <div className="image-upload-container">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            id="file-upload"
                                            className="file-input"
                                            required={!editingId}
                                        />
                                        <label htmlFor="file-upload" className="file-label">
                                            {formData.image ? 'Change Image' : 'Choose Image'}
                                        </label>
                                        {formData.image && (
                                            <div className="preview-container">
                                                <img src={formData.image} alt="Preview" className="image-preview" />
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
                        </div>
                    </div>
                )}

                {/* Content Grid */}
                <div className="slides-grid">
                    {content.length === 0 && !loading ? (
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
                                            <button onClick={() => handleEdit(item)} className="action-btn edit" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="action-btn delete" title="Delete">
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
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
