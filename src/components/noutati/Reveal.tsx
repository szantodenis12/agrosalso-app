'use client';

// Wrapper client minimal pentru animația de "reveal" la scroll (framer-motion),
// folosit în paginile server /noutati. Conținutul (children) e randat de
// componenta server părinte și trece prin acest wrapper doar pentru animație —
// textul rămâne în HTML-ul generat de server.

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
