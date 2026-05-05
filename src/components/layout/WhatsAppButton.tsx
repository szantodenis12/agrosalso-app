'use client';

import { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = '+40761927076'; // TODO: Replace with actual number
const WHATSAPP_MESSAGE = 'Bună ziua! Sunt interesat de un utilaj agricol.';

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Delay entrance for a polished feel
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactați-ne pe WhatsApp"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="whatsapp-fab"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0px',
        textDecoration: 'none',
        outline: 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.5) translateY(20px)',
        transition: 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Tooltip label */}
      <span
        style={{
          background: '#ffffff',
          color: '#1a1a1a',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          padding: '8px 14px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
          whiteSpace: 'nowrap',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
          marginRight: '12px',
        }}
      >
        Scrie-ne pe WhatsApp
      </span>

      {/* Main button */}
      <span
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: isHovered
            ? '0 8px 30px rgba(37, 211, 102, 0.5), 0 2px 8px rgba(0,0,0,0.1)'
            : '0 4px 20px rgba(37, 211, 102, 0.35), 0 2px 6px rgba(0,0,0,0.08)',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {/* Pulse ring */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            border: '2px solid rgba(37, 211, 102, 0.4)',
            animation: 'whatsappPulse 2s ease-in-out infinite',
          }}
        />

        {/* WhatsApp icon */}
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="white"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </span>
    </a>
  );
}
