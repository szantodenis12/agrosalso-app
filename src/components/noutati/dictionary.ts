// Dicționar local pentru "chrome"-ul paginilor /noutati (titluri de secțiune,
// butoane, breadcrumb, etichete de dată) — NU pentru conținutul articolelor,
// care rămâne verbatim în română în toate limbile (vezi content/noutati.ts).
//
// Folosit din components/noutati/Chrome.tsx, selectat cu hook-ul de limbă
// existent al site-ului (useLanguage din '@/context/LanguageContext').

import type { Language } from '@/context/LanguageContext';

export interface NoutatiDictEntry {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  readArticle: string;
  backToList: string;
  publishedOn: string;
  contentLanguageNote: string;
  emptyState: string;
}

export const noutatiDict: Record<Language, NoutatiDictEntry> = {
  ro: {
    eyebrow: 'Noutăți',
    title: 'Noutăți și anunțuri',
    subtitle:
      'Sesiuni de finanțare active, utilaje noi în catalog și anunțuri Agro Salso.',
    breadcrumbLabel: 'Noutăți',
    readArticle: 'Citește articolul',
    backToList: 'Înapoi la noutăți',
    publishedOn: 'Publicat pe',
    contentLanguageNote: 'Articol disponibil în limba română.',
    emptyState: 'Nu există încă noutăți publicate.',
  },
  en: {
    eyebrow: 'News',
    title: 'News and announcements',
    subtitle:
      'Active funding sessions, new equipment in the catalog, and Agro Salso announcements.',
    breadcrumbLabel: 'News',
    readArticle: 'Read the article',
    backToList: 'Back to news',
    publishedOn: 'Published on',
    contentLanguageNote: 'This article is available in Romanian.',
    emptyState: 'No news published yet.',
  },
  hu: {
    eyebrow: 'Hírek',
    title: 'Hírek és közlemények',
    subtitle:
      'Aktív finanszírozási szakaszok, új gépek a katalógusban és Agro Salso közlemények.',
    breadcrumbLabel: 'Hírek',
    readArticle: 'A cikk elolvasása',
    backToList: 'Vissza a hírekhez',
    publishedOn: 'Közzétéve',
    contentLanguageNote: 'A cikk román nyelven olvasható.',
    emptyState: 'Még nincs közzétett hír.',
  },
  it: {
    eyebrow: 'Novità',
    title: 'Novità e comunicati',
    subtitle:
      'Sessioni di finanziamento attive, nuove macchine in catalogo e comunicati Agro Salso.',
    breadcrumbLabel: 'Novità',
    readArticle: "Leggi l'articolo",
    backToList: 'Torna alle novità',
    publishedOn: 'Pubblicato il',
    contentLanguageNote: 'Articolo disponibile in lingua romena.',
    emptyState: 'Nessuna novità pubblicata ancora.',
  },
  de: {
    eyebrow: 'Neuigkeiten',
    title: 'Neuigkeiten und Ankündigungen',
    subtitle:
      'Aktive Förderrunden, neue Maschinen im Katalog und Ankündigungen von Agro Salso.',
    breadcrumbLabel: 'Neuigkeiten',
    readArticle: 'Artikel lesen',
    backToList: 'Zurück zu den Neuigkeiten',
    publishedOn: 'Veröffentlicht am',
    contentLanguageNote: 'Dieser Artikel ist auf Rumänisch verfügbar.',
    emptyState: 'Noch keine Neuigkeiten veröffentlicht.',
  },
  es: {
    eyebrow: 'Noticias',
    title: 'Noticias y anuncios',
    subtitle:
      'Sesiones de financiación activas, maquinaria nueva en el catálogo y anuncios de Agro Salso.',
    breadcrumbLabel: 'Noticias',
    readArticle: 'Lee el artículo',
    backToList: 'Volver a noticias',
    publishedOn: 'Publicado el',
    contentLanguageNote: 'Este artículo está disponible en rumano.',
    emptyState: 'Todavía no hay noticias publicadas.',
  },
};

export const noutatiLocaleMap: Record<Language, string> = {
  ro: 'ro-RO',
  en: 'en-GB',
  hu: 'hu-HU',
  it: 'it-IT',
  de: 'de-DE',
  es: 'es-ES',
};
