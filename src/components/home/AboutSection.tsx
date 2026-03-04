'use client';
import { Check, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function AboutSection() {
  return (
    <section className="py-24 px-6 md:px-14 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-32">
        
        {/* Vision Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest">
              Viziune
            </div>
            <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-neutral-900 tracking-tighter">
              Viziune
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl font-body leading-relaxed max-w-lg">
              Un viitor în care fiecare fermă — mare sau mică — este condusă de date, ghidată de decizii inteligente și integrată în lanțuri de valoare transparente și reziliente.
            </p>
            <div className="pt-4">
              <Link href="/contact">
                <div className="bg-neutral-900 hover:bg-black text-white rounded-full p-1.5 flex items-center justify-between transition-all duration-300 group/btn w-fit gap-8">
                  <span className="pl-6 text-sm font-bold uppercase tracking-wider">Începe acum</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:scale-95 group-hover/btn:rotate-12">
                    <ArrowUpRight size={18} className="text-black" strokeWidth={3} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-[3rem] overflow-hidden shadow-2xl">
            <Image 
              src="https://picsum.photos/seed/vision_farm/1200/900" 
              alt="Viziunea AgroSalso" 
              fill 
              className="object-cover"
              data-ai-hint="modern farming"
            />
          </div>
        </div>

        {/* Mission Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-accent-lime/10 text-accent-lime rounded-full text-[10px] font-bold uppercase tracking-widest">
              Valori
            </div>
            <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-neutral-900 tracking-tighter">
              Misiune
            </h2>
          </div>
          <div className="space-y-10 pt-4 lg:pt-20">
            {[
              "Echiparea fermelor de orice mărime cu tehnologie inteligentă",
              "Soluții sustenabile pentru a produce mai mult cu mai puțin",
              "Reducerea risipei și protejarea fertilității solului"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="mt-1 w-8 h-8 rounded-full bg-accent-lime flex items-center justify-center shrink-0 shadow-lg shadow-accent-lime/20 group-hover:scale-110 transition-transform">
                  <Check size={18} className="text-black" strokeWidth={3} />
                </div>
                <p className="font-headline font-bold text-2xl md:text-3xl text-neutral-900 leading-tight">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
