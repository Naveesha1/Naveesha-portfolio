// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { ReactTyped as Typed } from 'react-typed';

function Home() {
  const [profile, setProfile] = useState({ name: '', homePhoto: null });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => {});
  }, []);

  return (
    <section className="home" id="home">
      <div className="max-width">
        <div className="home-content">
          <div className="text-1">Hello, my name is</div>
          <div className="text-2">{profile.name}</div>
          <div className="text-3">
            And I'm a <Typed
              strings={["Developer", "Undergraduate ", "Designer"]}
              typeSpeed={100}
              backSpeed={60}
              loop
            />
          </div>
          <a href="#contact">Contact Me</a>
        </div>
        <div className="main-img">
          {profile.homePhoto && <img src={profile.homePhoto} alt={profile.name} />}
        </div>
      </div>
    </section>
  );
}

export default Home;
