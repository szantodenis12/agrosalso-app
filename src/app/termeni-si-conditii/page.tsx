'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { FileText, Shield, Info, Scale, Gavel, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndConditionsPage() {
  const sections = [
    {
      icon: <Info className="text-accent-lime" size={24} />,
      title: "1. Informații despre Operator",
      content: "Site-ul agrosalso.ro este proprietatea și este administrat de SC AGRO SALSO SRL, cu sediul în Aleea Petre Paulescu Bl. Q6 Et. 4 Ap. U Cod 415500, Salonta, Bihor, înmatriculată la Registrul Comerțului sub nr. J05/1081/2012, CUI 30425879.\n\nContact: contact@agrosalso.ro | +40 742 936 959."
    },
    {
      icon: <Shield className="text-accent-lime" size={24} />,
      title: "2. Acceptarea Termenilor",
      content: "Accesarea, navigarea și utilizarea acestui Site (inclusiv completarea formularelor de ofertă) implică acceptarea deplină a acestor Termeni și Condiții. Dacă nu sunteți de acord cu aceștia, vă rugăm să încetați utilizarea Site-ului."
    },
    {
      icon: <AlertCircle className="text-accent-lime" size={24} />,
      title: "3. Natura Informațiilor de pe Site",
      content: "• Caracter informativ: Toate informațiile afișate pe Site (descrieri tehnice, fotografii, specificații utilaje) au caracter strict informativ și nu reprezintă o ofertă fermă de a contracta în sensul Codului Civil.\n• Acuratețea datelor: Depunem eforturi constante pentru ca specificațiile utilajelor să fie corecte. Totuși, producătorii pot aduce modificări tehnice fără preaviz. Detaliile tehnice finale vor fi confirmate exclusiv prin oferta comercială transmisă direct de echipa noastră.\n• Prețurile: Acolo unde sunt afișate, prețurile sunt orientative. Prețul final, condițiile de plată și disponibilitatea stocului vor fi stabilite prin oferta oficială și contractul de vânzare-cumpărare ulterior."
    },
    {
      icon: <FileText className="text-accent-lime" size={24} />,
      title: "4. Procedura de Solicitare Ofertă",
      content: "• Formularul de contact: Prin completarea formularului de ofertă, Utilizatorul nu efectuează o achiziție, ci își exprimă intenția de a primi informații personalizate.\n• Validarea datelor: Utilizatorul se obligă să furnizeze date de contact reale și corecte. În cazul în care datele sunt incomplete (ex. telefon greșit), Societatea nu va putea onora solicitarea de ofertă."
    },
    {
      icon: <Scale className="text-accent-lime" size={24} />,
      title: "5. Drepturi de Proprietate Intelectuală",
      content: "Întregul conținut al Site-ului (texte, logouri, imagini de prezentare ale utilajelor, design) este proprietatea Societății sau a partenerilor săi (producători). Este interzisă copierea, reproducerea sau utilizarea acestora în scopuri comerciale fără acordul nostru prealabil, scris."
    },
    {
      icon: <HelpCircle className="text-accent-lime" size={24} />,
      title: "6. Garanții și Service",
      content: "• Garanția utilajelor: Toate utilajele agricole comercializate beneficiază de garanția producătorului, conform legislației române și politicilor specifice de service. Detaliile privind perioadele de garanție și centrele de service autorizate vor fi incluse în contractul final.\n• Piese de schimb: Ne străduim să oferim consultanță pentru piese de schimb, însă disponibilitatea acestora depinde de stocurile producătorilor externi."
    },
    {
      icon: <AlertCircle className="text-accent-lime" size={24} />,
      title: "7. Limitarea Răspunderii",
      content: "Societatea nu poate fi considerată responsabilă pentru:\n\n• Daune cauzate de utilizarea necorespunzătoare a utilajelor achiziționate;\n• Erori tehnice de afișare pe site care pot induce în eroare (ex: prețuri evident eronate);\n• Întârzieri în livrare cauzate de producători sau transportatori terți (agabaritici);\n• Întreruperi temporare ale funcționării site-ului din motive tehnice."
    },
    {
      icon: <Shield className="text-accent-lime" size={24} />,
      title: "8. Prelucrarea Datelor cu Caracter Personal",
      content: "Utilizarea Site-ului implică prelucrarea datelor dumneavoastră. Detaliile despre ce date colectăm, cum le protejăm și cât timp le stocăm se regăsesc în Politica de Confidențialitate, care face parte integrantă din prezentul document."
    },
    {
      icon: <Gavel className="text-accent-lime" size={24} />,
      title: "9. Jurisdicție și Litigii",
      content: "Orice litigiu apărut în legătură cu utilizarea acestui Site va fi soluționat pe cale amiabilă. În cazul în care acest lucru nu este posibil, competența revine instanțelor judecătorești de la sediul Societății (Bihor, România)."
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
                Termeni și <span className="text-accent-lime">Condiții</span>
              </h1>
              <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">
                Ultima actualizare: 06/03/2026
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-neutral-100">
              <p className="text-neutral-600 font-medium leading-relaxed mb-12">
                Prezentul document stabilește regulile de utilizare a site-ului agrosalso.ro și condițiile în care SC AGRO SALSO SRL furnizează informații și preia solicitări de ofertă pentru produsele și utilajele agricole comercializate.
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

              <div className="mt-16 pt-8 border-t border-neutral-50 text-center space-y-4">
                <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
                  Pentru orice clarificări legate de utilizarea site-ului:
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <a href="mailto:contact@agrosalso.ro" className="text-neutral-900 font-headline font-extrabold text-lg md:text-xl hover:text-accent-lime transition-colors">
                    contact@agrosalso.ro
                  </a>
                  <a href="tel:+40742936959" className="text-neutral-900 font-headline font-extrabold text-lg md:text-xl hover:text-accent-lime transition-colors">
                    +40 742 936 959
                  </a>
                </div>
                <div className="pt-4">
                  <Link href="/politica-de-confidentialitate" className="text-accent-lime text-xs font-extrabold uppercase tracking-widest hover:underline">
                    Vezi Politica de Confidențialitate
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
