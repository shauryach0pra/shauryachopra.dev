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
      let link = document.querySelector(
        "link[rel='icon'][data-emoji-favicon='true']",
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.setAttribute('data-emoji-favicon', 'true');
        document.head.appendChild(link);
      }
      link.href = canvas.toDataURL();
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
