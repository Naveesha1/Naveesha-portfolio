import workCrm from '../Assets/workCrm.png';
import dress from '../Assets/dress.png';
import worksCoffee from '../Assets/works-coffe.jpg';
import worksLogo from '../Assets/works-logo.png';
import worksHardware from '../Assets/works-hardware.jpg';
import worksIceCubeVedio from '../Assets/works-iceCubeVedio.PNG';
import worksVedio from '../Assets/works-vedio.PNG';

const projects = [
  {
    id: 1,
    title: 'Customer Relationship Management System',
    description:
      'A state-of-the-art CRM platform designed to enhance customer interactions and streamline business processes. Implemented modules for customer contact management, sales and lead tracking, communication automation, and customer support. Empowered businesses with robust reporting and analytics tools, improving customer satisfaction and operational efficiency.',
    image: workCrm,
    link: 'https://github.com/heelibathdeniyahanb/SolexCodeCRMNew',
    tags: ['web'],
  },
  {
    id: 2,
    title: 'Website for Clothing Atelier',
    description:
      'A modern and user-friendly online dress shop designed to offer a seamless shopping experience. Features include an intuitive dress selection interface, easy add-to-cart functionality, and secure payment processing. Customers can track their order status in real-time, from processing to delivery, ensuring transparency and convenience. The platform streamlines the shopping journey, empowering users with effortless navigation, personalized recommendations, and efficient customer service.',
    image: dress,
    link: 'https://github.com/Naveesha1/Dress-store',
    tags: ['web'],
  },
  {
    id: 3,
    title: 'Website for coffee shop',
    description:
      'Created a modern, user-friendly website for a local coffee shop, featuring an intuitive layout, responsive design, and integrated online menu. Utilized HTML, CSS, and JavaScript to enhance user experience and drive customer engagement.',
    image: worksCoffee,
    link: 'https://github.com/Naveesha1/coffeeshop.github.io',
    tags: ['web'],
  },
  {
    id: 4,
    title: 'Logo design creativity & application',
    description:
      'Crafted a unique and elegant logo for a jewelry shop, reflecting its brand identity and appeal. Employed graphic design principles and software to create a visually striking and memorable brand symbol.',
    image: worksLogo,
    link: 'https://drive.google.com/file/d/1IvJahZQ33ZOT_wj2MzZ4qr8hQpkb87nu/view?usp=sharing',
    tags: ['graphic'],
  },
  {
    id: 5,
    title: 'IoT - Real Time Gas Station Fuel Tank',
    description:
      'Developed an innovative real-time monitoring solution for gas station fuel tanks using an ESP32 Devkit V1 board and various sensors. The system tracks fuel volume, temperature, and pressure, logging data offline and syncing to Firebase. An intuitive web application provides graphical data visualization, ensuring efficient fuel management and timely replenishment.',
    image: worksHardware,
    link: '#',
    tags: ['hardware'],
  },
  {
    id: 6,
    title: 'Ice Cube dropping Video',
    description:
      'Created a dynamic short video in Blender, showcasing ice cubes dropping into a glass of water with realistic water splash effects.',
    image: worksIceCubeVedio,
    link: 'https://drive.google.com/file/d/17iY23y2krM0UV9dbvqJmoXf7VHA32X_T/view?usp=sharing',
    tags: ['graphic'],
  },
  {
    id: 7,
    title: 'Rendered Video',
    description:
      'Produced a detailed 3D render of a burial ground using Blender, showcasing intricate textures and atmospheric effects, created during my free time.',
    image: worksVedio,
    link: 'https://drive.google.com/file/d/188llgm3HgE_A0fvChCoiHVbkY8WExePL/view?usp=sharing',
    tags: ['graphic'],
  },
];

export default projects;
