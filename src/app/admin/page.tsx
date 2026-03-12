'use client';
import { useMemo } from 'react';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Package, MessageSquare, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { Product, Inquiry } from '@/types';
import { BarChart, Bar, XAxis, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export default function AdminDashboard() {
  const db = useFirestore();

  // 1. Monitorizare Produse (Reactiv)
  const productsQuery = useMemoFirebase(() => collection(db, 'products'), [db]);
  const { data: products, isLoading: isProductsLoading } = useCollection<Product>(productsQuery);

  // 2. Monitorizare Cereri (Reactiv)
  const inquiriesQuery = useMemoFirebase(() => collection(db, 'inquiries'), [db]);
  const { data: inquiries, isLoading: isInquiriesLoading } = useCollection<Inquiry>(inquiriesQuery);

  // 3. Monitorizare Vizite (Reactiv)
  const statsDocRef = useMemo(() => doc(db, 'siteMetadata', 'stats'), [db]);
  const { data: siteStats, isLoading: isStatsLoading } = useDoc<{ visitCount: number }>(statsDocRef);

  // 4. Calcule Statistice
  const stats = useMemo(() => {
    const totalProducts = products?.length || 0;
    const totalInquiries = inquiries?.length || 0;
    const totalVisits = siteStats?.visitCount || 0;

    // Calcul Timp Mediu Răspuns
    const repliedInquiries = inquiries?.filter(d => 
      d.status === 'replied' && d.repliedAt && d.createdAt
    ) || [];
    
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

    return {
      products: totalProducts,
      inquiries: totalInquiries,
      visits: totalVisits,
      avgResponseTime: avgTimeStr
    };
  }, [products, inquiries, siteStats]);

  // 5. Date pentru Grafic (Categorii Produse)
  const categoryStats = useMemo(() => {
    if (!products) return [];
    const map = new Map<string, number>();
    products.forEach(p => {
      const cat = p.category || 'Altele';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [products]);

  const isLoading = isProductsLoading || isInquiriesLoading || isStatsLoading;

  const cards = [
    { name: 'Total Produse', value: stats.products, icon: <Package className="text-blue-500" />, sub: 'În catalog' },
    { name: 'Cereri primite', value: stats.inquiries, icon: <MessageSquare className="text-accent-lime" />, sub: 'Total lead-uri' },
    { name: 'Vizite Reale', value: stats.visits.toLocaleString(), icon: <TrendingUp className="text-green-500" />, sub: 'Trafic site public' },
    { name: 'Timp Răspuns', value: stats.avgResponseTime, icon: <Clock className="text-purple-500" />, sub: 'Media de procesare' },
  ];

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="font-headline font-extrabold text-3xl lg:text-4xl text-neutral-900 tracking-tighter uppercase">Dashboard</h1>
          <p className="text-neutral-400 text-sm font-medium">Date reale extrase direct din activitatea site-ului.</p>
        </div>
        {isLoading && <Loader2 className="animate-spin text-accent-lime" size={24} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => (
          <Card key={card.name} className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 lg:p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-neutral-50 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-neutral-400 text-[10px] lg:text-xs font-extrabold uppercase tracking-widest">{card.name}</h3>
                <div className="text-2xl lg:text-3xl font-headline font-extrabold text-neutral-900">{card.value}</div>
                <p className="text-[9px] lg:text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{card.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-sm min-h-[350px] flex flex-col">
          <CardContent className="p-6 lg:p-8 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="font-headline font-extrabold text-lg lg:text-xl">Distribuție Produse</h3>
                <p className="text-neutral-400 text-xs font-medium">Număr de utilaje listate per categorie principală.</p>
              </div>
              <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-accent-lime" size={20} />
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[200px]">
              {categoryStats.length > 0 ? (
                <ChartContainer 
                  config={{ 
                    total: { label: "Produse", color: "hsl(var(--accent-lime))" } 
                  }} 
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        tickFormatter={(val) => val.length > 12 ? val.substring(0, 10) + '...' : val}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]} barSize={40}>
                        {categoryStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? "hsl(var(--accent-lime))" : "#f1f5f9"} 
                            className="transition-all hover:opacity-80"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-300 space-y-2">
                  <Package size={40} className="opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Niciun produs în catalog</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-sm">
          <CardContent className="p-6 lg:p-8">
            <h3 className="font-headline font-extrabold text-lg lg:text-xl mb-6">Obiective Business</h3>
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <p className="text-xs lg:text-sm font-bold text-neutral-700">Actualizează catalogul lunar</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <p className="text-xs lg:text-sm font-bold text-neutral-700">Răspunde în sub 2 ore</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <p className="text-xs lg:text-sm font-bold text-neutral-700">Crește traficul organic</p>
              </div>
              <div className="pt-4 border-t border-neutral-50 mt-4">
                 <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Activitate curentă</p>
                 <p className="text-xs font-medium text-neutral-600">
                   {stats.inquiries} cereri de gestionat în acest moment.
                 </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
