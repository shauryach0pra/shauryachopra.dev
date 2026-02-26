'use client';

import { useEffect } from 'react';

export function TabManager() {
  useEffect(() => {
    const mainTitle = 'Shaurya Chopra';
    const setFavicon = (emoji: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = '48px system-ui';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(emoji, canvas.width / 2, canvas.height / 2);
      const url = canvas.toDataURL();
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
        link.type = 'image/png';
        link.href = url;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = 'Come Back';
        setFavicon('😢');
      } else {
        document.title = mainTitle;
        setFavicon('😎');
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
