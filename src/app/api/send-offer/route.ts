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

    // Validare de bază a input-ului
    if (!inquiryId || !offerId || typeof price !== 'number') {
      return NextResponse.json({ error: 'Date invalide sau lipsă' }, { status: 400 });
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

    return NextResponse.json({ success: true, message: 'Status actualizat' });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Eroare internă de server' }, { status: 500 });
  }
}
