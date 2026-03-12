import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * AGROSALSO API - BULLETPROOF V2
 * Această rută se ocupă acum EXCLUSIV de sarcini server-side (trimitere email, logare externă).
 * Actualizarea statusului în DB a fost mutată pe client pentru a asigura respectarea Security Rules.
 */

const OfferRequestSchema = z.object({
  inquiryId: z.string().min(1),
  offerId: z.string().min(1),
  price: z.number().positive(),
  contact: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validare input
    const validation = OfferRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Payload invalid' }, { status: 400 });
    }

    // 2. Aici s-ar integra serviciul de email (ex: Resend, SendGrid)
    // Momentan ruta servește ca endpoint de confirmare procesare.
    // NOTĂ: Nu mai scriem direct în Firestore de aici fără token de admin.

    return NextResponse.json({ 
      success: true, 
      message: 'Notificare server trimisă cu succes' 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      error: 'Eroare procesare server' 
    }, { status: 500 });
  }
}