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
    description: "Having worked with them over the last five years their ability to understand the customer’s requirements, come up with refreshing ideas, creative solutions to problems, balance the omnipresent issue of costs and deliverables etc. singularly superlative.",
    author: "-Late Dr. Bala Balachandran great lakes institute of management",
    image: greatLakesImg
  },
  {
    id: 2,
    description: "Your designs are simply wonderful and the workmanship that results from your guidance is of very high quality.",
    image: auditoriumImg
  },
  {
    id: 3,
    description: "We greatly appreciate his sense of commitment, the values he brings to bear on his entire team and on everyone associated with the project, the attention given to minor details while embarking on ambitiously creative ideas, the ease with which abstract concepts are translated to executable drawings and above all the humility that enables him to accept ideas and suggestions from all around him.",
    author: "-Sri. Narayan Ramaswamy, HEO, Secretary",
    image: hinduSchoolImg
  },
  {
    id: 4,
    description: "Your seamless collaboration with the cross-functional team and all the related Whirlpool team members was truly impressive, your dedication to delivering top-notch results was evident throughout the project’s lifecycle.",
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
        <div className="logo">VARSHA & PRADEEP ARCHITECTS</div>

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
