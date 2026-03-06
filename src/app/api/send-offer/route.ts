
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

export const dynamic = 'force-dynamic';

// Initialize Firebase for the API route
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

    // Initialize Resend inside the request handler to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Fetch inquiry to get client email and product info
    const inquiryRef = doc(db, 'inquiries', inquiryId);
    const inquirySnap = await getDoc(inquiryRef);

    if (!inquirySnap.exists()) {
      return NextResponse.json({ error: 'Cererea nu există' }, { status: 404 });
    }

    const inquiry = inquirySnap.data();

    // 2. Mark as replied in Firestore
    await updateDoc(inquiryRef, {
      status: 'replied',
      repliedAt: serverTimestamp(),
      offerId: offerId
    });

    // 3. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'AgroSalso <oferte@agrosalso.ro>',
      to: [inquiry.email],
      subject: `Ofertă AgroSalso — ${inquiry.productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; border-left: 5px solid #A3E635; padding-left: 15px;">Bună ziua, ${inquiry.name}</h1>
          <p>Vă mulțumim pentru interesul acordat utilajelor noastre. V-am pregătit o ofertă personalizată pentru <strong>${inquiry.productName}</strong>.</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Număr Ofertă</p>
            <p style="margin: 5px 0 20px; font-weight: bold; font-size: 18px;">${offerId}</p>
            
            <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Preț Unitar (Net)</p>
            <p style="margin: 5px 0 0; font-weight: bold; font-size: 24px; color: #222;">${price.toLocaleString()} RON</p>
          </div>

          <p>Vă vom contacta telefonic în cel mai scurt timp pentru a discuta detaliile tehnice și modalitățile de finanțare.</p>
          
          <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            Cu stimă,<br>
            <strong>${contact}</strong><br>
            Echipa AgroSalso
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
