
'use client';
import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, MessageSquare, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, inquiries: 0 });
  const [loading, setLoading] = useState(true);
  const db = useFirestore();

  useEffect(() => {
    async function loadStats() {
      const prodSnap = await getDocs(collection(db, 'products'));
      const inqSnap = await getDocs(collection(db, 'inquiries'));
      setStats({
        products: prodSnap.size,
        inquiries: inqSnap.size
      });
      setLoading(false);
    }
    loadStats();
  }, [db]);

  const cards = [
    { name: 'Total Produse', value: stats.products, icon: <Package className="text-blue-500" />, sub: 'În catalog' },
    { name: 'Cereri noi', value: stats.inquiries, icon: <MessageSquare className="text-accent-lime" />, sub: 'Ultimele 30 zile' },
    { name: 'Vizite Site', value: '1.2k', icon: <TrendingUp className="text-green-500" />, sub: '+12% vs luna trecută' },
    { name: 'Timp Răspuns', value: '2.4h', icon: <Clock className="text-purple-500" />, sub: 'Medie' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Dashboard</h1>
        <p className="text-neutral-400 font-medium">Privire de ansamblu asupra afacerii tale.</p>
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
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="font-headline font-extrabold text-xl tracking-tight">Activitate Recenta</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex items-center justify-center text-neutral-300">
            <p className="font-medium text-sm">Graficele vor apărea aici pe măsură ce datele se acumulează.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-[2rem] border-none shadow-sm">
          <CardHeader className="p-8 border-b border-neutral-50">
            <CardTitle className="font-headline font-extrabold text-xl tracking-tight">Informații Rapide</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-accent-lime rounded-full" />
                <p className="text-sm font-bold text-neutral-700">Actualizează catalogul de tractoare</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <p className="text-sm font-bold text-neutral-700">Verifică cererile pentru combine</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
