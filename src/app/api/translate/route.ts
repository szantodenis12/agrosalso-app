import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, target = 'en' } = await req.json();
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Translation API key not configured' }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Google Translate API supports batching
    const textsToTranslate = Array.isArray(text) ? text : [text];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: textsToTranslate,
          target: target,
          format: 'html', // Use html to preserve potential formatting/paragraphs
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('Google Translate Error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const translations = data.data.translations.map((t: any) => t.translatedText);
    
    return NextResponse.json({ 
      translatedText: Array.isArray(text) ? translations : translations[0] 
    });
  } catch (err: any) {
    console.error('Translation API route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
