// Local content/dictionary for the two new homepage sections:
// IntrebariFrecvente (FAQ) and OferteCurente (current AFIR funding offer).
//
// RO copy comes verbatim from the client's SEO package
// (PACHET_SEO_SITE_2026-10/content/faq.ts and components/sections/OferteCurente.tsx).
// The other 5 languages are faithful translations, matching the tone already
// used for similar strings in src/lib/translations.ts.
//
// IMPORTANT: FAQ_RO is also the single source of truth for the FAQPage JSON-LD
// (see src/components/seo/FaqJsonLd.tsx), so it must always mirror the visible
// Romanian Q&A exactly.

import type { Language } from '@/context/LanguageContext';

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_RO: FaqItem[] = [
  {
    question: 'Ce fel de utilaje vindeți?',
    answer:
      'Utilaje tractate și purtate pentru pregătirea solului, semănat și întreținerea culturilor, plus piese de schimb. Tractoare, combine sau sisteme de irigații nu vindem.',
  },
  {
    question: 'Livrați în toată țara?',
    answer: 'Da. Organizăm transportul până la fermă, oriunde în România.',
  },
  {
    question: 'Faceți oferte pentru proiecte AFIR?',
    answer:
      'Da. Pregătim oferta conformă cerințelor AFIR în maximum 24 de ore și te ajutăm să alegi echipamentele potrivite pentru proiect.',
  },
  {
    question: 'Ce variante de finanțare există?',
    answer:
      'Rate lunare, leasing sau rate sezoniere, adaptate activității fermei. Analizăm împreună opțiunile și alegem varianta potrivită.',
  },
  {
    question: 'Aveți piese de schimb pe stoc?',
    answer:
      'Da, pentru utilajele din portofoliu. Te ajutăm și să identifici componenta potrivită.',
  },
  {
    question: 'Cu ce producători lucrați?',
    answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan și Renal.',
  },
  {
    question: 'Care e programul?',
    answer:
      'Luni–Vineri, 08:00–17:00. Telefon: 0742 936 959. WhatsApp: 0761 927 076. Email: contact@agrosalso.ro.',
  },
];

