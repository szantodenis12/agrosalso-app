'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Clock, Eye, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <UserCheck className="text-accent-lime" size={24} />,
      title: "1. Cine este operatorul datelor?",
      content: "Operatorul de date este SC AGROSALSO SRL, cu sediul în Aleea Petre Paulescu Bl. Q6 Et. 4 Ap. U Cod 415500, Salonta, Romania, CUI 30425879, e-mail: contact@agrosalso.ro. Ne angajăm să protejăm datele dumneavoastră cu cea mai mare responsabilitate."
    },
    {
      icon: <Eye className="text-accent-lime" size={24} />,
      title: "2. Ce date colectăm și de ce?",
      content: "Colectăm doar datele necesare pentru a vă oferi soluții agricole performante:\n\n• Identificare: Nume, prenume, denumirea fermei/societății.\n• Contact: Număr de telefon, adresă de e-mail (esențiale pentru trimiterea ofertelor și consultanță tehnică).\n• Date de Localizare: Județ/Localitate (pentru a calcula costurile de transport ale utilajelor sau pentru vizite în teren).\n• Date Tehnice: Detalii despre suprafața lucrată sau tipul de cultură (dacă sunt furnizate voluntar în formular pentru a adapta oferta de utilaje)."
    },
    {
      icon: <ShieldCheck className="text-accent-lime" size={24} />,
      title: "3. Temeiul Legal al Prelucrării",
      content: "• Executarea unui contract / Demersuri pre-contractuale: Prelucrăm datele pentru a vă trimite oferta solicitată.\n• Obligație legală: Păstrăm datele de facturare conform legislației fiscale.\n• Interes legitim: Pentru securitatea site-ului și îmbunătățirea serviciilor noastre.\n• Consimțământ: Pentru trimiterea de newslettere sau oferte promoționale (doar dacă ați bifat căsuța corespunzătoare)."
    },
    {
      icon: <Clock className="text-accent-lime" size={24} />,
      title: "4. Politica de Stocare a Datelor",
      content: "Nu stocăm datele pe termen nelimitat. Perioadele noastre de retenție sunt corelate cu ciclul de viață al utilajelor agricole:\n\n• Solicitări de ofertă (fără finalizare achiziție): Stocăm datele pentru 24 de luni. Achiziția de utilaje depinde adesea de ferestrele de finanțare, iar păstrarea istoricului ne permite să vă re-ofertăm când se deschid noi linii de creditare.\n• Clienți (Achiziție finalizată): Datele din contracte se păstrează 10 ani (termen legal contabil).\n• Garanții și Siguranță: Datele sunt păstrate pe toată durata de viață a utilajului (estimat la 10 ani) pentru notificări de siguranță sau actualizări critice.\n• Marketing: Până la retragerea consimțământului, dar nu mai mult de 3 ani de la ultima interacțiune."
    },
    {
      icon: <Lock className="text-accent-lime" size={24} />,
      title: "5. Cui transmitem datele dumneavoastră?",
      content: "Nu vindem datele dumneavoastră. Acestea pot fi accesate doar de parteneri strict necesari:\n\n• Producătorii de utilaje (pentru înregistrarea garanției);\n• Firme de curierat/transport agabaritic (pentru livrare);\n• Instituții financiare/Leasing (dacă solicitați sprijin pentru finanțare);\n• Furnizori de servicii IT (hosting, mentenanță site)."
    },
    {
      icon: <Mail className="text-accent-lime" size={24} />,
      title: "6. Drepturile dumneavoastră (GDPR)",
      content: "Conform legii, aveți următoarele drepturi pe care le puteți exercita la contact@agrosalso.ro:\n\n• Dreptul de acces: Să aflați ce date avem despre dumneavoastră.\n• Dreptul la rectificare: Să corectați datele greșite.\n• Dreptul la ștergere: Să cereți ștergerea datelor (dacă nu avem o obligație legală contrară).\n• Dreptul la restricționare: Să ne cereți să limităm prelucrarea fără a șterge datele.\n• Dreptul la portabilitate: Să primiți datele într-un format structurat.\n• Dreptul de opoziție: Să vă opuneți prelucrării în scop de marketing."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="bg-neutral-50 pt-32 pb-24 px-6 md:px-14">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-neutral-900 tracking-tighter uppercase leading-none">
                Politica de <span className="text-accent-lime">Confidențialitate</span>
              </h1>
              <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                Ultima actualizare: 06/03/2026
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100">
              <p className="text-neutral-600 font-medium leading-relaxed mb-12">
                Bun venit la AgroSalso. Protejarea datelor fermierilor și partenerilor noștri este prioritatea noastră. Această Politică explică transparent ce date colectăm, de ce le păstrăm și care sunt drepturile dumneavoastră în contextul utilizării serviciilor noastre agricole.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shrink-0">
                        {section.icon}
                      </div>
                      <h2 className="font-headline font-extrabold text-xl text-neutral-900">{section.title}</h2>
                    </div>
                    <div className="pl-16 text-neutral-500 font-medium leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-neutral-50 text-center">
                <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
                  Pentru orice întrebări legate de datele dumneavoastră:
                </p>
                <a href="mailto:contact@agrosalso.ro" className="text-neutral-900 font-headline font-extrabold text-lg md:text-xl hover:text-accent-lime transition-colors">
                  contact@agrosalso.ro
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
