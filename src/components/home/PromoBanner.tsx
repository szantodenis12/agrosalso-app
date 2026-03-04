
'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <section className="bg-green-800 py-24 px-6 md:px-14 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 font-headline font-extrabold text-[18rem] text-white opacity-[0.03] select-none pointer-events-none hidden lg:block">
        PROMO
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-yellow-400 font-extrabold text-sm uppercase tracking-[0.25em] mb-6">CAMPANIE FINANȚARE 2024</div>
          <h2 className="font-headline font-extrabold text-5xl md:text-6xl text-white mb-8 leading-[1.1] tracking-tighter">
            Echipează-te pentru recoltă. <br />
            <span className="text-yellow-400 underline decoration-white/20 underline-offset-8">Dobândă 0%</span> la utilaje.
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-12 font-body">
            Oferim soluții flexibile de finanțare în parteneriat cu bănci de renume pentru ca tu să investești în viitorul fermei tale fără griji.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold h-14 px-8 text-lg">
              SOLICITĂ FINANȚARE
            </Button>
            <Button variant="ghost" className="text-white font-bold h-14 px-8 text-lg hover:bg-white/10">
              VEZI CONDIȚIILE
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-white/5 border border-white/10 backdrop-blur-md p-10 flex flex-col items-center text-center rounded-2xl"
        >
          <div className="font-headline font-extrabold text-[6rem] text-yellow-400 leading-none">24</div>
          <div className="text-white font-bold text-xl uppercase tracking-widest mb-6">LUNI FĂRĂ DOBÂNDĂ</div>
          <div className="w-20 h-[2px] bg-white/20 mb-6" />
          <div className="text-white/40 text-sm uppercase tracking-tighter mb-2 font-body">DOBÂNDĂ ANUALĂ</div>
          <div className="font-headline font-extrabold text-4xl text-white">0%</div>
        </motion.div>
      </div>
    </section>
  );
}
