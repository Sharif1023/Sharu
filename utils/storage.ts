
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

const DEFAULT_PORTFOLIO: PortfolioData = {
  version: 1,
  auth: { username: 'admin', password: 'admin' },
  hero: { title1: 'Hello', title2: 'World', subtitle: 'Welcome', backgroundImage: '' },
  about: { homepageTitle1: 'Hi', homepageTitleAccent: 'There', homepageDescription: '', homepageImage: '', detailedBio: '', detailedImage: '', skills: [], education: [], timeline: [] },
  contact: { email: '', phone: '', whatsapp: '', github: '', linkedin: '', facebook: '', instagram: '', customLinks: [] },
  gallery: [],
  projects: [],
  services: [],
  menuNames: { public: { home: 'Home', projects: 'Projects', about: 'About', services: 'Services', contact: 'Contact' }, admin: { hero: 'Hero', about: 'Persona', gallery: 'Archive', projects: 'Work', services: 'Tech', media: 'Vault' } },
  mediaLibrary: []
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const fetchPortfolioData = async (): Promise<PortfolioData | null> => {
  try {
    // Try a couple of times to reach Supabase (helps transient network blips)
    for (let attempt = 1; attempt <= 2; attempt++) {
      const { data, error } = await supabase
        .from('portfolio_config')
        .select('data')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.warn(`Supabase fetch attempt ${attempt} failed:`, error.message);
        if (attempt < 2) await sleep(1000 * attempt);
        continue;
      }

      if (data) return data.data as PortfolioData;
      break;
    }

    // Fallback to localStorage backup so the site remains usable offline
    const backup = typeof window !== 'undefined' ? window.localStorage.getItem('portfolio_backup') : null;
    if (backup) {
      console.warn('Using local portfolio backup due to remote fetch failure.');
      return JSON.parse(backup) as PortfolioData;
    }

    // If everything fails, return a default empty portfolio so UI can render
    console.warn('No remote or local portfolio found; returning default portfolio.');
    return DEFAULT_PORTFOLIO;
  } catch (err) {
    console.error('Critical Fetch operation failed:', err);
    // Try local backup as last resort
    const backup = typeof window !== 'undefined' ? window.localStorage.getItem('portfolio_backup') : null;
    if (backup) return JSON.parse(backup) as PortfolioData;
    return DEFAULT_PORTFOLIO;
  }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<boolean> => {
  try {
    // Save locally first (optimistic UX)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio_backup', JSON.stringify(data));
    }

    // Notify UI immediately
    window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: data }));

    // Background upsert with retry strategy (fire-and-forget)
    (async function tryUpsert(attempt = 1) {
      try {
        const { error } = await supabase
          .from('portfolio_config')
          .upsert({ id: 1, data, updated_at: new Date().toISOString() });

        if (error) throw error;
        console.info('Supabase upsert successful');
      } catch (err) {
        console.error('Supabase update failed on attempt', attempt, err);
        if (attempt < 3) {
          const wait = 2000 * attempt;
          setTimeout(() => tryUpsert(attempt + 1), wait);
        }
      }
    })();

    return true;
  } catch (err) {
    console.error('Update operation failed:', err);
    return false;
  }
};

export const getPortfolioData = () => null;
export const savePortfolioData = () => { };
