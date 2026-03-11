
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

export const dynamic = 'force-dynamic';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export async function POST(request: Request) {
  try {
    const { inquiryId, offerId, price, contact } = await request.json();

    if (!inquiryId || !offerId) {
      return NextResponse.json({ error: 'Date lipsă' }, { status: 400 });
    }

    const inquiryRef = doc(db, 'inquiries', inquiryId);
    const inquirySnap = await getDoc(inquiryRef);

    if (!inquirySnap.exists()) {
      return NextResponse.json({ error: 'Cererea nu există' }, { status: 404 });
    }

    // Actualizăm statusul în baza de date
    await updateDoc(inquiryRef, {
      status: 'replied',
      repliedAt: serverTimestamp(),
      offerId: offerId
    });

    // NOTĂ: Trimiterea de email-uri prin Resend este dezactivată temporar 
    // pentru a preveni erorile de build/publish cauzate de lipsa cheilor API.
    // Logica va fi reactivată la cerere după configurarea Resend.

    return NextResponse.json({ success: true, message: 'Status actualizat (Email dezactivat)' });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
