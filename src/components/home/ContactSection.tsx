'use client';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-14 bg-[#E9F5E1]">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section: Title & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-lime/20 rounded-full w-fit">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">Contactează-ne</span>
            </div>
            <h2 className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl text-neutral-900 tracking-tighter leading-[1]">
              Hai să creștem <br /> împreună
            </h2>
            <p className="text-neutral-500 text-lg md:text-xl font-body leading-relaxed max-w-xl">
              Indiferent dacă ești fermier, partener sau investitor, echipa noastră este aici să te ajute să explorezi cum tehnologia AgroSalso poate susține drumul tău către o agricultură inteligentă și sustenabilă.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-green-900/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900 ml-1">Nume</label>
                <Input placeholder="Numele tău" className="bg-neutral-50 border-none h-14 rounded-2xl px-6 focus-visible:ring-accent-lime" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900 ml-1">Email</label>
                <Input placeholder="Adresa de email" className="bg-neutral-50 border-none h-14 rounded-2xl px-6 focus-visible:ring-accent-lime" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900 ml-1">Subiect</label>
                <Input placeholder="Subiectul cererii" className="bg-neutral-50 border-none h-14 rounded-2xl px-6 focus-visible:ring-accent-lime" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-900 ml-1">Telefon</label>
                <Input placeholder="Numărul de telefon" className="bg-neutral-50 border-none h-14 rounded-2xl px-6 focus-visible:ring-accent-lime" />
              </div>
            </div>
            <div className="space-y-2 mb-10">
              <label className="text-sm font-bold text-neutral-900 ml-1">Mesaj</label>
              <Textarea placeholder="Scrie mesajul tău aici..." className="bg-neutral-50 border-none min-h-[160px] rounded-2xl p-6 focus-visible:ring-accent-lime" />
            </div>

            <Button className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-16 rounded-full text-lg flex justify-between px-8 group">
              TRIMITE ACUM
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight size={20} />
              </div>
            </Button>
          </motion.div>
        </div>

        {/* Bottom Section: Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { icon: <Mail size={24} className="text-accent-lime" />, title: "Email", value: "office@agrosalso.ro" },
            { icon: <Phone size={24} className="text-accent-lime" />, title: "Telefon", value: "+40 751 234 567" },
            { icon: <Clock size={24} className="text-accent-lime" />, title: "Program", value: "Luni-Vineri: 08:00 - 17:00" },
            { icon: <MapPin size={24} className="text-accent-lime" />, title: "Sediu", value: "Brăila, România" }
          ].map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-[2rem] space-y-6 hover:shadow-xl transition-shadow border border-white/50"
            >
              <div className="w-12 h-12 bg-[#E9F5E1] rounded-2xl flex items-center justify-center">
                {info.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-headline font-bold text-xl text-neutral-900">{info.title}</h4>
                <p className="text-neutral-500 font-medium">{info.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
