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
  /** Doar pentru produsele cu priceMode 'variant': blocul separat de pe pagina produsului. */
  variant?: { title: string; name: string; note: string };
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
}

export const BF_I18N: Record<Language, BfContent> = {
  ro: {
    overline: 'Black Friday',
    title: 'Șase utilaje la preț redus',
    text1:
      'Scarificator LEKO, plug reversibil TURAN, gruber DEXWAL GRUNT cu tăvălug, combinator DEXWAL K, plantator RENAL și terradisc DEXWAL MAMUT. Prețurile sunt în euro, fără TVA, și sunt valabile în limita stocului.',
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
        variant: { title: 'Varianta cu tăvălug', name: 'Gruber GRUNT cu tăvălug', note: 'Preț separat pentru varianta cu tăvălug. Lățimea și tipul tăvălugului se confirmă la ofertă.' },
      },
      k: {
        name: 'Combinator DEXWAL K 4,2 m',
        spec: '36 organe active · tăvălug frontal 460 mm + 2 tăvălugi spate',
        variant: { title: 'Configurația din ofertă', name: 'Combinator K 4,2 m', note: 'Preț separat pentru această configurație. Prețul standard „de la” rămâne valabil pentru celelalte variante.' },
      },
      renal: {
        name: 'Plantator universal RENAL',
        spec: 'Arpagic și usturoi · 4 rânduri · tractor de la 40 CP',
      },
      mamut: {
        name: 'Terradisc DEXWAL MAMUT 3 m',
        spec: 'Talere de 610 mm · tăvălug cracker',
        variant: { title: 'Configurația din ofertă', name: 'Terradisc MAMUT 3 m, talere 610 mm, tăvălug cracker', note: 'Preț separat pentru această configurație. Prețul standard „de la” rămâne valabil pentru celelalte variante.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Ofertă valabilă până pe {date}, în limita stocului',
  },
  en: {
    overline: 'Black Friday',
    title: 'Six machines at a reduced price',
    text1:
      'LEKO scarifier, TURAN reversible plough, DEXWAL GRUNT cultivator with roller, DEXWAL K combinator, RENAL planter and DEXWAL MAMUT terradisc. Prices are in euro, excluding VAT, and valid while stocks last.',
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
        variant: { title: 'Version with roller', name: 'GRUNT cultivator with roller', note: 'Separate price for the version with roller. The roller width and type are confirmed with the offer.' },
      },
      k: {
        name: 'DEXWAL K combinator 4.2 m',
        spec: '36 active tines · 460 mm front roller + 2 rear rollers',
        variant: { title: 'Offer configuration', name: 'K combinator 4.2 m', note: 'Separate price for this configuration. The standard “from” price remains valid for the other versions.' },
      },
      renal: {
        name: 'RENAL universal planter',
        spec: 'Shallots and garlic · 4 rows · tractor from 40 HP',
      },
      mamut: {
        name: 'DEXWAL MAMUT terradisc 3 m',
        spec: '610 mm discs · cracker roller',
        variant: { title: 'Offer configuration', name: 'MAMUT terradisc 3 m, 610 mm discs, cracker roller', note: 'Separate price for this configuration. The standard “from” price remains valid for the other versions.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Offer valid until {date}, while stocks last',
  },
  hu: {
    overline: 'Black Friday',
    title: 'Hat gép kedvezményes áron',
    text1:
      'LEKO kultivátor, TURAN váltvaforgató eke, DEXWAL GRUNT grubber hengerrel, DEXWAL K kombinátor, RENAL ültetőgép és DEXWAL MAMUT terradisc. Az árak euróban értendők, ÁFA nélkül, és a készlet erejéig érvényesek.',
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
        variant: { title: 'Hengeres változat', name: 'GRUNT grubber hengerrel', note: 'Külön ár a hengeres változatra. A henger szélességét és típusát az ajánlatban pontosítjuk.' },
      },
      k: {
        name: 'DEXWAL K kombinátor 4,2 m',
        spec: '36 aktív kapa · 460 mm-es első henger + 2 hátsó henger',
        variant: { title: 'Ajánlat szerinti konfiguráció', name: 'K kombinátor 4,2 m', note: 'Külön ár erre a konfigurációra. A szokásos „-tól” ár a többi változatra érvényes marad.' },
      },
      renal: {
        name: 'RENAL univerzális ültetőgép',
        spec: 'Mogyoróhagyma és fokhagyma · 4 sor · traktor 40 LE-től',
      },
      mamut: {
        name: 'DEXWAL MAMUT terradisc 3 m',
        spec: '610 mm-es tárcsák · cracker henger',
        variant: { title: 'Ajánlat szerinti konfiguráció', name: 'MAMUT terradisc 3 m, 610 mm-es tárcsák, cracker henger', note: 'Külön ár erre a konfigurációra. A szokásos „-tól” ár a többi változatra érvényes marad.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Az ajánlat {date}-ig érvényes, a készlet erejéig',
  },
  it: {
    overline: 'Black Friday',
    title: 'Sei macchine a prezzo ridotto',
    text1:
      'Scarificatore LEKO, aratro reversibile TURAN, coltivatore DEXWAL GRUNT con rullo, combinatore DEXWAL K, piantatrice RENAL e terradisc DEXWAL MAMUT. I prezzi sono in euro, IVA esclusa, e validi fino a esaurimento scorte.',
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
        variant: { title: 'Versione con rullo', name: 'Coltivatore GRUNT con rullo', note: "Prezzo separato per la versione con rullo. Larghezza e tipo del rullo si confermano con l'offerta." },
      },
      k: {
        name: 'Combinatore DEXWAL K 4,2 m',
        spec: '36 organi attivi · rullo anteriore 460 mm + 2 rulli posteriori',
        variant: { title: 'Configurazione in offerta', name: 'Combinatore K 4,2 m', note: 'Prezzo separato per questa configurazione. Il prezzo standard «da» resta valido per le altre versioni.' },
      },
      renal: {
        name: 'Piantatrice universale RENAL',
        spec: 'Scalogno e aglio · 4 file · trattore da 40 CV',
      },
      mamut: {
        name: 'Terradisc DEXWAL MAMUT 3 m',
        spec: 'Dischi da 610 mm · rullo cracker',
        variant: { title: 'Configurazione in offerta', name: 'Terradisc MAMUT 3 m, dischi da 610 mm, rullo cracker', note: 'Prezzo separato per questa configurazione. Il prezzo standard «da» resta valido per le altre versioni.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Offerta valida fino al {date}, fino a esaurimento scorte',
  },
  de: {
    overline: 'Black Friday',
    title: 'Sechs Maschinen zum reduzierten Preis',
    text1:
      'Scarifikator LEKO, Wendepflug TURAN, Grubber DEXWAL GRUNT mit Walze, Kombinator DEXWAL K, Pflanzmaschine RENAL und Terradisc DEXWAL MAMUT. Die Preise verstehen sich in Euro, ohne MwSt., und gelten solange der Vorrat reicht.',
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
        variant: { title: 'Variante mit Walze', name: 'Grubber GRUNT mit Walze', note: 'Separater Preis für die Variante mit Walze. Breite und Typ der Walze werden mit dem Angebot bestätigt.' },
      },
      k: {
        name: 'Kombinator DEXWAL K 4,2 m',
        spec: '36 aktive Zinken · Frontwalze 460 mm + 2 Heckwalzen',
        variant: { title: 'Angebotskonfiguration', name: 'Kombinator K 4,2 m', note: 'Separater Preis für diese Konfiguration. Der Standardpreis „ab“ gilt weiterhin für die anderen Varianten.' },
      },
      renal: {
        name: 'Universal-Pflanzmaschine RENAL',
        spec: 'Schalotten und Knoblauch · 4 Reihen · Traktor ab 40 PS',
      },
      mamut: {
        name: 'Terradisc DEXWAL MAMUT 3 m',
        spec: 'Scheiben 610 mm · Crackerwalze',
        variant: { title: 'Angebotskonfiguration', name: 'Terradisc MAMUT 3 m, Scheiben 610 mm, Crackerwalze', note: 'Separater Preis für diese Konfiguration. Der Standardpreis „ab“ gilt weiterhin für die anderen Varianten.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Angebot gültig bis {date}, solange der Vorrat reicht',
  },
  es: {
    overline: 'Black Friday',
    title: 'Seis máquinas a precio reducido',
    text1:
      'Escarificador LEKO, arado reversible TURAN, cultivador DEXWAL GRUNT con rodillo, combinador DEXWAL K, plantadora RENAL y terradisc DEXWAL MAMUT. Los precios son en euros, sin IVA, y válidos hasta agotar existencias.',
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
        variant: { title: 'Versión con rodillo', name: 'Cultivador GRUNT con rodillo', note: 'Precio aparte para la versión con rodillo. El ancho y el tipo de rodillo se confirman con la oferta.' },
      },
      k: {
        name: 'Combinador DEXWAL K 4,2 m',
        spec: '36 brazos activos · rodillo delantero 460 mm + 2 rodillos traseros',
        variant: { title: 'Configuración en oferta', name: 'Combinador K 4,2 m', note: 'Precio aparte para esta configuración. El precio estándar «desde» sigue vigente para las demás versiones.' },
      },
      renal: {
        name: 'Plantadora universal RENAL',
        spec: 'Chalota y ajo · 4 filas · tractor desde 40 CV',
      },
      mamut: {
        name: 'Terradisc DEXWAL MAMUT 3 m',
        spec: 'Discos de 610 mm · rodillo cracker',
        variant: { title: 'Configuración en oferta', name: 'Terradisc MAMUT 3 m, discos de 610 mm, rodillo cracker', note: 'Precio aparte para esta configuración. El precio estándar «desde» sigue vigente para las demás versiones.' },
      },
    },
    pageLabel: 'Black Friday',
    pageValidUntil: 'Oferta válida hasta el {date}, hasta agotar existencias',
  },
};
