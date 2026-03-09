import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, target = 'en' } = await req.json();
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // DeepL handles both single string and array, but we standardize to array
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
          target_lang: 'EN',
          tag_handling: 'html', // Important to preserve HTML tags in product descriptions
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
