'use client';
import { Inquiry } from '@/types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Package, ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InquiryCardProps {
  inquiry: Inquiry;
}

export function InquiryCard({ inquiry }: InquiryCardProps) {
  const statusColors = {
    new: "bg-yellow-400 text-black",
    read: "bg-blue-500 text-white",
    replied: "bg-neutral-100 text-neutral-500"
  };

  const statusLabels = {
    new: "Nou",
    read: "Citit",
    replied: "Trimis"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-neutral-100 hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <Badge className={cn("border-none uppercase text-[9px] font-extrabold px-3 py-1 shadow-sm", statusColors[inquiry.status])}>
          {statusLabels[inquiry.status]}
        </Badge>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Calendar size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {inquiry.createdAt?.seconds ? format(new Date(inquiry.createdAt.seconds * 1000), 'dd MMM yyyy', { locale: ro }) : 'N/A'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h3 className="font-headline font-extrabold text-xl text-neutral-900 leading-tight mb-1">{inquiry.productName}</h3>
          {inquiry.selectedModel && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-lime/10 rounded-lg text-accent-lime">
              <Package size={12} />
              <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none">Model: {inquiry.selectedModel}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-neutral-900 truncate uppercase">{inquiry.name}</p>
            <p className="text-[10px] font-medium text-neutral-400 truncate">{inquiry.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href={`/admin/cereri/${inquiry.id}`}>
          <Button className="w-full bg-neutral-900 hover:bg-black text-white rounded-2xl h-14 font-bold flex items-center justify-between pl-6 pr-2 group">
            <span className="text-xs uppercase tracking-widest">Gestionează Cererea</span>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} className="text-white" />
            </div>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
