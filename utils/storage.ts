
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
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const localApache = isLocalhost ? 'http://localhost' : '';
  const endpoints = [
    '/api/portfolio.php',
    ...(isLocalhost ? [`${localApache}/sharunduu/api/portfolio.php`, `${localApache}/api/portfolio.php`] : []),
    '/sharunduu/api/portfolio.php',
    '/api/portfolio',
    '/sharunduu/api/portfolio'
  ];
  const errors: any[] = [];
  try {
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { method: 'GET' });
        if (res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            if (json.success && json.data) {
              console.info('fetchPortfolioData: success via', ep);
              return json.data as PortfolioData;
            }
            // If 200 but no data, continue to next
          } catch (parseErr) {
            console.warn(`Invalid JSON from ${ep}:`, parseErr, 'raw:', text.slice(0, 300));
            errors.push({ endpoint: ep, parseErr, raw: text });
            continue;
          }
        } else if (res.status === 404) {
          // Not found at this endpoint, try next
          errors.push({ endpoint: ep, status: res.status });
          continue;
        } else {
          errors.push({ endpoint: ep, status: res.status });
          continue;
        }
      } catch (err) {
        errors.push({ endpoint: ep, err });
        continue;
      }
    }

    // Fallback to localStorage backup so the site remains usable offline
    const backup = typeof window !== 'undefined' ? window.localStorage.getItem('portfolio_backup') : null;
    if (backup) {
      console.warn('Using local portfolio backup due to remote fetch failure. Errors:', errors);
      return JSON.parse(backup) as PortfolioData;
    }

    console.warn('No remote or local portfolio found; returning default portfolio. Errors:', errors);
    return DEFAULT_PORTFOLIO;
  } catch (err) {
    console.error('Critical Fetch operation failed:', err, 'Errors:', errors);
    const backup = typeof window !== 'undefined' ? window.localStorage.getItem('portfolio_backup') : null;
    if (backup) return JSON.parse(backup) as PortfolioData;
    return DEFAULT_PORTFOLIO;
  }
};

export const updatePortfolioData = async (data: PortfolioData): Promise<boolean> => {
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const localApache = isLocalhost ? 'http://localhost' : '';
  const endpoints = [
    '/api/portfolio.php',
    ...(isLocalhost ? [`${localApache}/sharunduu/api/portfolio.php`, `${localApache}/api/portfolio.php`] : []),
    '/sharunduu/api/portfolio.php',
    '/api/portfolio',
    '/sharunduu/api/portfolio'
  ];
  const errors: any[] = [];

  try {
    // Save locally first (optimistic UX)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio_backup', JSON.stringify(data));
    }

    // Notify UI immediately
    window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: data }));

    // Try endpoints sequentially
    for (const ep of endpoints) {
      try {
        console.info('Trying endpoint', ep.slice(0, 200));
        const res = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const text = await res.text();
        if (!res.ok) {
          errors.push({ endpoint: ep, status: res.status, body: text.slice(0, 500) });
          continue;
        }

        let json: any;
        try {
          json = JSON.parse(text);
        } catch (parseErr) {
          errors.push({ endpoint: ep, parseErr, raw: text.slice(0, 500) });
          continue;
        }

        if (json.success) {
          console.info('Server portfolio upsert successful via', ep);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('portfolio-data-synced', { detail: { time: new Date().toISOString(), endpoint: ep } }));
          }
          return true;
        } else {
          errors.push({ endpoint: ep, message: json.message || 'unknown' });
          continue;
        }
      } catch (err) {
        errors.push({ endpoint: ep, err });
        continue;
      }
    }

    console.error('All API endpoints failed:', errors);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio-sync-error', { detail: errors }));
    }
    return false;
  } catch (err) {
    console.error('Update operation failed:', err);
    return false;
  }
};

export const getPortfolioData = () => null;
export const savePortfolioData = () => { };
