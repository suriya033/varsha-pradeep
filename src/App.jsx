import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Instagram, Linkedin, Mail, Menu, X } from 'lucide-react';
import './App.css';

const HubBar = () => {
  const hubRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(hubRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 1 }
    );
  }, []);

  return (
    <div className="hub-bar-wrapper" ref={hubRef}>
      <div className="hub-bar glass">
        <div className="hub-logo">
          VARSHA & PRADEEP
        </div>

        <div className="hub-nav">
          <a href="#home" className="hub-item active">
            <span className="hub-icon">H</span>
            <span className="hub-label">Home</span>
          </a>
          <a href="#projects" className="hub-item">
            <span className="hub-icon">P</span>
            <span className="hub-label">Projects</span>
          </a>
          <a href="#contact" className="hub-item">
            <span className="hub-icon">C</span>
            <span className="hub-label">Contact</span>
          </a>
        </div>

      </div>
    </div>
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
      <HubBar />
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
