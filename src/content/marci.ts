// Destinație: sursa de date pentru paginile de marcă /marci/[marca].
// Textele sunt FINALE. Atenție: formularea „dealer autorizat" se folosește DOAR
// pentru Dexwal (pagina /dealer-autorizat-dexwal, deja live). Pentru mărcile de
// aici formularea e „utilaje {marca} noi, la Agro Salso" — fără alte pretenții
// de statut și fără garanții (3 ani garanție e confirmată doar la Dexwal).
// Mega Metal, BT, Letak, Turan, Renal primesc pagini când confirmăm gama — nu
// inventați conținut pentru ele.

export interface Marca {
  slug: string
  nume: string
  title: string
  metaDescription: string
  paragrafe: string[]
  produseSlugs: string[]
}

export const MARCI: Marca[] = [
  {
    slug: 'helagro',
    nume: 'Helagro',
    title: 'Utilaje Helagro în România — Agro Salso',
    metaDescription:
      'Utilaje Helagro noi, cu preț afișat: gruberele KBOH, KBW și KBO și scarificatorul Cizel PD. Piese de schimb și livrare în toată țara.',
    paragrafe: [
      'Agro Salso vinde utilaje Helagro noi, cu prețul afișat pe site: gruberele KBOH, KBW și KBO și scarificatorul Cizel PD. Pentru utilajele din gamă asigurăm piese de schimb și livrare în toată România.',
      'Specificațiile complete și prețurile sunt pe paginile produselor. Pentru o recomandare pe ferma ta, sună la 0742 936 959 sau scrie pe WhatsApp la 0761 927 076.',
    ],
    produseSlugs: ['gruber-kboh-helagro', 'gruber-kbw-helagro', 'gruber-kbo-helagro', 'scarificator-cizel-pd-helagro'],
  },
  {
    slug: 'strumyk',
    nume: 'Strumyk',
    title: 'Utilaje Strumyk în România — Agro Salso',
    metaDescription:
      'Utilaje Strumyk noi, cu preț afișat: gruberele SPRING și AGILE, scarificatoarele Piorun și Piorun Junior, combinatorul hidraulic Nietoperek și erbicidatorul purtat Triplo.',
    paragrafe: [
      'Agro Salso vinde utilaje Strumyk noi, cu prețul afișat pe site: gruberele din gamele SPRING și AGILE, scarificatoarele Piorun și Piorun Junior, combinatorul hidraulic Nietoperek și erbicidatorul purtat Triplo.',
      'Pentru utilajele din gamă asigurăm piese de schimb și livrare în toată România. Specificațiile și prețurile sunt pe paginile produselor.',
    ],
    produseSlugs: [
      'gruber-spring',
      'gruber-agile',
      'sacrificator-piorun',
      'scarifactor-piorun-junior',
      'combinator-hidraulic-nietoperek',
      'erbicidator-purtat-triplo',
    ],
  },
  {
    slug: 'tolmet',
    nume: 'Tolmet',
    title: 'Utilaje Tolmet în România — Agro Salso',
    metaDescription:
      'Erbicidatoare Tolmet noi, cu preț afișat, printre care modelul purtat Xsara. Piese de schimb și livrare în toată țara.',
    paragrafe: [
      'Agro Salso vinde erbicidatoare Tolmet noi, cu prețul afișat pe site, printre care modelul purtat Xsara. Pentru utilajele din gamă asigurăm piese de schimb și livrare în toată România.',
      'Specificațiile și prețurile sunt pe paginile produselor. Pentru o recomandare pe ferma ta, sună la 0742 936 959 sau scrie pe WhatsApp la 0761 927 076.',
    ],
    produseSlugs: ['erbicidator-purtat-xsara-tolmet'],
  },
  {
    slug: 'bomet',
    nume: 'Bomet',
    title: 'Utilaje Bomet în România — Agro Salso',
    metaDescription:
      'Utilaje Bomet noi, cu preț afișat: semănătoarea pentru păioase S004 și freza rotativă. Piese de schimb și livrare în toată țara.',
    paragrafe: [
      'Agro Salso vinde utilaje Bomet noi, cu prețul afișat pe site: semănătoarea pentru păioase S004 și freza rotativă. Pentru utilajele din gamă asigurăm piese de schimb și livrare în toată România.',
      'Specificațiile și prețurile sunt pe paginile produselor. Pentru o recomandare pe ferma ta, sună la 0742 936 959 sau scrie pe WhatsApp la 0761 927 076.',
    ],
    produseSlugs: ['bomet-semntoare-pioase-s004', 'freza-rotativa-bomet'],
  },
]
