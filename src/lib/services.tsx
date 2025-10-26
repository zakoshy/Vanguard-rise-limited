
import { Briefcase, Building, Heart, Home as HomeIcon } from 'lucide-react';
import { ReactElement } from 'react';

export type Service = {
  icon: ReactElement;
  title: string;
  description: string;
  link: string;
};

export const services: Service[] = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Project Management',
    description: 'Expert oversight from inception to completion, ensuring your projects are delivered on time and within budget.',
    link: '/project-management',
  },
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: 'Investment & Development',
    description: 'Strategic investment opportunities and comprehensive project development services for maximum returns.',
    link: '/investments',
  },
  {
    icon: <HomeIcon className="h-10 w-10 text-primary" />,
    title: 'Real Estate Consultancy',
    description: 'In-depth market analysis and advisory to help you navigate the complexities of real estate.',
    link: '/real-estate',
  },
  {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: 'Philanthropic Initiatives',
    description: 'Driving positive change through community development and corporate social responsibility.',
    link: '/philanthropy',
  },
];
