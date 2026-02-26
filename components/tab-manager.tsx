'use client';

import { useEffect } from 'react';

export function TabManager() {
  useEffect(() => {
    const mainTitle = 'Shaurya Chopra';
    const setFavicon = (isCrying: boolean) => {
      const path = isCrying ? '/icon-cry.png' : '/icon.png';
      const url = `${path}?v=${isCrying ? 'cry' : 'cool'}-${Date.now()}`;
      const head = document.head;
      const existing = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon'], link[rel='apple-touch-icon'], link[rel='mask-icon']",
      );
      existing.forEach((link) => head.removeChild(link));
      const rels = ['icon', 'shortcut icon', 'apple-touch-icon'];
      rels.forEach((rel) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.type = 'image/png';
        link.href = url;
        head.appendChild(link);
      });
    };

    const applyState = (hidden: boolean) => {
      if (hidden) {
        document.title = 'Come Back';
        setFavicon(true);
      } else {
        document.title = mainTitle;
        setFavicon(false);
      }
    };

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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    applyState(document.hidden);

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
