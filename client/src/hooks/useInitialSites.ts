import { useEffect } from 'react';

interface SavedSite {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  addedAt: number;
}

export function useInitialSites() {
  useEffect(() => {
    const stored = localStorage.getItem("pwa-browser-sites");
    const initialized = localStorage.getItem("pwa-browser-initialized");
    
    // Eğer daha önce initialize edilmemişse ve site yoksa
    if (!initialized && !stored) {
      const defaultSites: SavedSite[] = [
        {
          id: Date.now().toString(),
          url: "https://www.casicostaortaklik.com/r/Sosyal",
          title: "casicosta",
          favicon: "https://www.google.com/s2/favicons?domain=casicostaortaklik.com&sz=64",
          addedAt: Date.now(),
        }
      ];
      
      localStorage.setItem("pwa-browser-sites", JSON.stringify(defaultSites));
      localStorage.setItem("pwa-browser-initialized", "true");
    }
  }, []);
}

