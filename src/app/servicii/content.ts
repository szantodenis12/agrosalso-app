// Conținut local pentru /servicii, pe cele 6 limbi ale site-ului.
// RO = text aprobat din pachetul SEO (content/despre/despre.ts → DESPRE.servicii),
// identic cu secțiunea „Ce oferim fermierilor” de pe /despre.
// Celelalte limbi sunt traduceri fidele ale acelorași texte.

export interface ServiciuItem {
  title: string;
  text: string;
}

export interface ServiciiContent {
  label: string;
  heroTitle: string;
  heroSub: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  services: ServiciuItem[];
  ctaWhatsapp: string;
  ctaProducts: string;
}

export const content: Record<'ro' | 'en' | 'hu' | 'it' | 'de' | 'es', ServiciiContent> = {
  ro: {
    label: 'Servicii',
    heroTitle: 'Ce oferim fermierilor',
    heroSub: 'Agro Salso: utilaje potrivite pentru munca din fermă.',
    breadcrumbHome: 'Acasă',
    breadcrumbCurrent: 'Servicii',
    services: [
      {
        title: 'Consultanță tehnică',
        text: 'Te ajutăm să alegi utilajul potrivit în funcție de suprafața lucrată, tipul solului, cultură și tractor.',
      },
      {
        title: 'Utilaje agricole',
        text: 'Oferim utilaje purtate și tractate pentru pregătirea solului, semănat și întreținerea culturilor.',
      },
      {
        title: 'Piese de schimb',
        text: 'Ținem pe stoc piese de schimb pentru utilajele din portofoliu și oferim suport pentru identificarea componentelor potrivite.',
      },
      {
        title: 'Livrare în toată România',
        text: 'Organizăm transportul utilajelor către ferme din întreaga țară.',
      },
      {
        title: 'Oferte pentru proiecte AFIR',
        text: 'Pregătim oferte conforme cerințelor AFIR, în maximum 24 de ore, și oferim sprijin în alegerea echipamentelor potrivite pentru proiect.',
      },
      {
        title: 'Soluții de finanțare',
        text: 'Punem la dispoziție variante adaptate activității fermei, de la rate lunare și leasing până la rate sezoniere. Analizăm împreună opțiunile disponibile și alegem varianta potrivită investiției.',
      },
    ],
    ctaWhatsapp: 'Dă-ne un semn pe WhatsApp',
    ctaProducts: 'Vezi utilajele',
  },
  en: {
    label: 'Services',
    heroTitle: 'What we offer farmers',
    heroSub: 'Agro Salso: the right equipment for the work on your farm.',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Services',
    services: [
      {
        title: 'Technical consultancy',
        text: 'We help you choose the right equipment based on the area worked, soil type, crop and tractor.',
      },
      {
        title: 'Agricultural equipment',
        text: 'We offer mounted and towed equipment for soil preparation, sowing and crop maintenance.',
      },
      {
        title: 'Spare parts',
        text: 'We keep spare parts in stock for the equipment in our range and help you identify the right components.',
      },
      {
        title: 'Delivery across Romania',
        text: 'We arrange transport of equipment to farms throughout the country.',
      },
      {
        title: 'Offers for AFIR projects',
        text: 'We prepare offers that meet AFIR requirements within a maximum of 24 hours, and help you choose the right equipment for your project.',
      },
      {
        title: 'Financing solutions',
        text: "We offer options adapted to your farm's activity, from monthly instalments and leasing to seasonal payments. We go through the available options together and choose the one that fits your investment.",
      },
    ],
    ctaWhatsapp: 'Message us on WhatsApp',
    ctaProducts: 'See the equipment',
  },
  hu: {
    label: 'Szolgáltatások',
    heroTitle: 'Amit a gazdáknak kínálunk',
    heroSub: 'Agro Salso: a gazdaságban végzett munkához illő gépek.',
    breadcrumbHome: 'Főoldal',
    breadcrumbCurrent: 'Szolgáltatások',
    services: [
      {
        title: 'Műszaki tanácsadás',
        text: 'Segítünk kiválasztani a megfelelő gépet a megművelt terület, a talaj típusa, a növénykultúra és a traktor alapján.',
      },
      {
        title: 'Mezőgazdasági gépek',
        text: 'Függesztett és vontatott gépeket kínálunk talajelőkészítéshez, vetéshez és a növényállomány ápolásához.',
      },
      {
        title: 'Alkatrészek',
        text: 'Raktáron tartjuk a kínálatunkban szereplő gépek alkatrészeit, és segítünk a megfelelő alkatrészek azonosításában.',
      },
      {
        title: 'Szállítás egész Romániában',
        text: 'Megszervezzük a gépek szállítását az ország bármely gazdaságába.',
      },
      {
        title: 'AFIR pályázati ajánlatok',
        text: 'Az AFIR követelményeinek megfelelő ajánlatokat készítünk legfeljebb 24 órán belül, és segítünk a projekthez illő gépek kiválasztásában.',
      },
      {
        title: 'Finanszírozási megoldások',
        text: 'A gazdaság tevékenységéhez igazodó megoldásokat kínálunk, a havi részletektől és a lízingtől a szezonális fizetésig. Együtt tekintjük át a lehetőségeket, és a befektetéshez illő megoldást választjuk.',
      },
    ],
    ctaWhatsapp: 'Írj nekünk WhatsApp-on',
    ctaProducts: 'Nézd meg a gépeket',
  },
  it: {
    label: 'Servizi',
    heroTitle: 'Cosa offriamo agli agricoltori',
    heroSub: "Agro Salso: le macchine giuste per il lavoro della tua azienda agricola.",
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Servizi',
    services: [
      {
        title: 'Consulenza tecnica',
        text: 'Ti aiutiamo a scegliere la macchina giusta in base alla superficie lavorata, al tipo di terreno, alla coltura e al trattore.',
      },
      {
        title: 'Macchine agricole',
        text: 'Offriamo macchine portate e trainate per la preparazione del terreno, la semina e la cura delle colture.',
      },
      {
        title: 'Ricambi',
        text: 'Teniamo in stock i ricambi per le macchine della nostra gamma e aiutiamo a identificare i componenti giusti.',
      },
      {
        title: 'Consegna in tutta la Romania',
        text: 'Organizziamo il trasporto delle macchine verso le aziende agricole in tutto il Paese.',
      },
      {
        title: 'Offerte per progetti AFIR',
        text: 'Prepariamo offerte conformi ai requisiti AFIR entro un massimo di 24 ore e aiutiamo a scegliere le attrezzature giuste per il progetto.',
      },
      {
        title: 'Soluzioni di finanziamento',
        text: "Mettiamo a disposizione soluzioni adatte all'attività dell'azienda agricola, dalle rate mensili al leasing fino alle rate stagionali. Analizziamo insieme le opzioni disponibili e scegliamo quella più adatta all'investimento.",
      },
    ],
    ctaWhatsapp: 'Scrivici su WhatsApp',
    ctaProducts: 'Vedi le macchine',
  },
  de: {
    label: 'Dienstleistungen',
    heroTitle: 'Was wir Landwirten bieten',
    heroSub: 'Agro Salso: die passenden Maschinen für die Arbeit auf Ihrem Hof.',
    breadcrumbHome: 'Startseite',
    breadcrumbCurrent: 'Dienstleistungen',
    services: [
      {
        title: 'Technische Beratung',
        text: 'Wir helfen Ihnen, die richtige Maschine anhand der bearbeiteten Fläche, der Bodenart, der Kultur und des Traktors auszuwählen.',
      },
      {
        title: 'Landmaschinen',
        text: 'Wir bieten angebaute und gezogene Maschinen für die Bodenbearbeitung, Aussaat und Pflege der Kulturen.',
      },
      {
        title: 'Ersatzteile',
        text: 'Wir halten Ersatzteile für die Maschinen unseres Sortiments auf Lager und helfen bei der Identifizierung der passenden Komponenten.',
      },
      {
        title: 'Lieferung in ganz Rumänien',
        text: 'Wir organisieren den Transport der Maschinen zu Höfen im ganzen Land.',
      },
      {
        title: 'Angebote für AFIR-Projekte',
        text: 'Wir erstellen Angebote, die den AFIR-Anforderungen entsprechen, innerhalb von maximal 24 Stunden, und unterstützen bei der Auswahl der passenden Ausrüstung für das Projekt.',
      },
      {
        title: 'Finanzierungslösungen',
        text: 'Wir bieten Lösungen, die an die Tätigkeit Ihres Hofs angepasst sind, von monatlichen Raten über Leasing bis zu saisonalen Zahlungen. Wir prüfen gemeinsam die verfügbaren Optionen und wählen die passende Variante für Ihre Investition.',
      },
    ],
    ctaWhatsapp: 'Schreiben Sie uns auf WhatsApp',
    ctaProducts: 'Maschinen ansehen',
  },
  es: {
    label: 'Servicios',
    heroTitle: 'Lo que ofrecemos a los agricultores',
    heroSub: 'Agro Salso: la maquinaria adecuada para el trabajo de tu finca.',
    breadcrumbHome: 'Inicio',
    breadcrumbCurrent: 'Servicios',
    services: [
      {
        title: 'Asesoría técnica',
        text: 'Te ayudamos a elegir la máquina adecuada según la superficie trabajada, el tipo de suelo, el cultivo y el tractor.',
      },
      {
        title: 'Maquinaria agrícola',
        text: 'Ofrecemos maquinaria suspendida y arrastrada para la preparación del suelo, la siembra y el mantenimiento de los cultivos.',
      },
      {
        title: 'Repuestos',
        text: 'Mantenemos en stock repuestos para la maquinaria de nuestra gama y ayudamos a identificar los componentes adecuados.',
      },
      {
        title: 'Entrega en toda Rumanía',
        text: 'Organizamos el transporte de la maquinaria a fincas de todo el país.',
      },
      {
        title: 'Ofertas para proyectos AFIR',
        text: 'Preparamos ofertas conformes a los requisitos de AFIR en un máximo de 24 horas y ayudamos a elegir el equipo adecuado para el proyecto.',
      },
      {
        title: 'Soluciones de financiación',
        text: 'Ponemos a disposición opciones adaptadas a la actividad de tu finca, desde cuotas mensuales y leasing hasta pagos estacionales. Analizamos juntos las opciones disponibles y elegimos la que mejor se adapta a tu inversión.',
      },
    ],
    ctaWhatsapp: 'Escríbenos por WhatsApp',
    ctaProducts: 'Ver la maquinaria',
  },
};
