'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export function ContactSection() {
  const { lang } = useLanguage();
  const db = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.message) {
      toast({
        variant: "destructive",
        title: lang === 'ro' ? "Câmpuri lipsă" : "Missing fields",
        description: lang === 'ro' ? "Vă rugăm să completați toate câmpurile obligatorii." : "Please fill in all required fields."
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        productId: 'general',
        productName: formData.subject || (lang === 'ro' ? 'Mesaj General' : 'General Message'),
        status: 'new',
        createdAt: serverTimestamp(),
      });

      toast({
        title: lang === 'ro' ? "Mesaj trimis!" : "Message sent!",
        description: lang === 'ro' ? "Vă mulțumim. Echipa noastră vă va contacta în curând." : "Thank you. Our team will contact you soon.",
      });

      setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: lang === 'ro' ? "A apărut o eroare la trimiterea mesajului." : "An error occurred while sending the message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-14 bg-[#E9F5E1]">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section: Title & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-lime/20 rounded-full w-fit">
              <div className="w-1.5 h-1.5 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-[10px] font-bold uppercase tracking-widest">{t[lang].contactUs}</span>
            </div>
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-neutral-900 tracking-tighter leading-[1.1]">
              {t[lang].contactTitle}
            </h2>
            <p className="text-neutral-500 text-base md:text-lg font-body leading-relaxed max-w-lg">
              {t[lang].contactSub}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl shadow-green-900/5"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-900 ml-1 uppercase tracking-wider opacity-60">{t[lang].fullName}</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t[lang].fullName} 
                    className="bg-neutral-50 border-none h-12 rounded-xl px-4 focus-visible:ring-accent-lime" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-900 ml-1 uppercase tracking-wider opacity-60">{t[lang].email}</label>
                  <Input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder={t[lang].email} 
                    className="bg-neutral-50 border-none h-12 rounded-xl px-4 focus-visible:ring-accent-lime" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-900 ml-1 uppercase tracking-wider opacity-60">{t[lang].subject}</label>
                  <Input 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder={t[lang].subject} 
                    className="bg-neutral-50 border-none h-12 rounded-xl px-4 focus-visible:ring-accent-lime" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-900 ml-1 uppercase tracking-wider opacity-60">{t[lang].phone}</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder={t[lang].phone} 
                    className="bg-neutral-50 border-none h-12 rounded-xl px-4 focus-visible:ring-accent-lime" 
                  />
                </div>
              </div>
              <div className="space-y-1.5 mb-8">
                <label className="text-xs font-bold text-neutral-900 ml-1 uppercase tracking-wider opacity-60">{t[lang].message}</label>
                <Textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={t[lang].message} 
                  className="bg-neutral-50 border-none min-h-[120px] rounded-xl p-4 focus-visible:ring-accent-lime" 
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent-lime hover:bg-accent-lime/90 text-black font-extrabold h-14 pl-8 pr-1.5 rounded-full text-base flex items-center justify-between group transition-all"
              >
                {loading ? t[lang].sending : t[lang].sendNow}
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  {loading ? <Loader2 className="animate-spin text-black" size={20} /> : <ArrowUpRight size={20} className="text-black" />}
                </div>
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section: Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <Mail size={20} className="text-accent-lime" />, title: t[lang].infoEmail, value: "contact@agrosalso.ro" },
            { icon: <Phone size={20} className="text-accent-lime" />, title: t[lang].infoPhone, value: "+40 742 936 959" },
            { icon: <Clock size={20} className="text-accent-lime" />, title: t[lang].infoSchedule, value: t[lang].infoScheduleVal },
            { icon: <MapPin size={20} className="text-accent-lime" />, title: t[lang].infoAddress, value: t[lang].infoAddressVal }
          ].map((info, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-[1.5rem] space-y-4 hover:shadow-xl transition-shadow border border-white/50"
            >
              <div className="w-10 h-10 bg-[#E9F5E1] rounded-xl flex items-center justify-center">
                {info.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-headline font-bold text-lg text-neutral-900">{info.title}</h4>
                <p className="text-neutral-500 font-medium text-sm">{info.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
