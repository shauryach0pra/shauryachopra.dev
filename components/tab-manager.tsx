'use client';

import { useEffect } from 'react';

export function TabManager() {
  useEffect(() => {
    const mainTitle = 'Shaurya Chopra';
    const setFavicon = (isCrying: boolean) => {
      const path = isCrying ? '/icon-cry.png' : '/icon.png';
      const links = Array.from(
        document.querySelectorAll<HTMLLinkElement>(
          "link[rel*='icon'], link[rel='apple-touch-icon'], link[rel='mask-icon']",
        ),
      );
      if (links.length === 0) {
        const link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
        links.push(link);
      }
      links.forEach((link) => {
        link.href = path;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = 'Come Back';
        setFavicon(true);
      } else {
        document.title = mainTitle;
        setFavicon(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
