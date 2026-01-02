import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import './App.css';

// Import assets
import greatLakesImg from './assets/Great Lakes 1.png';
import auditoriumImg from './assets/auditorium image 1.png';
import hinduSchoolImg from './assets/hindu school 1.png';
import whirlpoolImg from './assets/whirlpool 01.png';

const projects = [
  {
    id: 1,
    title: "Great Lakes Institute",
    description: "A beacon of management excellence. The Great Lakes Institute of Management project showcases our ability to create expansive, functional, and aesthetically pleasing educational environments.",
    author: "N. Lakshmi Narayana",
    image: greatLakesImg
  },
  {
    id: 2,
    title: "Modern Auditorium",
    description: "Acoustic perfection meets modern design. This auditorium project focuses on state-of-the-art acoustics and a dynamic seating arrangement, providing an immersive experience.",
    author: "John Doe",
    image: auditoriumImg
  },
  {
    id: 3,
    title: "The Hindu School",
    description: "Preserving heritage through modern architecture. Our work for The Hindu School blends traditional architectural elements with modern educational requirements.",
    author: "Jane Smith",
    image: hinduSchoolImg
  },
  {
    id: 4,
    title: "Whirlpool Innovation",
    description: "Sleek, industrial, and highly efficient. The Whirlpool project is a testament to our expertise in industrial design, focusing on efficiency and safety.",
    author: "Robert Brown",
    image: whirlpoolImg
  }
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const titleRef = useRef(null);
  const descRef = useRef(null);
  const authorRef = useRef(null);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [currentIndex]);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();

    // Reset initial states
    gsap.set([titleRef.current, descRef.current, authorRef.current], { opacity: 0, y: 20 });

    // Animate Content
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      .to(descRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to(authorRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");

  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="app">
      {/* Fixed Header */}
      <header className="header">
        <div className="logo">VARSHA & PRADEEP</div>

        {/* Menu Toggle - Visible on all screens */}
        <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className="menu-text">{isMobileMenuOpen ? 'BACK' : 'MENU'}</span>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Full Screen Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="menu-overlay">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        {/* Background Images - Stacked for smooth transition */}
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`hero-bg ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${project.image})`,
              zIndex: index === currentIndex ? 1 : 0,
              opacity: index === currentIndex ? 1 : 0
            }}
          >
            <div className="overlay"></div>
          </div>
        ))}

        {/* About / Content Overlay */}
        <div className="about-card">
          <h2 ref={titleRef}>{currentProject.title}</h2>
          <p ref={descRef}>{currentProject.description}</p>
          <div className="author" ref={authorRef}>
            <span className="line"></span>
            <span className="name">{currentProject.author}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
