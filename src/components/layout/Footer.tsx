
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-24 pb-12 px-6 md:px-14">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-8 h-8 bg-green-800 flex items-center justify-center rounded-sm">
                <span className="font-headline font-extrabold text-white">A</span>
              </div>
              <span className="font-headline font-extrabold text-xl tracking-tighter">AGROSALSO</span>
            </Link>
            <p className="text-neutral-500 mb-8 leading-relaxed max-w-xs font-body">
              Expertiză în utilaje agricole din 2005. Oferim soluții complete pentru fermierii români.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-neutral-900 transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-neutral-900 transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-neutral-900 transition-all">
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg uppercase tracking-wider mb-8">Link-uri utile</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/produse" className="text-neutral-500 hover:text-yellow-400 transition-colors">Catalog Produse</Link></li>
              <li><Link href="/promotii" className="text-neutral-500 hover:text-yellow-400 transition-colors">Promoții Active</Link></li>
              <li><Link href="/marci" className="text-neutral-500 hover:text-yellow-400 transition-colors">Branduri Partenere</Link></li>
              <li><Link href="/contact" className="text-neutral-500 hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg uppercase tracking-wider mb-8">Categorii</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/produse?categorie=tractoare" className="text-neutral-500 hover:text-yellow-400 transition-colors">Tractoare</Link></li>
              <li><Link href="/produse?categorie=combine" className="text-neutral-500 hover:text-yellow-400 transition-colors">Combine</Link></li>
              <li><Link href="/produse?categorie=irigatii" className="text-neutral-500 hover:text-yellow-400 transition-colors">Sisteme Irigații</Link></li>
              <li><Link href="/produse?categorie=piese" className="text-neutral-500 hover:text-yellow-400 transition-colors">Piese de schimb</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg uppercase tracking-wider mb-8">Contact</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4">
                <MapPin className="text-yellow-400 shrink-0" size={20} />
                <span className="text-neutral-500">Strada Principală nr. 42, <br /> Brăila, România</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-yellow-400 shrink-0" size={20} />
                <span className="text-neutral-500 font-bold">+40 751 234 567</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-yellow-400 shrink-0" size={20} />
                <span className="text-neutral-500">office@agrosalso.ro</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600 text-sm">
          <p>© {new Date().getFullYear()} AgroSalso Direct. Toate drepturile rezervate.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Termeni și condiții</Link>
            <Link href="#" className="hover:text-white">Politica Cookie</Link>
            <Link href="#" className="hover:text-white">GDPR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
