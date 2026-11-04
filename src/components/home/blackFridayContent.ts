// Local 6-language dictionary for the Black Friday 2026 promotion
// (homepage section + product-page price blocks).
//
// RO copy comes verbatim from the client's package (PACHET_BLACK_FRIDAY_2026-11 /
// SECTIUNE_HOMEPAGE_BLACK_FRIDAY.html). The other languages are faithful
// translations. Brand names, prices and "Black Friday" are NOT translated.
// "{date}" is replaced with the formatted end date (see formatBfEndDate).

import type { Language } from '@/context/LanguageContext';
import type { BfProductId } from '@/lib/promo/blackFriday';

export interface BfProductText {
  name: string;
  spec: string;
  /** Prefilled WhatsApp message (only used by products without a page). */
  whatsappText?: string;
}

export interface BfContent {
  overline: string;
  title: string;
  text1: string;
  textEnd: string; // contains {date}
  textStart: string; // upcoming phase, contains {date}
  comingSoon: string;
  whatsappReserve: string;
  ctaWhatsapp: string;
  ctaCall: string; // phone number appended in the component
  footnote: string;
  whatsappGeneral: string;
  vat: string; // "+ TVA"
  carouselLabel: string;
  prev: string;
  next: string;
  slide: string; // "Slide {n}"
  slideOf: string; // "{n} din {total}"
  linkDetails: string;
  linkWhatsapp: string;
  products: Record<BfProductId, BfProductText>;
  // Product page
  pageLabel: string; // "Black Friday"
  pageValidUntil: string; // contains {date}
  variantTitle: string;
  variantName: string;
  variantNote: string;
}

