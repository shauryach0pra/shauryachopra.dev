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
      const existing =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement('link');
      existing.rel = 'icon';
      existing.href = canvas.toDataURL();
      if (!existing.parentNode) {
        document.head.appendChild(existing);
      }
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