export const FAQ_I18N: Record<Language, FaqItem[]> = {
  ro: FAQ_RO,
  en: [
    {
      question: 'What kind of machinery do you sell?',
      answer:
        "Trailed and mounted machinery for soil preparation, seeding and crop maintenance, plus spare parts. We don't sell tractors, combines or irrigation systems.",
    },
    {
      question: 'Do you deliver nationwide?',
      answer: 'Yes. We arrange transport to the farm, anywhere in Romania.',
    },
    {
      question: 'Do you prepare offers for AFIR projects?',
      answer:
        'Yes. We prepare an offer that complies with AFIR requirements within a maximum of 24 hours and help you choose the right equipment for the project.',
    },
    {
      question: 'What financing options are available?',
      answer:
        "Monthly installments, leasing or seasonal payments, tailored to your farm's activity. We go through the options together and choose the right one.",
    },
    {
      question: 'Do you have spare parts in stock?',
      answer: 'Yes, for the machinery in our range. We also help you identify the right component.',
    },
    {
      question: 'Which manufacturers do you work with?',
      answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan and Renal.',
    },
    {
      question: 'What are your working hours?',
      answer:
        'Monday–Friday, 08:00–17:00. Phone: 0742 936 959. WhatsApp: 0761 927 076. Email: contact@agrosalso.ro.',
    },
  ],
  hu: [
    {
      question: 'Milyen gépeket árulnak?',
      answer:
        'Vontatott és függesztett gépeket a talajelőkészítéshez, vetéshez és a növényápoláshoz, valamint alkatrészeket. Traktort, kombájnt vagy öntözőrendszert nem árulunk.',
    },
    {
      question: 'Szállítanak az ország egész területén?',
      answer: 'Igen. A szállítást a gazdaságig megoldjuk, bárhol Romániában.',
    },
    {
      question: 'Készítenek ajánlatot AFIR-projektekhez?',
      answer:
        'Igen. Az AFIR követelményeinek megfelelő ajánlatot legfeljebb 24 órán belül elkészítjük, és segítünk kiválasztani a projekthez megfelelő eszközöket.',
    },
    {
      question: 'Milyen finanszírozási lehetőségek vannak?',
      answer:
        'Havi törlesztés, lízing vagy szezonális törlesztés, a gazdaság tevékenységéhez igazítva. Együtt átnézzük a lehetőségeket és kiválasztjuk a megfelelőt.',
    },
    {
      question: 'Van alkatrész raktáron?',
      answer: 'Igen, a kínálatunkban lévő gépekhez. Segítünk a megfelelő komponens azonosításában is.',
    },
    {
      question: 'Milyen gyártókkal dolgoznak együtt?',
      answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan és Renal.',
    },
    {
      question: 'Mi a nyitvatartás?',
      answer:
        'Hétfő–Péntek, 08:00–17:00. Telefon: 0742 936 959. WhatsApp: 0761 927 076. Email: contact@agrosalso.ro.',
    },
  ],
  it: [
    {
      question: 'Che tipo di macchine vendete?',
      answer:
        "Macchine trainate e portate per la preparazione del terreno, la semina e la cura delle colture, più pezzi di ricambio. Non vendiamo trattori, mietitrebbie o impianti di irrigazione.",
    },
    {
      question: 'Consegnate in tutto il paese?',
      answer: "Sì. Organizziamo il trasporto fino all'azienda agricola, in qualsiasi zona della Romania.",
    },
    {
      question: 'Preparate offerte per progetti AFIR?',
      answer:
        "Sì. Prepariamo l'offerta conforme ai requisiti AFIR entro un massimo di 24 ore e ti aiutiamo a scegliere le attrezzature giuste per il progetto.",
    },
    {
      question: 'Quali opzioni di finanziamento esistono?',
      answer:
        "Rate mensili, leasing o rate stagionali, adattate all'attività dell'azienda. Analizziamo insieme le opzioni e scegliamo quella giusta.",
    },
    {
      question: 'Avete pezzi di ricambio in magazzino?',
      answer: 'Sì, per le macchine del nostro catalogo. Ti aiutiamo anche a identificare il componente giusto.',
    },
    {
      question: 'Con quali produttori lavorate?',
      answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan e Renal.',
    },
    {
      question: 'Quali sono gli orari?',
      answer:
        'Lunedì–Venerdì, 08:00–17:00. Telefono: 0742 936 959. WhatsApp: 0761 927 076. Email: contact@agrosalso.ro.',
    },
  ],
  de: [
    {
      question: 'Welche Maschinen verkaufen Sie?',
      answer:
        'Gezogene und angebaute Maschinen für Bodenbearbeitung, Aussaat und Pflanzenpflege, sowie Ersatzteile. Traktoren, Mähdrescher oder Bewässerungssysteme verkaufen wir nicht.',
    },
    {
      question: 'Liefern Sie landesweit?',
      answer: 'Ja. Wir organisieren den Transport bis zum Betrieb, überall in Rumänien.',
    },
    {
      question: 'Erstellen Sie Angebote für AFIR-Projekte?',
      answer:
        'Ja. Wir erstellen das AFIR-konforme Angebot innerhalb von maximal 24 Stunden und helfen Ihnen bei der Auswahl der richtigen Geräte für das Projekt.',
    },
    {
      question: 'Welche Finanzierungsmöglichkeiten gibt es?',
      answer:
        'Monatliche Raten, Leasing oder saisonale Raten, abgestimmt auf die Tätigkeit des Betriebs. Wir gehen die Optionen gemeinsam durch und wählen die passende Variante.',
    },
    {
      question: 'Haben Sie Ersatzteile auf Lager?',
      answer: 'Ja, für die Maschinen aus unserem Sortiment. Wir helfen Ihnen auch, die richtige Komponente zu identifizieren.',
    },
    {
      question: 'Mit welchen Herstellern arbeiten Sie zusammen?',
      answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan und Renal.',
    },
    {
      question: 'Was sind die Öffnungszeiten?',
      answer:
        'Montag–Freitag, 08:00–17:00. Telefon: 0742 936 959. WhatsApp: 0761 927 076. E-Mail: contact@agrosalso.ro.',
    },
  ],
  es: [
    {
      question: '¿Qué tipo de maquinaria venden?',
      answer:
        'Maquinaria arrastrada y suspendida para la preparación del terreno, la siembra y el mantenimiento de cultivos, además de piezas de repuesto. No vendemos tractores, cosechadoras ni sistemas de riego.',
    },
    {
      question: '¿Entregan en todo el país?',
      answer: 'Sí. Organizamos el transporte hasta la granja, en cualquier parte de Rumanía.',
    },
    {
      question: '¿Preparan ofertas para proyectos AFIR?',
      answer:
        'Sí. Preparamos la oferta conforme a los requisitos de AFIR en un máximo de 24 horas y le ayudamos a elegir el equipo adecuado para el proyecto.',
    },
    {
      question: '¿Qué opciones de financiación existen?',
      answer:
        'Cuotas mensuales, leasing o cuotas estacionales, adaptadas a la actividad de la granja. Analizamos juntos las opciones y elegimos la adecuada.',
    },
    {
      question: '¿Tienen piezas de repuesto en stock?',
      answer: 'Sí, para la maquinaria de nuestro catálogo. También le ayudamos a identificar el componente adecuado.',
    },
    {
      question: '¿Con qué fabricantes trabajan?',
      answer: 'Dexwal, Helagro, Mega Metal, Strumyk, Tolmet, Bomet, BT, Letak, Turan y Renal.',
    },
    {
      question: '¿Cuál es el horario?',
      answer:
        'Lunes–Viernes, 08:00–17:00. Teléfono: 0742 936 959. WhatsApp: 0761 927 076. Email: contact@agrosalso.ro.',
    },
  ],
};

