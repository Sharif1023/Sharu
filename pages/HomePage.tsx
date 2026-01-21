
import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Services from '../components/Services';
import Contact from '../components/Contact';
import ExclusiveGallery from '../components/ExclusiveGallery';
import { PortfolioData } from '../utils/storage';

interface HomePageProps {
  theme: 'dark' | 'light';
  data: PortfolioData;
}

const HomePage: React.FC<HomePageProps> = ({ theme, data }) => {
  return (
    <>
      <Hero theme={theme} data={data.hero} />
      <About theme={theme} data={data.about} />
      <Projects limit={2} title="Selected" theme={theme} data={data.projects} />
      <ExclusiveGallery theme={theme} data={data.gallery} />
      <Services theme={theme} data={data.services} />
      <Contact theme={theme} data={data.contact} />
    </>
  );
};

export default HomePage;
