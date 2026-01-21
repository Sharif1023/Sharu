
import { Project, Service } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: '🛒 E-STORE WEBSITE',
    description: "Sharif's e-Store is a responsive online shop featuring product cards, pop-up details, and a basic cart. Supports bKash, Nagad, and card payments.",
    category: 'E-COMMERCE',
    badge: 'E-COMMERCE',
    tech: ['HTML', 'TAILWIND', 'JAVASCRIPT'],
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop',
    hoverImageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop',
    liveUrl: 'https://sharif1023.github.io/Sharif-s-e-Store/'
  },
  {
    id: '2',
    title: '🍽️ RESTAURANT WEBSITE',
    description: 'A mobile-friendly restaurant portal showing food items, dynamic pricing, and interactive menus with a polished About and Contact flow.',
    category: 'RESTAURANT',
    badge: 'RESTAURANT',
    tech: ['HTML', 'CSS', 'JAVASCRIPT'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop',
    liveUrl: 'https://sharif1023.github.io/Sharif-s-Food/'
  },
  {
    id: '3',
    title: 'REUNION MANAGEMENT',
    description: 'A full-scale system for school/college reunions. Features public registrations and a robust admin dashboard for moderation and approval.',
    category: 'REUNION',
    badge: 'REUNION',
    tech: ['HTML', 'TAILWIND CSS', 'JAVASCRIPT'],
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop',
    hoverImageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000&auto=format&fit=crop',
    liveUrl: 'https://reunion18.netlify.app/'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Bespoke UI Design',
    description: 'Crafting interfaces that breathe luxury and precision, focused on conversion and emotional resonance.',
    iconType: 'layout'
  },
  {
    id: 's2',
    title: 'Scalable Engineering',
    description: 'Robust, clean, and maintainable codebases built with modern stacks to grow with your business.',
    iconType: 'code'
  },
  {
    id: 's3',
    title: 'Performance Mastery',
    description: 'Optimization that ensures lightning-fast load times and a seamless user experience across all devices.',
    iconType: 'zap'
  },
  {
    id: 's4',
    title: 'Mobile Excellence',
    description: 'Responsive architectures that feel like native applications on every screen size.',
    iconType: 'smartphone'
  }
];
