import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X, ArrowRight, ArrowLeft, Instagram, Linkedin, Mail } from 'lucide-react';
import './App.css';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const bgImages = ['/hero-bg.png', '/hero-bg.jpg'];

  const menuRef = useRef(null);
  const bgRef = useRef(null);
  const aboutRef = useRef(null);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        display: 'flex'
      });
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in',
        onComplete: () => {
          if (menuRef.current) menuRef.current.style.display = 'none';
        }
      });
    }
  }, [isMenuOpen]);

  const nextBg = () => {
    setCurrentBg((prev) => (prev + 1) % bgImages.length);
  };

  const prevBg = () => {
    setCurrentBg((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          VARSHA <span>&</span> PRADEEP
        </div>
        <div className="nav-right">
          <button className="styled-menu-btn" onClick={() => setIsMenuOpen(true)}>
            <span className="btn-text"></span>
            <div className="hamburger">
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div className="menu-overlay" ref={menuRef}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
          <X size={40} />
        </button>
        <div className="menu-links">
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${bgImages[currentBg]})` }}
          key={currentBg}
        >
          <div className="overlay"></div>
        </div>

        <div className="hero-content">
          

          {/* About Container */}
          <div className="about-container reveal" ref={aboutRef}>
            <h3>About the Project</h3>
            <p>
              This structure represents our commitment to sustainable and modern
              architectural practices, blending form and function seamlessly.
            </p>
           
          </div>
        </div>

      
       
      </section>
    </div>
  );
};

export default App;
