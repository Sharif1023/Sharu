
import { Project, Service, GalleryItem, MenuNames, ContactInfo } from '../types';
import { supabase } from './supabase';

export interface PortfolioData {
  version: number;
  auth?: {
    username: string;
    password: string;
  };
  hero: {
    title1: string;
    title2: string;
    subtitle: string;
    backgroundImage: string;
  };
  about: {
    homepageTitle1: string;
    homepageTitleAccent: string;
    homepageDescription: string;
    homepageImage: string;
    detailedBio: string;
    detailedImage: string;
    cvUrl?: string;
    skills: { name: string; level: number }[];
    education: { degree: string; school: string }[];
    timeline: { year: string; description: string }[];
  };
  contact: ContactInfo;
  gallery: GalleryItem[];
  projects: Project[];
  services: Service[];
  menuNames: MenuNames;
  mediaLibrary: string[];
}

export const fetchPortfolioData = async (): Promise<PortfolioData | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_config')
      .select('data')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return data.data as PortfolioData;
  } catch (err) {
    console.error('Critical Fetch operation failed:', err);
    return null;
  }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('portfolio_config')
      .upsert({ id: 1, data, updated_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase update error:', error.message);
      return false;
    }
    
    window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: data }));
    return true;
  } catch (err) {
    console.error('Update operation failed:', err);
    return false;
  }
};

export const getPortfolioData = () => null;
export const savePortfolioData = () => {};
