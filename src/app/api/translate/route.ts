import { NextResponse } from 'next/server';

const DEEPL_LANG_MAP: Record<string, string> = {
  en: 'EN-US',
  hu: 'HU',
  it: 'IT',
  de: 'DE',
  es: 'ES',
};

export async function POST(req: Request) {
  try {
    const { text, target_lang = 'en' } = await req.json();
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
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
      console.error('DeepL Translate Error:', data);
      return NextResponse.json({ error: data.message || 'DeepL API error' }, { status: 500 });
    }

    const translations = data.translations.map((t: any) => t.text);
    
    return NextResponse.json({ 
      translatedText: Array.isArray(text) ? translations : translations[0] 
    });
  } catch (err: any) {
    console.error('Translation API route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
