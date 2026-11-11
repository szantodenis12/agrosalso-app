import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { landingMetadata } from '@/lib/seo/metadata';
import { CATEGORII } from '@/content/categorii';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import {
  LandingPage, LandingHero, LandingBreadcrumb, LandingBody, LandingProse, LandingLinkChips,
} from '@/components/landing/LandingShell';

export const revalidate = 300;

export const metadata = landingMetadata({
  title: 'Utilaje agricole în Bihor — Agro Salso',
  description:
    'Dealer de utilaje agricole în Mădăras, județul Bihor, din 2012. Terradiscuri, grubere, combinatoare, semănători cu preț afișat. Program Luni–Vineri 08:00–17:00.',
  path: '/utilaje-agricole-bihor',
});

const PARAGRAFE = [
  'Agro Salso e dealer de utilaje agricole din 2012, cu sediul în Mădăras, județul Bihor, pe DN79. Aici vezi utilajele pe viu înainte să cumperi: terradiscuri, grubere, combinatoare, scarificatoare, semănători, erbicidatoare și distribuitoare de îngrășăminte, toate noi, cu prețul afișat pe site.',
  'Lucrăm cu fermieri din Bihor și din toată țara: din zona Salonta, Oradea, Beiuș sau Marghita poți veni direct la sediu, iar pentru restul țării organizăm transportul până la fermă.',
  'Ținem pe stoc piese de schimb pentru utilajele din portofoliu, pregătim oferte conforme cerințelor AFIR în maximum 24 de ore și găsim împreună varianta de finanțare potrivită investiției.',
];

export default function BihorPage() {
  return (
    <LandingPage>
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Utilaje agricole în Bihor', url: '/utilaje-agricole-bihor' },
        ]}
      />
      <LandingHero label="Mădăras, Bihor" title="Utilaje agricole în Bihor" />
      <LandingBreadcrumb items={[{ nume: 'Acasă', url: '/' }, { nume: 'Utilaje agricole în Bihor' }]} />

      <LandingBody>
        <LandingProse paragraphs={PARAGRAFE} />

        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-neutral-100 mt-12 max-w-3xl space-y-2">
          <h2 className="font-headline font-bold text-xl text-neutral-900 mb-4">Unde ne găsești</h2>
          <p className="text-neutral-600 font-body">DN79, Mădăras 417330, județul Bihor</p>
          <p className="text-neutral-600 font-body">Program: Luni–Vineri, 08:00–17:00</p>
          <p className="text-neutral-600 font-body">
            Telefon: <a href="tel:+40742936959" className="font-bold text-neutral-900">0742 936 959</a>
            {' · '}WhatsApp: <a href="https://wa.me/40761927076" className="font-bold text-neutral-900">0761 927 076</a>
          </p>
          <p className="text-neutral-600 font-body">
            Email: <a href="mailto:contact@agrosalso.ro" className="font-bold text-neutral-900">contact@agrosalso.ro</a>
          </p>
          {/* TODO: embed Google Maps cu locatia firmei. Pachetul nu contine un URL de embed; se ia din fisa
              Google Business (nu inventam coordonate). */}
        </div>

        <LandingLinkChips
          title="Categorii de utilaje"
          links={CATEGORII.map((c) => ({ href: `/utilaje/${c.slug}`, label: c.nume }))}
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-14 md:mt-20">
          <Link
            href="/produse"
            className="bg-accent-lime hover:bg-accent-lime/90 text-black rounded-full p-1.5 flex items-center justify-between gap-10 w-fit shadow-xl shadow-accent-lime/20 transition-all group/btn"
          >
            <span className="pl-6 text-sm font-bold uppercase tracking-widest">Vezi catalogul cu prețuri</span>
            <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
              <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
            </span>
          </Link>
          <a
            href="https://wa.me/40761927076"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full h-[52px] px-8 flex items-center text-sm font-bold uppercase tracking-widest transition-colors w-fit"
          >
            Dă-ne un semn pe WhatsApp
          </a>
        </div>
      </LandingBody>
    </LandingPage>
  );
}
