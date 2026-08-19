// src/components/Home.js
import React from 'react';
import { ReactTyped as Typed } from 'react-typed';
import my2 from '../Assets/my2.jpeg';

const NAME = 'Naveesha Kavindi';

function Home() {
  return (
    <section className="home" id="home">
      <div className="max-width">
        <div className="home-content">
          <div className="text-1">Hello, my name is</div>
          <div className="text-2">{NAME}</div>
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
          <img src={my2} alt={NAME} />
        </div>
      </div>
    </section>
  );
}

export default Home;
