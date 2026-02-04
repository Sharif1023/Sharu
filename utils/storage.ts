
import { Project, Service, GalleryItem, MenuNames, ContactInfo } from '../types';

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
    // Try server endpoint first
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch('/api/portfolio.php');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) return json.data as PortfolioData;
          if (res.status === 404) return DEFAULT_PORTFOLIO;
        } else {
          console.warn(`API fetch attempt ${attempt} returned status ${res.status}`);
        }
      } catch (err) {
        console.warn(`API fetch attempt ${attempt} failed:`, err);
        if (attempt < 2) await sleep(1000 * attempt);
        continue;
      }
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
        const res = await fetch('/api/portfolio.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Unknown server error');

        console.info('Server portfolio upsert successful');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('portfolio-data-synced', { detail: { time: new Date().toISOString() } }));
        }
      } catch (err) {
        console.error('API update failed on attempt', attempt, err);
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
