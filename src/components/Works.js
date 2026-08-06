// src/components/Works.js
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import mixitup from 'mixitup';

function Works() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWork, setSelectedWork] = useState(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mixerRef.current) mixerRef.current.destroy();
    if (!projects.length) return;
    mixerRef.current = mixitup('.works-container', {
      selectors: { target: '.works-card' },
      animation: { duration: 300 },
    });
    return () => {
      if (mixerRef.current) mixerRef.current.destroy();
    };
  }, [projects]);

  const tagClass = (tag) => tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filters = ['all', ...new Set(projects.flatMap((p) => p.tags.map(tagClass)))];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    if (mixerRef.current) mixerRef.current.filter(filter === 'all' ? '.mix' : `.${filter}`);
  };

  const openPopup = (work) => setSelectedWork(work);
  const closePopup = () => setSelectedWork(null);

  return (
    <section className="works" id="works">
      <div className="max-width">
        <h2 className="title">Recent Work</h2>
        <div className="works-content">
          <div className="works-filter">
            {filters.map((filter) => (
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
            {projects.map((project) => (
              <div
                className={`works-card mix ${project.tags.map(tagClass).join(' ')}`}
                key={project.id}
              >
                {project.image && <img src={project.image} alt="" className="works-img" />}
                <h3 className="works-title">{project.title}</h3>
                <span className="works-button" onClick={() => openPopup(project)}>
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
              {selectedWork.image && (
                <div className="pp-thumbnail">
                  <img src={selectedWork.image} alt="" className="portfolio-popup-img" />
                </div>
              )}
              <div className="portfolio-popup-info">
                <h3 className="details-title">{selectedWork.title}</h3>
                <p className="details-description">{selectedWork.description}</p>
                <ul className="details-info">
                  <li>Tags - <span>{selectedWork.tags.join(', ')}</span></li>
                  {selectedWork.link && (
                    <li>View - <span><a href={selectedWork.link} target="_blank" rel="noreferrer">{selectedWork.link}</a></span></li>
                  )}
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
