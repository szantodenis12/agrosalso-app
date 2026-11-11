'use client';
import { useEffect } from 'react';

const GTM_ID = 'GTM-TFS9F4D8';
const FB_SRC = 'https://connect.facebook.net/en_US/fbevents.js';
const MAX_DELAY_AFTER_LOAD = 3500;

/**
 * Injects GTM (which loads gtag G-N8T9WJYMJS / AW-18019443168) and the Meta Pixel script
 * only after window 'load' + idle time, or on first user interaction, whichever is first
 * (hard cap ~3.5 s after load). The dataLayer / gtag / fbq stubs are defined inline in the
 * <head> (see layout.tsx), so any call made before injection is queued and replayed.
 */
export function DeferredAnalytics() {
  useEffect(() => {
    let done = false;
    const w = window as any;
    const timers: number[] = [];
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'];

    const inject = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, inject));
      timers.forEach((t) => window.clearTimeout(t));

      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
      document.head.appendChild(g);

      const f = document.createElement('script');
      f.async = true;
      f.src = FB_SRC;
      document.head.appendChild(f);
    };

    events.forEach((e) => window.addEventListener(e, inject, { once: true, passive: true }));

    const onLoad = () => {
      timers.push(window.setTimeout(inject, MAX_DELAY_AFTER_LOAD));
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(inject, { timeout: MAX_DELAY_AFTER_LOAD });
      } else {
        timers.push(window.setTimeout(inject, 1500));
      }
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => {
      events.forEach((e) => window.removeEventListener(e, inject));
      window.removeEventListener('load', onLoad);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
