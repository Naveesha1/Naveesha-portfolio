// src/components/Skills.js
import React from 'react';

function Skills() {
  const skills = [
    { name: 'Python', percentage: 80 },
    { name: 'C', percentage: 83 },
    { name: 'JavaScript', percentage: 85 },
    { name: 'PHP', percentage: 60 },
    { name: 'React', percentage: 90 },
    { name: 'MySQL', percentage: 75 },
  ];

  return (
    <section className="skills" id="skills">
      <div className="max-width">
        <h2 className="title">My skills</h2>
        <div className="skills-content">
          <div className="column left">
            <div className="text">My creative skills & experiences.</div>
            <p>As a student at the University of Moratuwa, I have acquired extensive knowledge in coding, design, 
               markup languages, and related fields. I am committed to continuous learning and skill development, 
               consistently striving to enhance my expertise and deliver high-quality results. My dedication to 
               personal and professional growth drives me to stay updated with industry trends and continuously improve.
            </p>
            <br />
            <a href="https://drive.google.com/file/d/1ahY0N0_kE8LumDl6uJWX8UW88d3k79BA/view?usp=sharing">See more</a>
          </div>
          <div className="column right">
            {skills.map((skill, index) => (
              <div className="bars" key={index}>
                <div className="info">
                  <span>{skill.name}</span>
                  <span>{skill.percentage}%</span>
                </div>
                <div className="line-container">
                  <div 
                    className={`line ${skill.name.toLowerCase()}`} 
                    style={{width: `${skill.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;