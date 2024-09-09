// src/components/Navbar.js
import React, { useState, useEffect } from 'react';


function Navbar() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${sticky ? 'sticky' : ''}`}>
      <div className="max-width">
        <div className="logo"><a href="#"><span>Profo</span>lio.</a></div>
        <ul className="menu">
          <li><a href="#home" className="menu-btn">Home</a></li>
          <li><a href="#about" className="menu-btn">About</a></li>
          <li><a href="#services" className="menu-btn">Services</a></li>
          <li><a href="#skills" className="menu-btn">Skills</a></li>
          <li><a href="#works" className="menu-btn">Works</a></li>
          <li><a href="#contact" className="menu-btn">Contact</a></li>
          <li><a href="https://drive.google.com/file/d/1ahY0N0_kE8LumDl6uJWX8UW88d3k79BA/view?usp=sharing" className="menu-btn">CV</a></li>
        </ul>
        <div className="menu-btn">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;