export const BF_I18N: Record<Language, BfContent> = {
  ro: {
    overline: 'Black Friday',
    title: 'Trei utilaje la preț redus',
    text1:
      'Scarificator LEKO, plug reversibil TURAN și gruber DEXWAL GRUNT cu tăvălug. Prețurile sunt în euro, fără TVA, și sunt valabile în limita stocului.',
    textEnd: 'Oferta e valabilă până pe {date}.',
    textStart: "Oferta începe pe {date}.",
    comingSoon: "În curând",
    whatsappReserve: "Bună ziua! Aș vrea să rezerv oferta de Black Friday.",
    ctaWhatsapp: 'Cere oferta pe WhatsApp',
    ctaCall: 'Sună:',
    footnote: 'Pregătim oferta în maximum 24 de ore.',
    whatsappGeneral: 'Bună ziua! Mă interesează oferta de Black Friday.',
    vat: '+ TVA',
    carouselLabel: 'Utilaje Black Friday',
    prev: 'Înapoi',
    next: 'Înainte',
    slide: 'Slide {n}',
    slideOf: '{n} din {total}',
    linkDetails: 'Detalii produs',
    linkWhatsapp: 'Cere oferta pe WhatsApp',
    products: {
      leko: {
        name: 'Scarificator LEKO',
        spec: 'Cadru greu 160×160 · 60 cm · 5 ancore · 150 CP',
        whatsappText: 'Bună ziua! Mă interesează scarificatorul LEKO de Black Friday.',
      },
      turan: {
        name: 'Plug reversibil TURAN',
        spec: 'Reversare hidraulică · cadru din oțel tratat termic',
      },
      grunt: {
        name: 'Gruber DEXWAL GRUNT cu tăvălug',
        spec: 'Organe labă de gâscă pe 2 rânduri · cadru 80×80 mm',
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Ofertă valabilă până pe {date}, în limita stocului',
    variantTitle: 'Varianta cu tăvălug',
    variantName: 'Gruber GRUNT cu tăvălug',
    variantNote:
      'Preț separat pentru varianta cu tăvălug. Lățimea și tipul tăvălugului se confirmă la ofertă.',
  },
  en: {
    overline: 'Black Friday',
    title: 'Three machines at a reduced price',
    text1:
      'LEKO scarifier, TURAN reversible plough and DEXWAL GRUNT cultivator with roller. Prices are in euro, excluding VAT, and valid while stocks last.',
    textEnd: 'The offer is valid until {date}.',
    textStart: "The offer starts on {date}.",
    comingSoon: "Coming soon",
    whatsappReserve: "Hello! I would like to reserve the Black Friday offer.",
    ctaWhatsapp: 'Request an offer on WhatsApp',
    ctaCall: 'Call:',
    footnote: 'We prepare your offer within 24 hours at most.',
    whatsappGeneral: 'Hello! I am interested in the Black Friday offer.',
    vat: '+ VAT',
    carouselLabel: 'Black Friday machines',
    prev: 'Previous',
    next: 'Next',
    slide: 'Slide {n}',
    slideOf: '{n} of {total}',
    linkDetails: 'Product details',
    linkWhatsapp: 'Request an offer on WhatsApp',
    products: {
      leko: {
        name: 'LEKO scarifier',
        spec: 'Heavy frame 160×160 · 60 cm · 5 tines · 150 HP',
        whatsappText: 'Hello! I am interested in the LEKO scarifier for Black Friday.',
      },
      turan: {
        name: 'TURAN reversible plough',
        spec: 'Hydraulic reversing · heat-treated steel frame',
      },
      grunt: {
        name: 'DEXWAL GRUNT cultivator with roller',
        spec: 'Goosefoot tines on 2 rows · 80×80 mm frame',
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Offer valid until {date}, while stocks last',
    variantTitle: 'Version with roller',
    variantName: 'GRUNT cultivator with roller',
    variantNote:
      'Separate price for the version with roller. The roller width and type are confirmed with the offer.',
  },
  hu: {
    overline: 'Black Friday',
    title: 'Három gép kedvezményes áron',
    text1:
      'LEKO kultivátor, TURAN váltvaforgató eke és DEXWAL GRUNT grubber hengerrel. Az árak euróban értendők, ÁFA nélkül, és a készlet erejéig érvényesek.',
    textEnd: 'Az ajánlat {date}-ig érvényes.',
    textStart: "Az ajánlat {date}-án kezdődik.",
    comingSoon: "Hamarosan",
    whatsappReserve: "Jó napot! Szeretném lefoglalni a Black Friday ajánlatot.",
    ctaWhatsapp: 'Ajánlatkérés WhatsAppon',
    ctaCall: 'Hívjon:',
    footnote: 'Az ajánlatot legfeljebb 24 órán belül elkészítjük.',
    whatsappGeneral: 'Jó napot! Érdekel a Black Friday ajánlat.',
    vat: '+ ÁFA',
    carouselLabel: 'Black Friday gépek',
    prev: 'Előző',
    next: 'Következő',
    slide: '{n}. dia',
    slideOf: '{n} / {total}',
    linkDetails: 'Termék részletei',
    linkWhatsapp: 'Ajánlatkérés WhatsAppon',
    products: {
      leko: {
        name: 'LEKO kultivátor',
        spec: 'Nehéz váz 160×160 · 60 cm · 5 kapa · 150 LE',
        whatsappText: 'Jó napot! Érdekel a LEKO kultivátor a Black Friday ajánlatban.',
      },
      turan: {
        name: 'TURAN váltvaforgató eke',
        spec: 'Hidraulikus átfordítás · hőkezelt acél váz',
      },
      grunt: {
        name: 'DEXWAL GRUNT grubber hengerrel',
        spec: 'Libalábkapák 2 sorban · 80×80 mm váz',
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Az ajánlat {date}-ig érvényes, a készlet erejéig',
    variantTitle: 'Hengeres változat',
    variantName: 'GRUNT grubber hengerrel',
    variantNote:
      'Külön ár a hengeres változatra. A henger szélességét és típusát az ajánlatban pontosítjuk.',
  },
  it: {
    overline: 'Black Friday',
    title: 'Tre macchine a prezzo ridotto',
    text1:
      'Scarificatore LEKO, aratro reversibile TURAN e coltivatore DEXWAL GRUNT con rullo. I prezzi sono in euro, IVA esclusa, e validi fino a esaurimento scorte.',
    textEnd: "L'offerta è valida fino al {date}.",
    textStart: "L'offerta inizia il {date}.",
    comingSoon: "In arrivo",
    whatsappReserve: "Buongiorno! Vorrei prenotare l'offerta Black Friday.",
    ctaWhatsapp: "Richiedi l'offerta su WhatsApp",
    ctaCall: 'Chiama:',
    footnote: "Prepariamo l'offerta entro 24 ore al massimo.",
    whatsappGeneral: "Buongiorno! Sono interessato all'offerta Black Friday.",
    vat: '+ IVA',
    carouselLabel: 'Macchine Black Friday',
    prev: 'Indietro',
    next: 'Avanti',
    slide: 'Slide {n}',
    slideOf: '{n} di {total}',
    linkDetails: 'Dettagli prodotto',
    linkWhatsapp: "Richiedi l'offerta su WhatsApp",
    products: {
      leko: {
        name: 'Scarificatore LEKO',
        spec: 'Telaio pesante 160×160 · 60 cm · 5 ancore · 150 CV',
        whatsappText: 'Buongiorno! Sono interessato allo scarificatore LEKO per il Black Friday.',
      },
      turan: {
        name: 'Aratro reversibile TURAN',
        spec: 'Rotazione idraulica · telaio in acciaio trattato termicamente',
      },
      grunt: {
        name: 'Coltivatore DEXWAL GRUNT con rullo',
        spec: "Organi a zampa d'oca su 2 file · telaio 80×80 mm",
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Offerta valida fino al {date}, fino a esaurimento scorte',
    variantTitle: 'Versione con rullo',
    variantName: 'Coltivatore GRUNT con rullo',
    variantNote:
      "Prezzo separato per la versione con rullo. Larghezza e tipo del rullo si confermano con l'offerta.",
  },
  de: {
    overline: 'Black Friday',
    title: 'Drei Maschinen zum reduzierten Preis',
    text1:
      'Scarifikator LEKO, Wendepflug TURAN und Grubber DEXWAL GRUNT mit Walze. Die Preise verstehen sich in Euro, ohne MwSt., und gelten solange der Vorrat reicht.',
    textEnd: 'Das Angebot gilt bis zum {date}.',
    textStart: "Das Angebot startet am {date}.",
    comingSoon: "Demnächst",
    whatsappReserve: "Guten Tag! Ich möchte das Black-Friday-Angebot reservieren.",
    ctaWhatsapp: 'Angebot per WhatsApp anfragen',
    ctaCall: 'Anrufen:',
    footnote: 'Wir erstellen Ihr Angebot innerhalb von maximal 24 Stunden.',
    whatsappGeneral: 'Guten Tag! Ich interessiere mich für das Black-Friday-Angebot.',
    vat: '+ MwSt.',
    carouselLabel: 'Black-Friday-Maschinen',
    prev: 'Zurück',
    next: 'Weiter',
    slide: 'Folie {n}',
    slideOf: '{n} von {total}',
    linkDetails: 'Produktdetails',
    linkWhatsapp: 'Angebot per WhatsApp anfragen',
    products: {
      leko: {
        name: 'Scarifikator LEKO',
        spec: 'Schwerer Rahmen 160×160 · 60 cm · 5 Zinken · 150 PS',
        whatsappText: 'Guten Tag! Ich interessiere mich für den Scarifikator LEKO zum Black Friday.',
      },
      turan: {
        name: 'Wendepflug TURAN',
        spec: 'Hydraulische Wendung · wärmebehandelter Stahlrahmen',
      },
      grunt: {
        name: 'Grubber DEXWAL GRUNT mit Walze',
        spec: 'Gänsefußschare in 2 Reihen · Rahmen 80×80 mm',
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Angebot gültig bis {date}, solange der Vorrat reicht',
    variantTitle: 'Variante mit Walze',
    variantName: 'Grubber GRUNT mit Walze',
    variantNote:
      'Separater Preis für die Variante mit Walze. Breite und Typ der Walze werden mit dem Angebot bestätigt.',
  },
  es: {
    overline: 'Black Friday',
    title: 'Tres máquinas a precio reducido',
    text1:
      'Escarificador LEKO, arado reversible TURAN y cultivador DEXWAL GRUNT con rodillo. Los precios son en euros, sin IVA, y válidos hasta agotar existencias.',
    textEnd: 'La oferta es válida hasta el {date}.',
    textStart: "La oferta comienza el {date}.",
    comingSoon: "Próximamente",
    whatsappReserve: "¡Buenos días! Quisiera reservar la oferta de Black Friday.",
    ctaWhatsapp: 'Pide la oferta por WhatsApp',
    ctaCall: 'Llama:',
    footnote: 'Preparamos la oferta en un máximo de 24 horas.',
    whatsappGeneral: '¡Buenos días! Me interesa la oferta de Black Friday.',
    vat: '+ IVA',
    carouselLabel: 'Máquinas Black Friday',
    prev: 'Anterior',
    next: 'Siguiente',
    slide: 'Diapositiva {n}',
    slideOf: '{n} de {total}',
    linkDetails: 'Detalles del producto',
    linkWhatsapp: 'Pide la oferta por WhatsApp',
    products: {
      leko: {
        name: 'Escarificador LEKO',
        spec: 'Bastidor reforzado 160×160 · 60 cm · 5 brazos · 150 CV',
        whatsappText: '¡Buenos días! Me interesa el escarificador LEKO de Black Friday.',
      },
      turan: {
        name: 'Arado reversible TURAN',
        spec: 'Volteo hidráulico · bastidor de acero con tratamiento térmico',
      },
      grunt: {
        name: 'Cultivador DEXWAL GRUNT con rodillo',
        spec: 'Rejas pata de ganso en 2 filas · bastidor 80×80 mm',
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Oferta válida hasta el {date}, hasta agotar existencias',
    variantTitle: 'Versión con rodillo',
    variantName: 'Cultivador GRUNT con rodillo',
    variantNote:
      'Precio aparte para la versión con rodillo. El ancho y el tipo de rodillo se confirman con la oferta.',
  },
};
