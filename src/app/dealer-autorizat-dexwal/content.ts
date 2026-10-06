// Conținut local pentru /dealer-autorizat-dexwal, pe cele 6 limbi ale site-ului.
// RO = text aprobat din pachetul SEO (app/dealer-autorizat-dexwal/page.tsx).
// Celelalte limbi sunt traduceri fidele ale acelorași texte. Numele de
// categorii și modele folosesc aceeași terminologie ca restul site-ului
// (src/lib/translations.ts: terradisc, combinator, gruber, distribuitor-ingrasamant).

export interface CategorieDexwal {
  categorie: string;
  modele: string;
}

export interface DexwalContent {
  label: string;
  heroTitle: string;
  intro: string;
  warranty: string;
  helpText: string;
  sectionTitle: string;
  categorii: CategorieDexwal[];
  closingPrefix: string;
  closingLinkText: string;
  ctaWhatsapp: string;
  ctaCallLabel: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
}

export const content: Record<'ro' | 'en' | 'hu' | 'it' | 'de' | 'es', DexwalContent> = {
  ro: {
    label: 'Dealer autorizat',
    heroTitle: 'Dealer autorizat Dexwal în România',
    intro:
      'Agro Salso este dealer autorizat Dexwal în România. Vindem utilaje Dexwal noi, cu prețul afișat pe site, și ținem pe stoc piese de schimb pentru utilajele din gamă.',
    warranty: 'Toate utilajele Dexwal vin cu 3 ani garanție.',
    helpText:
      'Te ajutăm să alegi modelul potrivit pentru ferma ta, în funcție de tipul solului, cultura, suprafața lucrată și tractorul cu care va lucra utilajul.',
    sectionTitle: 'Gama Dexwal la Agro Salso',
    categorii: [
      { categorie: 'Terradiscuri', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Combinatoare', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Grubere', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Distribuitoare de îngrășăminte', modele: 'Funnel' },
    ],
    closingPrefix: 'Prețurile și specificațiile complete sunt în',
    closingLinkText: 'catalogul de produse',
    ctaWhatsapp: 'Cere ofertă pe WhatsApp',
    ctaCallLabel: 'Sună: 0742 936 959',
    breadcrumbHome: 'Acasă',
    breadcrumbCurrent: 'Dealer autorizat Dexwal',
  },
  en: {
    label: 'Authorised dealer',
    heroTitle: 'Authorised Dexwal dealer in Romania',
    intro:
      'Agro Salso is an authorised Dexwal dealer in Romania. We sell new Dexwal equipment at the price shown on the site, and we keep spare parts in stock for the equipment in the range.',
    warranty: 'All Dexwal equipment comes with a 3-year warranty.',
    helpText:
      'We help you choose the right model for your farm, based on soil type, crop, area worked and the tractor the equipment will work with.',
    sectionTitle: 'The Dexwal range at Agro Salso',
    categorii: [
      { categorie: 'Disc harrows', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Cultivators', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Grubers', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Fertilizer spreaders', modele: 'Funnel' },
    ],
    closingPrefix: 'Full prices and specifications are in the',
    closingLinkText: 'product catalogue',
    ctaWhatsapp: 'Request a quote on WhatsApp',
    ctaCallLabel: 'Call: 0742 936 959',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Authorised Dexwal dealer',
  },
  hu: {
    label: 'Hivatalos forgalmazó',
    heroTitle: 'Hivatalos Dexwal forgalmazó Romániában',
    intro:
      'Az Agro Salso hivatalos Dexwal forgalmazó Romániában. Új Dexwal gépeket árulunk, a weboldalon feltüntetett áron, és raktáron tartjuk a kínálatunkban szereplő gépek alkatrészeit.',
    warranty: 'Minden Dexwal gépre 3 év garanciát vállalunk.',
    helpText:
      'Segítünk kiválasztani a gazdaságodhoz illő modellt, a talaj típusa, a növénykultúra, a megművelt terület és a traktor alapján, amellyel a gép dolgozni fog.',
    sectionTitle: 'A Dexwal kínálat az Agro Salsonál',
    categorii: [
      { categorie: 'Rövidtárcsák', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Kombinátorok', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Grúberek', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Műtrágyaszórók', modele: 'Funnel' },
    ],
    closingPrefix: 'A teljes árak és műszaki adatok megtalálhatók a',
    closingLinkText: 'termékkatalógusban',
    ctaWhatsapp: 'Kérj ajánlatot WhatsApp-on',
    ctaCallLabel: 'Hívás: 0742 936 959',
    breadcrumbHome: 'Főoldal',
    breadcrumbCurrent: 'Hivatalos Dexwal forgalmazó',
  },
  it: {
    label: 'Rivenditore autorizzato',
    heroTitle: 'Rivenditore autorizzato Dexwal in Romania',
    intro:
      'Agro Salso è rivenditore autorizzato Dexwal in Romania. Vendiamo macchine Dexwal nuove, al prezzo indicato sul sito, e teniamo in stock i ricambi per le macchine della gamma.',
    warranty: 'Tutte le macchine Dexwal hanno 3 anni di garanzia.',
    helpText:
      'Ti aiutiamo a scegliere il modello giusto per la tua azienda agricola, in base al tipo di terreno, alla coltura, alla superficie lavorata e al trattore con cui lavorerà la macchina.',
    sectionTitle: 'La gamma Dexwal da Agro Salso',
    categorii: [
      { categorie: 'Erpici a dischi', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Coltivatori', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Gruber', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Spandiconcime', modele: 'Funnel' },
    ],
    closingPrefix: 'I prezzi e le specifiche complete sono nel',
    closingLinkText: 'catalogo prodotti',
    ctaWhatsapp: "Richiedi un'offerta su WhatsApp",
    ctaCallLabel: 'Chiama: 0742 936 959',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Rivenditore autorizzato Dexwal',
  },
  de: {
    label: 'Autorisierter Händler',
    heroTitle: 'Autorisierter Dexwal-Händler in Rumänien',
    intro:
      'Agro Salso ist autorisierter Dexwal-Händler in Rumänien. Wir verkaufen neue Dexwal-Maschinen zum auf der Website angegebenen Preis und halten Ersatzteile für die Maschinen unseres Sortiments auf Lager.',
    warranty: 'Alle Dexwal-Maschinen haben 3 Jahre Garantie.',
    helpText:
      'Wir helfen Ihnen, das passende Modell für Ihren Hof zu wählen, basierend auf Bodenart, Kultur, bearbeiteter Fläche und dem Traktor, mit dem die Maschine arbeiten wird.',
    sectionTitle: 'Das Dexwal-Sortiment bei Agro Salso',
    categorii: [
      { categorie: 'Scheibeneggen', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Grubber (Kombinator)', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Grubber', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Düngerstreuer', modele: 'Funnel' },
    ],
    closingPrefix: 'Die vollständigen Preise und technischen Daten finden Sie im',
    closingLinkText: 'Produktkatalog',
    ctaWhatsapp: 'Angebot per WhatsApp anfragen',
    ctaCallLabel: 'Anrufen: 0742 936 959',
    breadcrumbHome: 'Startseite',
    breadcrumbCurrent: 'Autorisierter Dexwal-Händler',
  },
  es: {
    label: 'Distribuidor autorizado',
    heroTitle: 'Distribuidor autorizado Dexwal en Rumanía',
    intro:
      'Agro Salso es distribuidor autorizado Dexwal en Rumanía. Vendemos maquinaria Dexwal nueva, al precio indicado en el sitio, y mantenemos en stock repuestos para la maquinaria de la gama.',
    warranty: 'Toda la maquinaria Dexwal tiene 3 años de garantía.',
    helpText:
      'Te ayudamos a elegir el modelo adecuado para tu finca, según el tipo de suelo, el cultivo, la superficie trabajada y el tractor con el que trabajará la máquina.',
    sectionTitle: 'La gama Dexwal en Agro Salso',
    categorii: [
      { categorie: 'Gradas de discos', modele: 'Mamut, Zuk, Tur' },
      { categorie: 'Cultivadores', modele: 'K, TK, Zubr, Lion' },
      { categorie: 'Gruber', modele: 'Dzik, Grunt, KBO' },
      { categorie: 'Abonadoras', modele: 'Funnel' },
    ],
    closingPrefix: 'Los precios y especificaciones completas están en el',
    closingLinkText: 'catálogo de productos',
    ctaWhatsapp: 'Solicita una oferta por WhatsApp',
    ctaCallLabel: 'Llamar: 0742 936 959',
    breadcrumbHome: 'Inicio',
    breadcrumbCurrent: 'Distribuidor autorizado Dexwal',
  },
};
