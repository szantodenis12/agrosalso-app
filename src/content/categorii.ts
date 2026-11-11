// Destinație: sursa de date pentru paginile de categorie /utilaje/[categorie].
// Textele sunt FINALE — nu se reformulează, nu se completează cu specificații.
// `produseSlugs` = maparea categoriei pe produsele live la 06.10.2026; dacă în
// baza de date există un câmp de categorie, folosiți-l pe acela ca sursă și
// păstrați lista de aici doar ca referință de verificare.

export interface CategorieFaq {
  intrebare: string
  raspuns: string
}

export interface Categorie {
  slug: string
  nume: string
  title: string
  metaDescription: string
  paragrafe: string[]
  faq: CategorieFaq[]
  produseSlugs: string[]
}

export const CATEGORII: Categorie[] = [
  {
    slug: 'terradiscuri',
    nume: 'Terradiscuri',
    title: 'Terradiscuri — prețuri și modele | Agro Salso',
    metaDescription:
      'Terradiscuri Dexwal noi, cu preț afișat: Mamut, Zuk, Tur și seria grea, cu cadru fix, tractată sau hidraulică. 3 ani garanție la utilajele Dexwal.',
    paragrafe: [
      'Terradiscul lucrează solul cu două rânduri de discuri și tăvălug spate: taie și amestecă resturile vegetale, sfărâmă bulgării și lasă terenul nivelat, într-o singură trecere. E utilajul de bază pentru dezmiriștit și pentru pregătirea patului germinativ pe terenuri cu multe resturi.',
      'La Agro Salso găsești terradiscuri Dexwal purtate și tractate, de la modelele compacte Mamut, Zuk și Tur până la seria grea, cu cadru fix, tractată sau cu pliere hidraulică. Prețul și specificațiile fiecărui model sunt pe pagina produsului, iar utilajele Dexwal vin cu 3 ani garanție.',
    ],
    faq: [
      {
        intrebare: 'Ce lățime de terradisc aleg?',
        raspuns:
          'Depinde de puterea tractorului și de suprafața lucrată. Specificațiile fiecărui model sunt pe pagina produsului, iar la 0742 936 959 îți spunem direct ce se potrivește cu tractorul tău.',
      },
      {
        intrebare: 'Terradisc sau grapă cu discuri?',
        raspuns:
          'Lucrează pe același principiu. Terradiscul are discurile pe suporți individuali și tăvălug spate, deci merge mai repede și lasă terenul gata nivelat. Pentru dezmiriștit și pat germinativ e alegerea standard.',
      },
    ],
    produseSlugs: [
      'terradisc-mamut',
      'terradisc-zuk',
      'terradisc-tur',
      'terradisc-greu-hidraulic',
      'terradisc-greu-tractat',
      'terradisc-greu-cadru-fix',
    ],
  },
  {
    slug: 'combinatoare',
    nume: 'Combinatoare',
    title: 'Combinatoare — prețuri și modele | Agro Salso',
    metaDescription:
      'Combinatoare Dexwal și Strumyk noi, cu preț afișat: K, TK, Zubr, Lion și Nietoperek hidraulic. Pregătirea patului germinativ într-o singură trecere.',
    paragrafe: [
      'Combinatorul pregătește patul germinativ: mărunțește, nivelează și tasează solul înainte de semănat, cu organe active pe mai multe rânduri și tăvălugi. Rezultatul e un strat uniform, în care sămânța intră la adâncime constantă.',
      'În catalog sunt combinatoarele Dexwal K, TK, Zubr și Lion, plus combinatorul hidraulic Nietoperek de la Strumyk. Prețul și lățimile de lucru sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Combinator sau terradisc pentru pregătirea solului?',
        raspuns:
          'Combinatorul finisează patul germinativ înainte de semănat. Terradiscul taie și amestecă resturi vegetale, de obicei într-o lucrare anterioară. Pe multe ferme lucrează amândouă, în etape diferite.',
      },
      {
        intrebare: 'Ce combinator se potrivește cu tractorul meu?',
        raspuns:
          'Lățimea de lucru se alege după puterea tractorului. Sună la 0742 936 959 sau scrie pe WhatsApp la 0761 927 076 și îți recomandăm modelul potrivit.',
      },
    ],
    produseSlugs: [
      'combinator-k',
      'combinator-tk',
      'combinator-zubr',
      'combinator-lion',
      'combinator-hidraulic-nietoperek',
    ],
  },
  {
    slug: 'grubere',
    nume: 'Grubere',
    title: 'Grubere — prețuri și modele | Agro Salso',
    metaDescription:
      'Grubere Dexwal, Helagro și Strumyk noi, cu preț afișat: Dzik, Grunt, KBO, KBOH, KBW, SPRING, AGILE. Lucrare fără întoarcerea brazdei.',
    paragrafe: [
      'Gruberul afânează solul în adâncime fără să întoarcă brazda: taie sub suprafață cu organe tip labă de gâscă sau daltă, rupe compactarea și lasă resturile vegetale la suprafață, ca protecție împotriva uscării. E lucrarea standard pentru dezmiriștit și pentru înlocuirea arăturii pe terenurile unde se practică lucrări minime.',
      'Gama acoperă gruberele Dexwal Dzik, Grunt (inclusiv varianta cu organe tip Lemken) și KBO, gruberele Helagro KBOH, KBW și KBO, plus gamele SPRING și AGILE de la Strumyk. Prețurile sunt afișate pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Gruber sau plug?',
        raspuns:
          'Gruberul lucrează fără întoarcerea brazdei: mai rapid, cu consum mai mic, și păstrează resturile vegetale la suprafață. Plugul rămâne soluția unde e nevoie de întoarcerea completă a solului.',
      },
      {
        intrebare: 'Ce gruber aleg pentru dezmiriștit?',
        raspuns:
          'Contează adâncimea de lucru dorită, tipul solului și puterea tractorului. Fiecare model are specificațiile pe pagina lui, iar la telefon îți spunem direct care se potrivește fermei tale.',
      },
    ],
    produseSlugs: [
      'gruber-dzik',
      'gruber-grunt',
      'gruber-grunt-organe-tip-lemken',
      'gruber-spring',
      'gruber-kbo',
      'gruber-agile',
      'gruber-kboh-helagro',
      'gruber-kbw-helagro',
      'gruber-kbo-helagro',
    ],
  },
  {
    slug: 'scarificatoare',
    nume: 'Scarificatoare',
    title: 'Scarificatoare — prețuri și modele | Agro Salso',
    metaDescription:
      'Scarificatoare noi, cu preț afișat: Raptor, Piorun, Piorun Junior, Cizel PD Helagro, cadru standard sau greu. Spargerea hardpanului în adâncime.',
    paragrafe: [
      'Scarificatorul sparge stratul compactat din adâncime (hardpanul) format de trecerile repetate și de lucrările la aceeași adâncime. Apa pătrunde din nou în sol, rădăcinile coboară, iar terenul își recapătă drenajul. E o lucrare care nu se vede la suprafață, dar se vede în recoltă.',
      'În catalog: scarificatoare cu cadru standard și cadru greu, modelul Raptor, Piorun și Piorun Junior de la Strumyk și Cizel PD de la Helagro. Specificațiile și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Când se face scarificarea?',
        raspuns:
          'De regulă după recoltare, pe sol uscat, când stratul compactat se sparge cel mai bine. Frecvența depinde de teren: acolo unde se circulă mult cu utilaje grele, compactarea revine mai repede.',
      },
      {
        intrebare: 'Ce putere de tractor cere un scarificator?',
        raspuns:
          'Scarificarea e o lucrare grea, iar necesarul depinde de adâncime, numărul de organe și sol. Verifică specificațiile modelului pe pagina produsului sau sună-ne la 0742 936 959.',
      },
    ],
    produseSlugs: [
      'scarificator',
      'scarificator-cadru-greu',
      'scarificator-raptor',
      'scarifactor-piorun-junior',
      'sacrificator-piorun',
      'scarificator-cizel-pd-helagro',
    ],
  },
  {
    slug: 'freze',
    nume: 'Freze de pământ',
    title: 'Freze de pământ — prețuri și modele | Agro Salso',
    metaDescription:
      'Freze de pământ noi, cu preț afișat: TF, TFL și freza rotativă Bomet. Mărunțire fină pentru legumicultură, sere și terenuri mici.',
    paragrafe: [
      'Freza mărunțește solul fin, într-o singură trecere, cu rotor acționat de la priza de putere. E utilajul potrivit pentru legumicultură, sere, solarii și terenuri mai mici, unde contează un pat germinativ foarte fin.',
      'În catalog sunt frezele TF și TFL și freza rotativă de la Bomet. Lățimile de lucru și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Freză sau combinator?',
        raspuns:
          'Freza mărunțește cel mai fin, dar lucrează mai încet și cere mai multă putere pe metru de lățime. Pentru suprafețe mari de câmp, combinatorul e mai eficient; pentru legume și terenuri mici, freza.',
      },
    ],
    produseSlugs: ['frez-tf', 'frez-tfl', 'freza-rotativa-bomet'],
  },
  {
    slug: 'tocatoare',
    nume: 'Tocătoare de resturi vegetale',
    title: 'Tocătoare de resturi vegetale — prețuri și modele | Agro Salso',
    metaDescription:
      'Tocătoare de resturi vegetale noi, cu preț afișat: UM, UML, UMLB cu braț și UMB profesional. Tocarea miriștii și întreținerea terenurilor.',
    paragrafe: [
      'Tocătorul mărunțește resturile vegetale rămase după recoltare și vegetația de pe terenurile necultivate: miriște, coceni, lăstari, iarbă. Resturile tocate se descompun mai repede și ușurează lucrarea următoare a solului.',
      'Gama include modelele UM, UML, UMLB cu braț lateral și UMB profesional. Specificațiile și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Ce tocător aleg pentru marginile de drum și canale?',
        raspuns:
          'Pentru margini, taluzuri și canale e gândit modelul cu braț (UMLB), care lucrează lateral față de tractor. Pentru câmp deschis, modelele standard UM și UML acoperă majoritatea situațiilor.',
      },
    ],
    produseSlugs: ['tocator-um', 'tocator-uml', 'tocator-umlb-cu-brat', 'tocator-umb-profesional'],
  },
  {
    slug: 'erbicidatoare',
    nume: 'Erbicidatoare',
    title: 'Erbicidatoare — prețuri și modele | Agro Salso',
    metaDescription:
      'Erbicidatoare purtate noi, cu preț afișat: Triplo Strumyk, Xsara Tolmet, Hektor și Klara. Stropit uniform, cu rampe pliabile.',
    paragrafe: [
      'Erbicidatorul aplică tratamentele pe culturi: erbicide, fungicide, insecticide sau fertilizare foliară. Contează capacitatea rezervorului, lățimea rampei și uniformitatea pulverizării.',
      'În catalog sunt erbicidatoarele purtate Triplo de la Strumyk, Xsara de la Tolmet, Hektor și Klara. Capacitățile și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Ce capacitate de rezervor îmi trebuie?',
        raspuns:
          'Depinde de suprafața tratată într-o zi și de distanța până la sursa de apă. Modelele din catalog acoperă de la ferme mici la suprafețe medii; detaliile sunt pe pagina fiecărui produs.',
      },
    ],
    produseSlugs: [
      'erbicidator-purtat-triplo',
      'erbicidator-purtat-hektor',
      'erbicidator-purtat-klara',
      'erbicidator-purtat-xsara-tolmet',
    ],
  },
  {
    slug: 'distribuitoare-ingrasaminte',
    nume: 'Distribuitoare de îngrășăminte',
    title: 'Distribuitoare de îngrășăminte — prețuri și modele | Agro Salso',
    metaDescription:
      'Distribuitoare de îngrășăminte noi, cu preț afișat: Tornado Duo, Tajfun, Funnel Dexwal, RG cu 1 sau 2 discuri, variante pentru livadă.',
    paragrafe: [
      'Distribuitorul împrăștie îngrășământul granulat uniform, pe lățimea de lucru setată. Pentru câmp se folosesc modelele cu 1 sau 2 discuri; pentru livezi există variante care aruncă îngrășământul pe rând, la baza pomilor.',
      'Gama acoperă distribuitoarele Tornado Duo, Tajfun, Funnel de la Dexwal, modelele RG cu 1 și 2 discuri, variantele pentru livadă și distribuitorul pentru porumb. Capacitățile și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Distribuitor cu 1 disc sau cu 2 discuri?',
        raspuns:
          'Cu 2 discuri acoperi lățimi mai mari la o trecere, deci mai puține treceri pe suprafețe mari. Cu 1 disc e varianta compactă, potrivită fermelor mici și lucrului în spații înguste sau livezi.',
      },
    ],
    produseSlugs: [
      'distribuitor-de-ingrasaminte-tornado-duo',
      'distribuitor-ngrminte-1-disc-rg',
      'distribuitor-ngrminte-2-discuri-rg',
      'distribuitor-tajfun-tj600-tj1200-1-disc-var-i-ngrminte',
      'distribuitor-tajfun-600s-1200s-1-disc-livad',
      'distribuitor-dexwal-funnel-l200l500-1-disc-tip-plnie',
      'distribuitor-funnel-l200sl500s-1-disc-livad',
      'distribuitor-ingrasaminte-porumb',
    ],
  },
  {
    slug: 'semanatori',
    nume: 'Semănători',
    title: 'Semănători — prețuri și modele | Agro Salso',
    metaDescription:
      'Semănători noi, cu preț afișat: Bomet S004 pentru păioase și Zefir. Semănat la adâncime constantă, cu normă reglabilă.',
    paragrafe: [
      'Semănătoarea pune sămânța la adâncime constantă și la norma setată, condiția de bază pentru o răsărire uniformă. Pentru cereale păioase se folosesc semănători cu brăzdare pe rânduri dese.',
      'În catalog sunt semănătoarea Bomet S004 pentru păioase și semănătoarea Zefir. Lățimile, numărul de rânduri și prețurile sunt pe paginile produselor.',
    ],
    faq: [
      {
        intrebare: 'Ce pregătire cere solul înainte de semănat?',
        raspuns:
          'Un pat germinativ uniform, de regulă după combinator sau terradisc. Cu cât patul e mai bine pregătit, cu atât răsărirea e mai uniformă, indiferent de semănătoare.',
      },
    ],
    produseSlugs: ['bomet-semntoare-pioase-s004', 'semntoare-zefir'],
  },
]
