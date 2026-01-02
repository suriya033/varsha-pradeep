import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Instagram, Linkedin, Mail, Menu, X } from 'lucide-react';
import './App.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          VARSHA <span>&</span> PRADEEP
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="nav-actions">
          <button className="contact-btn">Get in Touch</button>
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

    tl.to(imageRef.current, { scale: 1, opacity: 1, duration: 2 })
      .to(titleRef.current, { y: 0, opacity: 1 }, "-=1.5")
      .to(subtitleRef.current, { y: 0, opacity: 1 }, "-=1.3")
      .to(ctaRef.current, { y: 0, opacity: 1 }, "-=1.1");
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-background" ref={imageRef} style={{ backgroundImage: 'url(/hero-bg.png)' }}>
        <div className="overlay"></div>
      </div>

      <div className="container hero-content">
        <div className="hero-text">
          <h1 ref={titleRef} className="reveal">
            Architectural <br />
            <span>Excellence</span> Defined.
          </h1>
          <p ref={subtitleRef} className="reveal">
            Varsha & Pradeep specialize in creating timeless spaces that blend
            modern innovation with functional elegance.
          </p>
          <div ref={ctaRef} className="hero-btns reveal">
            <button className="primary-btn">
              View Our Work <ArrowRight size={18} />
            </button>
            <button className="secondary-btn">Our Story</button>
          </div>
        </div>

        <div className="hero-socials">
          <a href="#"><Instagram size={20} /></a>
          <a href="#"><Linkedin size={20} /></a>
          <a href="#"><Mail size={20} /></a>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
