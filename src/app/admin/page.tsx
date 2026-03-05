
'use client';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Package, MessageSquare, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    products: 0, 
    inquiries: 0, 
    visits: 0, 
    avgResponseTime: 'N/A' 
  });
  const [loading, setLoading] = useState(true);
  const db = useFirestore();

  useEffect(() => {
    async function loadStats() {
      try {
        // 1. Număr Produse
        const prodSnap = await getDocs(collection(db, 'products'));
        
        // 2. Număr Cereri
        const inqSnap = await getDocs(collection(db, 'inquiries'));
        
        // 3. Vizite Reale din Metadata
        const statsSnap = await getDoc(doc(db, 'siteMetadata', 'stats'));
        const totalVisits = statsSnap.exists() ? statsSnap.data().visitCount : 0;

        // 4. Calcul Timp Mediu Răspuns
        const repliedInquiries = inqSnap.docs
          .map(d => d.data())
          .filter(d => d.status === 'replied' && d.repliedAt && d.createdAt);
        
        let avgTimeStr = 'N/A';
        if (repliedInquiries.length > 0) {
          const totalMs = repliedInquiries.reduce((acc, curr) => {
            const start = curr.createdAt.seconds * 1000;
            const end = curr.repliedAt.seconds * 1000;
            return acc + (end - start);
          }, 0);
          const avgHours = (totalMs / repliedInquiries.length) / (1000 * 60 * 60);
          avgTimeStr = avgHours < 1 ? `${(avgHours * 60).toFixed(0)}m` : `${avgHours.toFixed(1)}h`;
        }

        setStats({
          products: prodSnap.size,
          inquiries: inqSnap.size,
          visits: totalVisits,
          avgResponseTime: avgTimeStr
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [db]);

  const cards = [
    { name: 'Total Produse', value: stats.products, icon: <Package className="text-blue-500" />, sub: 'În catalog' },
    { name: 'Cereri primite', value: stats.inquiries, icon: <MessageSquare className="text-accent-lime" />, sub: 'Total lead-uri' },
    { name: 'Vizite Reale', value: stats.visits.toLocaleString(), icon: <TrendingUp className="text-green-500" />, sub: 'Trafic site public' },
    { name: 'Timp Răspuns', value: stats.avgResponseTime, icon: <Clock className="text-purple-500" />, sub: 'Media de procesare' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Dashboard</h1>
        <p className="text-neutral-400 font-medium">Date reale extrase direct din activitatea site-ului.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.name} className="bg-white rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-neutral-400 text-xs font-extrabold uppercase tracking-widest">{card.name}</h3>
                <div className="text-3xl font-headline font-extrabold text-neutral-900">{loading ? '...' : card.value}</div>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{card.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white rounded-[2rem] border-none shadow-sm min-h-[400px]">
          <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
              <TrendingUp className="text-accent-lime" size={32} />
            </div>
            <div className="max-w-xs">
              <h3 className="font-headline font-extrabold text-xl mb-2">Monitorizare în timp real</h3>
              <p className="text-neutral-400 text-sm font-medium">
                Sistemul înregistrează acum fiecare vizită și cerere. Datele de mai sus reflectă performanța reală a afacerii tale.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-[2rem] border-none shadow-sm">
          <CardContent className="p-8">
            <h3 className="font-headline font-extrabold text-xl mb-6">Obiective</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <p className="text-sm font-bold text-neutral-700">Actualizează catalogul lunar</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <p className="text-sm font-bold text-neutral-700">Răspunde în sub 2 ore</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <p className="text-sm font-bold text-neutral-700">Crește traficul organic</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
