import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Schema de validare pentru request
const OfferRequestSchema = z.object({
  inquiryId: z.string().min(1, "Inquiry ID is required"),
  offerId: z.string().min(1, "Offer ID is required"),
  price: z.number().positive("Price must be a positive number"),
  contact: z.string().optional()
});

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validare Server-Side cu Zod
    const validation = OfferRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Date invalide', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { inquiryId, offerId } = validation.data;

    const inquiryRef = doc(db, 'inquiries', inquiryId);
    const inquirySnap = await getDoc(inquiryRef);

    if (!inquirySnap.exists()) {
      return NextResponse.json({ error: 'Cererea nu există în baza de date' }, { status: 404 });
    }

    // 2. Actualizare atomică în Firestore
    await updateDoc(inquiryRef, {
      status: 'replied',
      repliedAt: serverTimestamp(),
      offerId: offerId,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true, message: 'Status ofertă actualizat cu succes' });
  } catch (err: any) {
    // Nu logăm erori sensibile în producție către client
    return NextResponse.json({ 
      error: 'Eroare internă de server la procesarea ofertei' 
    }, { status: 500 });
  }
}
