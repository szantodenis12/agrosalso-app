'use client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function PromoBanner() {
  return (
    <section className="bg-green-800 py-32 px-6 md:px-14 relative overflow-hidden">
      {/* Background Watermark */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.03, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 -right-20 -translate-y-1/2 font-headline font-extrabold text-[22rem] text-white select-none pointer-events-none hidden lg:block"
      >
        PROMO
      </motion.div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-yellow-400 font-extrabold text-sm uppercase tracking-[0.3em] mb-8">CAMPANIE FINANȚARE 2024</div>
          <h2 className="font-headline font-extrabold text-5xl md:text-7xl text-white mb-10 leading-[1] tracking-tighter">
            Echipează-te pentru recoltă. <br />
            <span className="text-yellow-400 underline decoration-white/10 underline-offset-[12px]">Dobândă 0%</span> la utilaje.
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-14 font-body leading-relaxed">
            Oferim soluții flexibile de finanțare în parteneriat cu bănci de renume pentru ca tu să investești în viitorul fermei tale fără griji.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-extrabold h-16 px-10 text-xl rounded-full shadow-2xl shadow-yellow-400/20">
                SOLICITĂ FINANȚARE
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-white font-bold h-16 px-10 text-xl rounded-full hover:bg-white/10">
                VEZI CONDIȚIILE
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative bg-white/5 border border-white/10 backdrop-blur-xl p-16 flex flex-col items-center text-center rounded-[3rem] shadow-3xl"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="font-headline font-extrabold text-[8rem] text-yellow-400 leading-none"
          >
            24
          </motion.div>
          <div className="text-white font-bold text-2xl uppercase tracking-[0.2em] mb-8">LUNI FĂRĂ DOBÂNDĂ</div>
          <div className="w-24 h-[1px] bg-white/20 mb-8" />
          <div className="text-white/40 text-sm uppercase tracking-widest mb-3 font-body">DOBÂNDĂ ANUALĂ</div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-headline font-extrabold text-6xl text-white"
          >
            0%
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
