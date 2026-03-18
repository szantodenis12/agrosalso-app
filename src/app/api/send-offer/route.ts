
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const OfferRequestSchema = z.object({
  inquiryId: z.string(),
  offerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  productName: z.string(),
  pdfBase64: z.string(), // Primim fișierul codificat base64 de pe client
});

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing from environment variables');
      return NextResponse.json({ error: 'Configurare server incompletă: Lipsește cheia API pentru email.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const validation = OfferRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Date invalide pentru trimitere email' }, { status: 400 });
    }

    const { customerName, customerEmail, productName, offerId, pdfBase64 } = validation.data;

    // Extragem prenumele (primul cuvânt)
    const firstName = customerName.split(' ')[0];

    const { data, error } = await resend.emails.send({
      from: 'AgroSalso <contact@agrosalso.ro>',
      to: [customerEmail],
      subject: `Ofertă personalizată: ${productName} - AgroSalso`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px;">
          <h2 style="color: #000;">Bună ziua, ${firstName}!</h2>
          <p>Vă mulțumim pentru interesul manifestat față de utilajele noastre.</p>
          <p>Atașat acestui e-mail veți găsi oferta oficială pentru utilajul <strong>${productName}</strong>, generată astăzi.</p>
          <p>Documentul conține specificațiile tehnice detaliate, prețul și condițiile de livrare discutate.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 14px; color: #666;">
            Pentru orice întrebări sau clarificări, ne puteți contacta direct la acest email sau la numărul de telefon din ofertă.
          </p>
          <p style="font-weight: bold;">Echipa AgroSalso</p>
        </div>
      `,
      attachments: [
        {
          filename: `Oferta-AgroSalso-${offerId}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Eroare internă la trimiterea email-ului' }, { status: 500 });
  }
}
