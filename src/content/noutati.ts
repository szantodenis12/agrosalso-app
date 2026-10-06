// Sursă de date pentru secțiunea /noutati.
// O intrare nouă = un obiect nou în NOUTATI (cel mai recent primul).
// Slug-ul devine URL: https://agrosalso.ro/noutati/{slug}
//
// Conținutul articolelor e în limba română și rămâne așa în toate limbile
// site-ului (sunt texte de natură legală / despre finanțare AFIR — nu se
// traduc și nu se inventează fapte). Doar interfața paginii (titluri de
// secțiune, butoane, date) e localizată — vezi components/noutati/dictionary.ts.

export interface NoutatiArticle {
  slug: string;
  title: string;
  /** Format ISO (YYYY-MM-DD), folosit pentru schema Article, sortare și afișare */
  date: string;
  /** Afișat în listă și ca meta description */
  excerpt: string;
  /** Paragrafele articolului, randate server-side, în ordine */
  body: string[];
  cta?: {
    text: string;
    href: string;
  };
}

export const NOUTATI: NoutatiArticle[] = [
  {
    slug: 'dr-14-afir-2026',
    title:
      'DR 14 AFIR 2026: până la 50.000 € pentru ferme mici, depuneri deschise până pe 31 octombrie',
    date: '2026-10-06',
    excerpt:
      'Sesiunea de depunere pentru intervenția DR 14 (Investiții în fermele de dimensiuni mici) e deschisă până pe 31 octombrie 2026, ora 16:00. Sprijin nerambursabil de până la 50.000 de euro pe proiect.',
    body: [
      'DR 14 „Investiții în fermele de dimensiuni mici" finanțează, printre altele, achiziția de utilaje și echipamente agricole noi. Sprijinul e nerambursabil, de până la 50.000 de euro pe proiect, și acoperă maximum 85% din cheltuielile eligibile.',
      'Sesiunea oficială de depunere a început pe 1 septembrie 2026 și se închide pe 31 octombrie 2026, ora 16:00. Cererile se depun online, pe afir.ro.',
      'Sesiunea are două etape, cu praguri de calitate diferite: 80 de puncte pentru proiectele depuse în septembrie și 40 de puncte pentru cele depuse între 1 și 31 octombrie. Până pe 31 octombrie pot intra deci și proiectele cu punctaj mai mic.',
      'Dacă pregătești un proiect DR 14, îți pregătim oferta de utilaje conformă cerințelor AFIR în maximum 24 de ore. Te ajutăm și să alegi echipamentele potrivite pentru fermă: tipul solului, cultura, suprafața lucrată și tractorul cu care vor lucra.',
    ],
    cta: {
      text: 'Cere ofertă conformă AFIR',
      href: 'https://wa.me/40761927076',
    },
  },
];
