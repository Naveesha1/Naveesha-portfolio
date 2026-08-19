// src/components/About.js
import React, { useState } from 'react';
import my3 from '../Assets/my3.jpeg';

const BIO =
    "I am a passionate and driven software engineer eager to join a forward-thinking " +
    "organization where I can leverage my technical skills and enthusiasm for continuous " +
    "learning. My goal is to contribute to innovative software projects that drive technological " +
    "advancement and business success while achieving personal and professional growth.";

function About() {
    const [activeTab, setActiveTab] = useState('certification');

    const tabContent = {
        certification: (
            <div className="tabs-data grid">
                <p className="tabs-description">
                    <span>Full Stack React Bootcamp with .NET API [2024] [10 Projects</span> - Udemy
                    <span>2024</span>
                </p>
                <p className="tabs-description">
                    <span>Business Analysis Fundamentals</span> - Alison
                    <span>2024</span>
                </p>
                <p class="tabs-description">
                    <span>Web Design For Beginners</span> - UOM
                    <span>2022</span>
                </p>
                <p class="tabs-description">
                    <span>OOPs in Java</span> - Great Learning
                    <span>2024</span>
                </p>
                <p class="tabs-description">
                    <span>Java (Basic)</span> - HakerRank
                    <span>2024</span>
                </p>
            </div>
        ),
        experience: (
            <div className="tabs-data grid">
                <p className="tabs-description">
                    <span>Training Experience at Bank</span> - People's Bank
                    <span>6 months</span>
                </p>
                <p className="tabs-description">
                    <span>Industry Reconnaissance and Engagement</span> - LSEG
                    <span>5 months</span>
                </p>
            </div>
        ),
        education: (
            <div className="tabs-data grid">
                <p className="tabs-description">
                    <span>BSc in Information Technology & Management</span> - University of Moratuwa
                    <span>2021/22 - 2026</span>
                </p>
                <p class="tabs-description">
                    <span>Business Level 1</span> - The Institute of Chartered Accountants of
                    Sri Lanka
                    <span>2022</span>
                </p>
                <p class="tabs-description">
                    <span>G.C.E Advanced Level Examination</span> - Central Collage Anuradhapura
                    <span>2020</span>
                </p>
                <p class="tabs-description">
                    <span>G.C.E</span> - Sri Dutugemunu Maha Vidyalaya
                    <span>2017</span>
                </p>
            </div>
        )
    };

    return (
        <section className="about" id="about">
            <div className="max-width">
                <h2 className="title">About me</h2>
                <div className="about-content">
                    <div className="column left">
                        <img src={my3} alt="" />
                    </div>
                    <div className="column right">
                        <p>{BIO}</p>

                        <div className="tabs-btn">
                            <span className={`tabs-btn ${activeTab === 'certification' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('certification')}>Certification</span>
                            <span className={`tabs-btn ${activeTab === 'experience' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('experience')}>Experience</span>
                            <span className={`tabs-btn ${activeTab === 'education' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('education')}>Education</span>
                        </div>

                        <div className="tabs-content">
                            {tabContent[activeTab]}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;









// import React, { useState, useRef } from 'react';
// import { FaUser, FaLinkedin, FaGithub, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
// import emailjs from '@emailjs/browser';

// function Contact() {
//   const [formData, setFormData] = useState({
//     from_name: '',
//     from_email: '',
//     from_subject: '',
//     message: ''
//   });

//   const form = useRef();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     emailjs.sendForm('service_trr286m', 'template_ls74clo', form.current, '4Ijh1DogAyGOJjA5G')
//       .then((result) => {
//           console.log(result.text);
//           alert('Message sent successfully!');
//           setFormData({ username: '', email: '', subject: '', message: '' });
//       }, (error) => {
//           console.log(error.text);
//           alert('Failed to send message. Please try again.');
//       });
//   };

//   return (
//     <section className="contact" id="contact">
//       {/* ... (previous code remains the same) */}

//       {/* ... */}
//     </section>
//   );
// }

// export default Contact;