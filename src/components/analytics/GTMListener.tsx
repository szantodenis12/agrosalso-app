'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GTMListener() {
  useEffect(() => {
    // Phone click tracking
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const telLink = target.closest('a[href^="tel:"]') as HTMLAnchorElement;
      
      if (telLink) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'phone_click',
          event_category: 'contact',
          event_label: 'Phone - ' + telLink.href.replace('tel:', '')
        });
      }
    };

    // Form submit tracking
    const handleGlobalSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (form.matches('.product-form, form[data-product], form.oferta-form')) {
        const productContainer = form.closest('[data-product]') as HTMLElement;
        const productName = 
          productContainer?.dataset.product || 
          (form.querySelector('[name="product"]') as HTMLInputElement)?.value || 
          'Produs necunoscut';
          
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'form_submit',
          event_category: 'product_inquiry',
          event_label: productName,
          content_name: productName
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('submit', handleGlobalSubmit, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('submit', handleGlobalSubmit, true);
    };
  }, []);

  return null;
}
