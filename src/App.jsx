import React, { useState, useEffect, useRef } from 'react';


import { Menu, X } from 'lucide-react';
import './App.css';

// Import assets
import greatLakesImg from './assets/great lakes.png';
import auditoriumfinalImg from './assets/auditorium final.png';
import bdplfinalImg from './assets/bdpl final.png';
import cognizantinteriorImg from './assets/cognizant interior.png';
import hinduschoolImg from './assets/hindu school.png';
import whirpoolImg from './assets/whirpool.png';
import aboutStudioImg from './assets/about-studio.png';



const projects = [
  {
    id: 1,
    description: "Having worked with them over the last five years their ability to understand the customer’s requirements, come up with refreshing ideas, creative solutions to problems, balance the omnipresent issue of costs and deliverables etc. singularly superlative.",
    author: "-Late Dr. Bala Balachandran great lakes institute of management",
    image: greatLakesImg,
  },
  {
    id: 2,
    description: "Your designs are simply wonderful and the workmanship that results from your guidance is of very high quality.",
    author: "Dr.ashok jhunjhunwala professor, IIT-Madras",
    image: auditoriumfinalImg,
  },
  {
    id: 3,
    description: "You have shown excellent management skills, ensuring quality and timeliness. It is to be noted that you have pointed to opportunities for cost savings. This has allowed ending project on budget.",
    author: "Pau Vila cases ph.D",
    image: bdplfinalImg,
  },
  {
    id: 4,
    description: "Your creative ideas, contrarian views and diligence helped us to create a world class facility. I would gladly recommend you for architectural and interior works, based on your values, business integrity and above all your creative instincts.",
    author: "N.lakshni Narayana president and ceo",
    image: cognizantinteriorImg,
  },
  {
    id: 5,
    description: "We greatly appreciate his sense of commitment, the values he brings to bear on his entire team and on everyone associated with the project, the attention given to minor details while embarking on ambitiously creative ideas, the ease with which abstract concepts are translated to executable drawings and above all the humility that enables him to accept ideas and suggestions from all around him.",
    author: "Sri. Narayan Ramaswamy, HEO, Secretary",
    image: hinduschoolImg,
  },
  {
    id: 6,
    description: "Your seamless collaboration with the cross-functional team and all the related Whirlpool team members was truly impressive, your dedication to delivering top-notch results was evident throughout the project’s lifecycle.",
    author: "Rajesh Sharma",
    image: whirpoolImg,
  },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);






  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [currentIndex]);

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
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <div className="app">

      {/* Fixed Header */}
      <header className="header">
        <div className="header-empty"></div>

        {/* Menu Toggle - Visible on all screens */}
        <button className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
        <div className="hero-logo reveal">VARSHA & PRADEEP ARCHITECTS</div>


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

        {/* Hero Title */}
        <div className="hero-title-container">
          <h1 className="hero-testimonials-title reveal">Our Testimonials</h1>
        </div>


        {/* About / Content Overlay */}
        <div className="about-card fade-in delay-1">
          <p key={`desc-${currentIndex}`} className="text-reveal">{currentProject.description}</p>

          {currentProject.author && (
            <div className="author" key={`author-${currentIndex}`}>
              <span className="line"></span>
              <span className="name text-reveal">{currentProject.author}</span>
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

    </div>
  );
};

export default App;
