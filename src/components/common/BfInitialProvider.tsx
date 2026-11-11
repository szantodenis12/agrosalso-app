'use client';
import type { ReactNode } from 'react';
import { BfInitialContext } from '@/hooks/useBlackFriday';

/** Paseaza starea BF calculata pe server ca valoare initiala pentru hook-urile client. */
export function BfInitialProvider({ active, children }: { active: boolean; children: ReactNode }) {
  return <BfInitialContext.Provider value={active}>{children}</BfInitialContext.Provider>;
}
