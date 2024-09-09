// src/components/Works.js
import React, { useState, useEffect } from 'react';
import { FaArrowRight,FaTimes } from 'react-icons/fa';
import mixitup from 'mixitup';
import workCrm from '../Assets/workCrm.png';
import worksCoffee from '../Assets/works-coffe.jpg';
import worksLogo from '../Assets/works-logo.png';
import worksHardware from '../Assets/works-hardware.jpg';
import worksIceCubeVedio from '../Assets/works-iceCubeVedio.PNG';
import worksVedio from '../Assets/works-vedio.PNG';
import dress from '../Assets/dress.png';

function Works() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mixer, setMixer] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);

  useEffect(() => {
    const mixer = mixitup('.works-container', {
      selectors: {
        target: '.works-card'
      },
      animation: {
        duration: 300
      }
    });
    setMixer(mixer);

    return () => {
      if (mixer) {
        mixer.destroy();
      }
    };
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (mixer) {
      mixer.filter(filter === 'all' ? '.mix' : `.${filter}`);
    }
  };

  

  const works = [
    { 
      title: 'Web Design', 
      category: 'web', 
      image: workCrm,
      details: {
        title: 'Customer Relationship Management System',
        description: 'A state-of-the-art CRM platform designed to enhance customer interactions and streamline business processes. Implemented modules for customer contact management, sales and lead tracking, communication automation, and customer support. Empowered businesses with robust reporting and analytics tools, improving customer satisfaction and operational efficiency.',
        created: '4 July 2024',
        technologies: 'Reactjs Microsoft SQL .net API',
        role: 'Full stack developer',
        view: 'https://github.com/heelibathdeniyahanb/SolexCodeCRMNew'
      }
    },
    { 
      title: 'Web Design', 
      category: 'web', 
      image: dress,
      details: {
        title: 'Website for Clothing Atelier',
        description: 'A modern and user-friendly online dress shop designed to offer a seamless shopping experience. Features include an intuitive dress selection interface, easy add-to-cart functionality, and secure payment processing. Customers can track their order status in real-time, from processing to delivery, ensuring transparency and convenience. The platform streamlines the shopping journey, empowering users with effortless navigation, personalized recommendations, and efficient customer service.',
        created: '8 September 2024',
        technologies: 'Reactjs Microsoft SQL .net API',
        role: 'Full stack developer',
        view: 'https://github.com/Naveesha1/Dress-store'
      }
    },

    { 
      title: 'Web Design', 
      category: 'web', 
      image: worksCoffee,
      details: {
        title: 'Website for coffee shop',
        description: 'Created a modern, user-friendly website for a local coffee shop, featuring an intuitive layout, responsive design, and integrated online menu. Utilized HTML, CSS, and JavaScript to enhance user experience and drive customer engagement.',
        created: '2 yrs ago',
        technologies: 'html css JavaScript',
        role: 'Frontend',
        view: 'https://github.com/Naveesha1/coffeeshop.github.io'
      }
    },
    { 
      title: 'Logo Design', 
      category: 'graphic', 
      image: worksLogo,
      details: {
        title: 'Logo design creativity & application',
        description: 'Crafted a unique and elegant logo for a jewelry shop, reflecting its brand identity and appeal. Employed graphic design principles and software to create a visually striking and memorable brand symbol.',
        created: '14 March 2024',
        technologies: 'GIMP',
        role: 'Frontend',
        view: 'https://drive.google.com/file/d/1IvJahZQ33ZOT_wj2MzZ4qr8hQpkb87nu/view?usp=sharing'
      }
    },
    { 
      title: 'Hardware Project', 
      category: 'hardware', 
      image: worksHardware,
      details: {
        title: 'IoT - Real Time Gas Station Fuel Tank',
        description: 'Developed an innovative real-time monitoring solution for gas station fuel tanks using an ESP32 Devkit V1 board and various sensors. The system tracks fuel volume, temperature, and pressure, logging data offline and syncing to Firebase. An intuitive web application provides graphical data visualization, ensuring efficient fuel management and timely replenishment.',
        created: '1 year ago',
        technologies: 'Hardware Components',
        role: 'Contributed holistically',
        view: '#'
      }
    },
    { 
      title: 'Ice Cube Video', 
      category: 'graphic', 
      image: worksIceCubeVedio,
      details: {
        title: 'Ice Cube dropping Video',
        description: 'Created a dynamic short video in Blender, showcasing ice cubes dropping into a glass of water with realistic water splash effects.',
        created: '22 Jan 2024',
        technologies: 'Blender',
        role: 'Solo creator',
        view: 'https://drive.google.com/file/d/17iY23y2krM0UV9dbvqJmoXf7VHA32X_T/view?usp=sharing'
      }
    },
    { 
      title: 'Rendered Video', 
      category: 'graphic', 
      image: worksVedio,
      details: {
        title: 'Rendered Video',
        description: 'Produced a detailed 3D render of a burial ground using Blender, showcasing intricate textures and atmospheric effects, created during my free time.',
        created: '10 Feb 2024',
        technologies: 'Blender',
        role: 'Solo creator',
        view: 'https://drive.google.com/file/d/188llgm3HgE_A0fvChCoiHVbkY8WExePL/view?usp=sharing'
      }
    }
  ];

  const openPopup = (work) => {
    setSelectedWork(work);
  };

  const closePopup = () => {
    setSelectedWork(null);
  };

  return (
    <section className="works" id="works">
      <div className="max-width">
        <h2 className="title">Recent Work</h2>
        <div className="works-content">
          <div className="works-filter">
            {['all', 'web', 'graphic', 'hardware'].map((filter) => (
              <span
                key={filter}
                className={`works-item ${activeFilter === filter ? 'active-works' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            ))}
          </div>
          <div className="works-container container grid">
            {works.map((work, index) => (
               <div className={`works-card mix ${work.category}`} key={index}>
               <img src={work.image} alt="" className="works-img" />
               <h3 className="works-title">{work.title}</h3>
               <span className="works-button" onClick={() => openPopup(work)}>
                 Demo
                 <FaArrowRight className="works-button-icon" />
               </span>
               </div>
            ))}
          </div>
        </div>
      </div>

      {selectedWork && (
        <div className="portfolio-popup open">
          <div className="portfolio-popup-inner">
            <div className="portfolio-popup-content">
              <span className="portfolio-popup-close" onClick={closePopup}>
                <FaTimes />
              </span>
              <div className="pp-thumbnail">
                <img src={selectedWork.image} alt="" className="portfolio-popup-img" />
              </div>
              <div className="portfolio-popup-info">
                <h3 className="details-title">{selectedWork.details.title}</h3>
                <p className="details-description">{selectedWork.details.description}</p>
                <ul className="details-info">
                  <li>Created - <span>{selectedWork.details.created}</span></li>
                  <li>Technologies - <span>{selectedWork.details.technologies}</span></li>
                  <li>Role - <span>{selectedWork.details.role}</span></li>
                  <li>View - <span><a href={selectedWork.details.view}>{selectedWork.details.view}</a></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Works;
