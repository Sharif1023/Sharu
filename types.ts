
import React from 'react';

export interface CustomLink {
  name: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  imageUrl: string;
  hoverImageUrl?: string;
  liveUrl: string;
  badge?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconType: 'layout' | 'code' | 'zap' | 'smartphone';
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  metadata: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  facebook: string;
  instagram: string;
  customLinks?: CustomLink[];
}

export interface MenuNames {
  public: {
    home: string;
    projects: string;
    about: string;
    services: string;
    contact: string;
  };
  admin: {
    hero: string;
    about: string;
    gallery: string;
    projects: string;
    services: string;
    media: string;
  };
}
