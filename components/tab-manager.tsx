'use client';

import { useEffect } from 'react';

/**
 * A component that manages the document title and favicon based on tab visibility.
 * When the tab is inactive, it changes the title and favicon to encourage the user to return.
 * @returns {null} This component does not render anything.
 */
export function TabManager() {
  useEffect(() => {
    const mainTitle = 'Shaurya Chopra';

    // Function to dynamically set the favicon
    const setFavicon = (url: string) => {
      const href = `${url}?v=${Date.now()}`;
      const head = document.head;
      const existing = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon']",
      );
      existing.forEach((link) => head.removeChild(link));
      const link = document.createElement('link');
      link.rel = 'shortcut icon';
      link.type = 'image/png';
      link.href = href;
      head.appendChild(link);
    };

    // Function to apply the appropriate title and favicon based on tab visibility
    const applyState = (hidden: boolean) => {
      if (hidden) {
        document.title = 'Come Back';
        setFavicon('/icon-cry.png');
      } else {
        document.title = mainTitle;
        setFavicon('/icon.png');
      }
    };

    // Event handlers for tab visibility changes
    const handleVisibilityChange = () => {
      applyState(document.hidden);
    };

    const handlePageHide = () => {
      applyState(true);
    };

    const handlePageShow = () => {
      applyState(false);
    };

    const handleBlur = () => {
      applyState(true);
    };

    const handleFocus = () => {
      applyState(false);
    };

    // Add event listeners for tab visibility
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    applyState(document.hidden);

    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
}
