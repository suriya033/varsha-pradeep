import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Import assets (keep for fallback or initial load if DB is empty)
import greatLakesImg from '../assets/great lakes.png';
import auditoriumfinalImg from '../assets/auditorium final.png';
import bdplfinalImg from '../assets/bdpl final.png';
import cognizantinteriorImg from '../assets/cognizant interior.png';
import hinduschoolImg from '../assets/hindu school.png';
import whirpoolImg from '../assets/whirpool.png';
import aboutStudioImg from '../assets/about-studio.png';

const initialProjects = [
    {
        _id: '1',
        description: "Having worked with them over the last five years their ability to understand the customer’s requirements, come up with refreshing ideas, creative solutions to problems, balance the omnipresent issue of costs and deliverables etc. singularly superlative.",
        author: "Late Dr. Bala Balachandran great lakes institute of management",
        image: greatLakesImg,
    },
];

const Home = () => {
    const [slides, setSlides] = useState(initialProjects);
    const [projects, setProjects] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/home-content');
                if (response.data && response.data.length > 0) {
                    setSlides(response.data);
                }
            } catch (error) {
                console.error('Error fetching home content:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchHomeContent();
        fetchProjects();
    }, []);

    // Auto-slide logic
    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds interval
        return () => clearInterval(interval);
    }, [currentIndex, slides]);

    // Scroll Animation Logic (Intersection Observer)
    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal, .fade-in, .slide-up');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const currentSlide = slides[currentIndex] || {};

    return (
        <div className="app">

            {/* Fixed Header */}
            <header className="header">
                <div className="header-empty"></div>

                <div className="header-actions">
                    <button
                        className="admin-header-link"
                        onClick={() => navigate('/admin')}
                    >
                        Admin
                    </button>
                    {/* Menu Toggle - Visible on all screens */}
                    <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>


            {/* Full Screen Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="menu-overlay">
                    <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                    <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                    <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                    <button
                        className="admin-login-link"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/admin');
                        }}
                    >
                        Admin Login
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-logo reveal">VARSHA & PRADEEP ARCHITECTS</div>


                {/* Background Images - Stacked for smooth transition */}
                {slides.map((slide, index) => {
                    let positionClass = 'slide-next';
                    if (index === currentIndex) {
                        positionClass = 'slide-active';
                    } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                        positionClass = 'slide-prev';
                    }

                    return (
                        <div
                            key={slide._id || index}
                            className={`hero-bg ${positionClass}`}
                            style={{
                                backgroundImage: `url(${slide.image})`,
                            }}
                        >
                            <div className="overlay"></div>
                        </div>
                    );
                })}

                {/* Hero Title */}
                <div className="hero-title-container">
                    <h1 className="hero-testimonials-title reveal">Our Testimonials</h1>
                </div>


                {/* About / Content Overlay */}
                <div className="about-card fade-in delay-1">
                    <p key={`desc-${currentIndex}`} className="text-reveal">{currentSlide.description}</p>

                    {currentSlide.author && (
                        <div className="author" key={`author-${currentIndex}`}>
                            <span className="line"></span>
                            <span className="name text-reveal">{currentSlide.author}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="projects-section">
                <div className="section-container">
                    <h2 className="section-title reveal">Our Projects</h2>
                    <div className="projects-grid">
                        {projects.length === 0 ? (
                            <p className="empty-msg reveal">No projects to display yet.</p>
                        ) : (
                            projects.map((project, index) => (
                                <div key={project._id} className="project-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="project-image">
                                        <img src={project.images[0]} alt={project.title} />
                                        <div className="project-overlay">
                                            <span className="project-category">{project.category}</span>
                                        </div>
                                    </div>
                                    <div className="project-info">
                                        <h3>{project.title}</h3>
                                        <p>{project.location} {project.year ? `| ${project.year}` : ''}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="about-image reveal">
                        <img src={aboutStudioImg} alt="Architecture Studio" loading="eager" fetchpriority="high" />
                    </div>
                    <div className="about-content">
                        <h2 className="about-title reveal">About Us</h2>
                        <div className="about-divider reveal delay-1"></div>
                        <div className="about-description">
                            <p className="slide-up delay-2">A team of passionate architects sharing a common value system and shared environment and resources.</p>
                            <p className="slide-up delay-2">We love our work and strive towards creating a beautiful living environment where people can work in joy.</p>
                            <p className="slide-up delay-3">We do this by listening. Listening hard and with sensibility.</p>
                            <p className="slide-up delay-3">We value our clients as the principal visionary and with our experience add value to evolve and evolved it. Vision that form the basis of our design.</p>
                            <p className="slide-up delay-3">We believe in a collaboration effort between all stakeholders client, architect, PMC and contractor to where each partakes in the joy of creation infusing the building with a positive energy ultimately benefitting the end users.</p>
                            <p className="slide-up delay-3">We are cutting edge looks like BIM, AI on a need basis Autocad, Sketchup to ensure seamless transition from concept to execution.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="section-container">
                    <h2 className="section-title reveal">Contact Us</h2>
                    <div className="contact-grid">
                        <div className="contact-info reveal">
                            <div className="contact-item">
                                <h3>Location</h3>
                                <p>Chennai, India</p>
                            </div>
                            <div className="contact-item">
                                <h3>Email</h3>
                                <p>contact@varshapradeep.com</p>
                            </div>
                            <div className="contact-item">
                                <h3>Phone</h3>
                                <p>+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="contact-form reveal delay-1">
                            <p>We are always open to new collaborations and projects.</p>
                            <button className="btn-primary" style={{ marginTop: '1rem', padding: '1rem 2rem' }}>Send a Message</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">VARSHA & PRADEEP</div>
                    <div className="footer-links">
                        <a href="#home">Home</a>
                        <a href="#projects">Projects</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Varsha & Pradeep Architects. All rights reserved.</p>
                        <button
                            className="admin-footer-link"
                            onClick={() => navigate('/admin')}
                        >
                            Admin Login
                        </button>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;
