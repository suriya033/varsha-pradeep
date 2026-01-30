import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-quill-new/dist/quill.snow.css';
import '../App.css';

// Import assets (keep for fallback or initial load if DB is empty)
import greatLakesImg from '../assets/great lakes.png';
import aboutStudioImg from '../assets/about-studio.webp';

const initialProjects = [
    {
        _id: '1',
        description: "I having worked with them over the last five years their ability to understand the customer’s requirements, come up with refreshing ideas, creative solutions to problems, balance the omnipresent issue of costs and deliverables etc. singularly superlative.",
        author: "Late Dr. Bala. V. Chandran founder and dean of great lakes institute of management",
        image: greatLakesImg,
    },
];

const Home = () => {
    const [slides, setSlides] = useState(initialProjects);
    const [projects, setProjects] = useState([]);
    const [aboutContent, setAboutContent] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Load from cache first for instant display
        const cachedSlides = localStorage.getItem('home_slides');
        const cachedProjects = localStorage.getItem('home_projects');
        const cachedAbout = localStorage.getItem('home_about');

        if (cachedSlides || cachedProjects || cachedAbout) {
            if (cachedSlides) setSlides(JSON.parse(cachedSlides));
            if (cachedProjects) setProjects(JSON.parse(cachedProjects));
            if (cachedAbout) setAboutContent(JSON.parse(cachedAbout));
            setLoading(false);
        }

        const fetchData = async () => {
            try {
                const [homeRes, projectsRes, aboutRes] = await Promise.all([
                    axios.get(`${API_URL}/api/home-content`),
                    axios.get(`${API_URL}/api/projects`),
                    axios.get(`${API_URL}/api/about-content`)
                ]);

                if (homeRes.data && homeRes.data.length > 0) {
                    setSlides(homeRes.data);
                    localStorage.setItem('home_slides', JSON.stringify(homeRes.data));
                }

                if (projectsRes.data) {
                    setProjects(projectsRes.data);
                    localStorage.setItem('home_projects', JSON.stringify(projectsRes.data));
                }

                if (aboutRes.data) {
                    setAboutContent(aboutRes.data);
                    localStorage.setItem('home_about', JSON.stringify(aboutRes.data));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [API_URL]);

    // Auto-slide logic
    useEffect(() => {
        if (slides.length === 0) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 15000); // 15 seconds interval
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

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const currentSlide = slides[currentIndex] || {};

    return (
        <div className="app">

            {/* Fixed Header */}
            <header className="header">
                <div className="header-empty"></div>

                <div className="header-actions">

                    { /*<button
                        className="admin-header-link"onClick={() => navigate('/admin')}>Admin Login</button>*/}

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

                {/* Slider Navigation Buttons */}
                {slides.length > 1 && (
                    <>
                        <button className="slider-btn prev" onClick={prevSlide} aria-label="Previous slide">
                            <ChevronLeft size={32} />
                        </button>
                        <button className="slider-btn next" onClick={nextSlide} aria-label="Next slide">
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}

                {/* About / Content Overlay */}
                <div className="about-card fade-in delay-1">
                    <div
                        key={`desc-${currentIndex}`}
                        className="text-reveal ql-editor"
                        style={{ padding: 0, minHeight: 'auto' }}
                        dangerouslySetInnerHTML={{
                            __html: (currentSlide.description || '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ')
                        }}
                    />

                    {currentSlide.author && (
                        <div className="author" key={`author-${currentIndex}`}>
                            <span className="line"></span>
                            <div className="author-details" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="name text-reveal">{currentSlide.author}</span>
                                {currentSlide.authorNative && (
                                    <span className="text-reveal" style={{ fontSize: '0.8rem', color: 'hsla(0, 20%, 95%, 0.99)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {currentSlide.authorNative}
                                    </span>
                                )}
                                {currentSlide.authorStudy && (
                                    <span className="text-reveal" style={{ fontSize: '0.75rem', color: 'hsla(0, 100%, 100%, 0.94)' }}>
                                        {currentSlide.authorStudy}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
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
                            {aboutContent.length > 0 ? (
                                aboutContent.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className={`slide-up delay-${(index % 3) + 2} ql-editor`}
                                        style={{ padding: 0, minHeight: 'auto', marginBottom: '1.5rem' }}
                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                    />
                                ))
                            ) : (
                                <>
                                    <p className="slide-up delay-2">We are a team of passionate architects <strong> sharing a common value system </strong> , environment, and resources.</p>
                                    <p className="slide-up delay-2">We love our work and strive towards <strong> creating a living environment where people can live and work with joy.</strong></p>
                                    <p className="slide-up delay-3">We do this by listening. <strong> Listening hard and with sensitivity.</strong></p>
                                    <p className="slide-up delay-3">We value our <strong> clients as "principle visionary," to which we add value</strong> with experience and expertise to evolve a cohesive vision which informs and drives our design solution.</p>
                                    <p className="slide-up delay-3">We treat all stakeholders clients, architects, PMC, and contractors as collaborators, participating in the joy of creation, thus infusing the built space e with with positiv positive energy.</p>
                                    <p className="slide-up delay-3">We use<strong> cutting-edge software like BIM, Al,</strong> and need-based AutoCAD and SketchUp to ensure a <strong> seamless transition from concept to execution.</strong></p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>



            {/* Minimal Footer */}
            <footer className="footer" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#0a0a0a', color: 'white' }}>
                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} Varsha & Pradeep Architects. All rights reserved.</p>
                <button
                    className="admin-footer-link"
                    onClick={() => navigate('/admin')}
                    style={{ marginTop: '1rem' }}
                >
                    Admin Login
                </button>
            </footer>

        </div>
    );
};

export default Home;
