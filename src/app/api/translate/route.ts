import { NextResponse } from 'next/server';
import { z } from 'zod';

const DEEPL_LANG_MAP: Record<string, string> = {
  en: 'EN-US',
  hu: 'HU',
  it: 'IT',
  de: 'DE',
  es: 'ES',
};

// Schema de validare
const TranslationRequestSchema = z.object({
  text: z.union([z.string(), z.array(z.string())]),
  target_lang: z.string().optional().default('en')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = TranslationRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Payload invalid' }, { status: 400 });
    }

    const { text, target_lang } = validation.data;
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
    }

    const deeplTarget = DEEPL_LANG_MAP[target_lang.toLowerCase()] || 'EN-US';
    const textsToTranslate = Array.isArray(text) ? text : [text];

    const response = await fetch(
      `https://api-free.deepl.com/v2/translate`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          text: textsToTranslate,
          target_lang: deeplTarget,
          tag_handling: 'html',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.translations) {
      return NextResponse.json({ error: 'Eroare la comunicarea cu serviciul de traducere' }, { status: 502 });
    }

    const translations = data.translations.map((t: any) => t.text);
    
    return NextResponse.json({ 
      translatedText: Array.isArray(text) ? translations : translations[0] 
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Eroare internă în motorul de traducere' }, { status: 500 });
  }
}
