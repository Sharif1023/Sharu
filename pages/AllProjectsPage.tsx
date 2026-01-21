
import React from 'react';
import Projects from '../components/Projects';
import { PortfolioData } from '../utils/storage';

interface AllProjectsPageProps {
  theme: 'dark' | 'light';
  data: PortfolioData;
}

const AllProjectsPage: React.FC<AllProjectsPageProps> = ({ theme, data }) => {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-black' : 'bg-[#E0FFFF]';

  return (
    <div className={`transition-colors duration-500 ${bgClass}`}>
      <Projects title="Archive" theme={theme} data={data.projects} />
    </div>
  );
};

export default AllProjectsPage;