export const FAQ_TITLE_I18N: Record<Language, string> = {
  ro: 'Întrebări frecvente',
  en: 'Frequently asked questions',
  hu: 'Gyakran ismételt kérdések',
  it: 'Domande frequenti',
  de: 'Häufig gestellte Fragen',
  es: 'Preguntas frecuentes',
};

export interface OfferStat {
  value: string;
  label: string;
}

export interface OfferContent {
  overline: string;
  title: string;
  text1: string;
  text2: string;
  cta1: string;
  cta2: string;
  footnote: string;
  stats: OfferStat[];
}

export const OFFER_I18N: Record<Language, OfferContent> = {
  ro: {
    overline: 'Finanțare activă',
    title: 'DR 14 AFIR 2026: până la 50.000 € pentru ferme mici',
    text1:
      'Sprijin nerambursabil de până la 50.000 de euro pe proiect, maximum 85% din cheltuielile eligibile. Se finanțează inclusiv utilaje și echipamente agricole noi.',
    text2: 'Depunerile sunt deschise până pe 31 octombrie 2026, ora 16:00.',
    cta1: 'Cere ofertă conformă AFIR',
    cta2: 'Detalii despre sesiune',
    footnote: 'Pregătim oferta pentru utilaje în maximum 24 de ore.',
    stats: [
      { value: 'până la 50.000 €', label: 'sprijin nerambursabil pe proiect' },
      { value: 'max. 85%', label: 'din cheltuielile eligibile' },
      { value: '31 oct. 2026', label: 'termen depunere, ora 16:00' },
    ],
  },
  en: {
    overline: 'Active funding',
    title: 'DR 14 AFIR 2026: up to €50,000 for small farms',
    text1:
      'Non-refundable support of up to 50,000 euros per project, covering a maximum of 85% of eligible expenses. New agricultural machinery and equipment are eligible too.',
    text2: 'Applications are open until October 31, 2026, 16:00.',
    cta1: 'Request an AFIR-compliant offer',
    cta2: 'Details about this funding session',
    footnote: 'We prepare the equipment offer within a maximum of 24 hours.',
    stats: [
      { value: 'up to €50,000', label: 'non-refundable support per project' },
      { value: 'max. 85%', label: 'of eligible expenses' },
      { value: 'Oct 31, 2026', label: 'deadline, 16:00' },
    ],
  },
  hu: {
    overline: 'Aktív finanszírozás',
    title: 'DR 14 AFIR 2026: akár 50 000 € a kisgazdaságoknak',
    text1:
      'Vissza nem térítendő támogatás projektenként legfeljebb 50 000 euró értékben, az elszámolható költségek legfeljebb 85%-áig. A támogatás új mezőgazdasági gépekre és eszközökre is vonatkozik.',
    text2: 'A pályázatok benyújtása 2026. október 31-én, 16:00 óráig tart.',
    cta1: 'Kérjen AFIR-kompatibilis ajánlatot',
    cta2: 'Részletek a pályázati időszakról',
    footnote: 'A gépekre vonatkozó ajánlatot legfeljebb 24 órán belül elkészítjük.',
    stats: [
      { value: 'akár 50 000 €', label: 'vissza nem térítendő támogatás projektenként' },
      { value: 'max. 85%', label: 'az elszámolható költségekből' },
      { value: '2026.10.31.', label: 'beadási határidő, 16:00' },
    ],
  },
  it: {
    overline: 'Finanziamento attivo',
    title: 'DR 14 AFIR 2026: fino a 50.000 € per le piccole aziende agricole',
    text1:
      "Sostegno a fondo perduto fino a 50.000 euro per progetto, per un massimo dell'85% delle spese ammissibili. Sono finanziabili anche macchine e attrezzature agricole nuove.",
    text2: 'Le domande si possono presentare fino al 31 ottobre 2026, ore 16:00.',
    cta1: "Richiedi un'offerta conforme AFIR",
    cta2: 'Dettagli sulla sessione',
    footnote: "Prepariamo l'offerta per le attrezzature entro un massimo di 24 ore.",
    stats: [
      { value: 'fino a 50.000 €', label: 'sostegno a fondo perduto per progetto' },
      { value: 'max. 85%', label: 'delle spese ammissibili' },
      { value: '31 ott. 2026', label: 'scadenza, ore 16:00' },
    ],
  },
  de: {
    overline: 'Aktive Förderung',
    title: 'DR 14 AFIR 2026: bis zu 50.000 € für Kleinbetriebe',
    text1:
      'Nicht rückzahlbare Unterstützung von bis zu 50.000 Euro pro Projekt, maximal 85 % der förderfähigen Ausgaben. Gefördert werden auch neue Landmaschinen und Geräte.',
    text2: 'Die Antragstellung ist bis zum 31. Oktober 2026, 16:00 Uhr, geöffnet.',
    cta1: 'AFIR-konformes Angebot anfordern',
    cta2: 'Details zur Förderrunde',
    footnote: 'Wir erstellen das Angebot für die Geräte innerhalb von maximal 24 Stunden.',
    stats: [
      { value: 'bis zu 50.000 €', label: 'nicht rückzahlbare Förderung pro Projekt' },
      { value: 'max. 85 %', label: 'der förderfähigen Ausgaben' },
      { value: '31.10.2026', label: 'Frist, 16:00 Uhr' },
    ],
  },
  es: {
    overline: 'Financiación activa',
    title: 'DR 14 AFIR 2026: hasta 50.000 € para pequeñas explotaciones',
    text1:
      'Apoyo no reembolsable de hasta 50.000 euros por proyecto, con un máximo del 85% de los gastos elegibles. También se financia maquinaria y equipos agrícolas nuevos.',
    text2: 'Las solicitudes están abiertas hasta el 31 de octubre de 2026, a las 16:00.',
    cta1: 'Solicitar oferta conforme a AFIR',
    cta2: 'Detalles sobre la convocatoria',
    footnote: 'Preparamos la oferta de maquinaria en un máximo de 24 horas.',
    stats: [
      { value: 'hasta 50.000 €', label: 'apoyo no reembolsable por proyecto' },
      { value: 'máx. 85%', label: 'de los gastos elegibles' },
      { value: '31 oct. 2026', label: 'plazo, 16:00' },
    ],
  },
};
