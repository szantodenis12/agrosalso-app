import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const ReplyRequestSchema = z.object({
  inquiryId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  subject: z.string(),
  replyMessage: z.string(),
});

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Configurare server incompletă: Lipsește cheia API.' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const validation = ReplyRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Date invalide pentru trimitere email' }, { status: 400 });
    }

    const { customerName, customerEmail, subject, replyMessage } = validation.data;
    const firstName = customerName.split(' ')[0];

    const { data, error } = await resend.emails.send({
      from: 'AgroSalso <contact@agrosalso.ro>',
      to: [customerEmail],
      subject: `Re: ${subject} - AgroSalso`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; border: 1px solid #eee; padding: 30px; border-radius: 20px;">
          <h2 style="color: #000; margin-top: 0;">Bună ziua, ${firstName}!</h2>
          <p>Vă contactăm ca urmare a mesajului dumneavoastră transmis pe site-ul <strong>agrosalso.ro</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 15px; border-left: 4px solid #7ac24a; margin: 25px 0;">
            <p style="white-space: pre-wrap; margin: 0;">${replyMessage}</p>
          </div>

          <p>Dacă aveți nevoie de alte informații suplimentare, ne puteți contacta oricând la acest număr de telefon sau prin reply la acest email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="margin-bottom: 5px;"><strong>Echipa AgroSalso</strong></p>
          <p style="font-size: 14px; color: #666; margin-top: 0;">Dealer Utilaje Agricole | Bihor, DN79</p>
          <p style="font-size: 12px; color: #999;">Web: <a href="https://agrosalso.ro" style="color: #7ac24a;">www.agrosalso.ro</a></p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Eroare internă la trimiterea email-ului' }, { status: 500 });
  }
}
