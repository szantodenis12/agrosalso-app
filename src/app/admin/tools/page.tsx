'use client';
import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import { Product, ProductTranslation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Languages, Loader2, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { LANGUAGES } from '@/context/LanguageContext';

export default function TranslationToolsPage() {
  const db = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<string[]>([]);

  const productsQuery = useMemoFirebase(() => {
    return query(collection(db, 'products'));
  }, [db]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

  const translateProducts = async () => {
    if (!products || products.length === 0) return;
    setIsProcessing(true);
    setLogs([]);
    
    const targetLangs = LANGUAGES.filter(l => l.code !== 'ro').map(l => l.code);
    const total = products.length;

    for (const lang of targetLangs) {
      addLog(`Încep traducerea pentru: ${lang.toUpperCase()}`);
      let translatedCount = 0;

      // Procesăm în grupuri de 3 pentru performanță/limitări API
      for (let i = 0; i < products.length; i += 3) {
        const batch = products.slice(i, i + 3);
        
        await Promise.all(batch.map(async (product) => {
          // Verificăm dacă există deja traducerea numelui pentru a nu consuma API-ul inutil
          if (product.translations?.[lang]?.name) {
            translatedCount++;
            return;
          }

          try {
            const textsToTranslate = [
              product.name,
              product.shortDescription,
              product.description,
              product.detailedDescription,
              ...(product.whyBrand || [])
            ];

            const response = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                text: textsToTranslate, 
                target_lang: lang 
              }),
            });

            const result = await response.json();
            if (result.translatedText) {
              const [name, short, desc, detailed, ...why] = result.translatedText;
              
              const translationData: ProductTranslation = {
                name,
                shortDescription: short,
                description: desc,
                detailedDescription: detailed,
                whyBrand: why
              };

              await updateDoc(doc(db, 'products', product.id), {
                [`translations.${lang}`]: translationData
              });

              translatedCount++;
              setProgress(prev => ({ ...prev, [lang]: `${translatedCount}/${total}` }));
            }
          } catch (error) {
            addLog(`Eroare la produsul ${product.name} (${lang}): ${error}`);
          }
        }));
      }
      addLog(`✓ Gata pentru ${lang.toUpperCase()}`);
    }

    setIsProcessing(false);
    toast({ title: "Traducere completă", description: "Toate produsele au fost actualizate." });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline font-extrabold text-4xl text-neutral-900 tracking-tighter uppercase">Utilitare Traducere</h1>
        <p className="text-neutral-400 font-medium">Automatizați traducerile catalogului folosind DeepL API.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-white rounded-[2.5rem] border-none shadow-sm h-fit">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4 text-accent-lime">
              <Languages size={32} />
              <h3 className="font-headline font-extrabold text-xl text-neutral-900">Traducere în Masă</h3>
            </div>
            
            <p className="text-sm text-neutral-500 leading-relaxed">
              Acest utilitar va parcurge toate produsele și va genera traduceri pentru limbile: 
              <span className="font-bold text-neutral-900 ml-1">EN, HU, IT, DE, ES</span>. 
              Produsele care au deja traduceri salvate vor fi ignorate pentru a economisi resurse.
            </p>

            <div className="space-y-3 pt-4">
              {LANGUAGES.filter(l => l.code !== 'ro').map(l => (
                <div key={l.code} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <span className="font-bold text-sm">{l.label}</span>
                  <span className="text-xs font-bold text-neutral-400">{progress[l.code] || '0/0'}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={translateProducts} 
              disabled={isProcessing || isLoading || !products?.length}
              className="w-full bg-neutral-900 hover:bg-black text-white font-extrabold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all mt-4"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <Play size={18} />}
              {isProcessing ? 'SE PROCESEAZĂ...' : 'PORNEȘTE TRADUCEREA TOATE'}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-neutral-900 rounded-[2.5rem] border-none shadow-xl min-h-[500px]">
          <CardContent className="p-8 h-full flex flex-col">
            <h3 className="text-white/40 text-xs font-extrabold uppercase tracking-widest mb-6">Log Activitate</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {logs.length === 0 ? (
                <p className="text-white/20 italic text-sm">Nicio activitate înregistrată...</p>
              ) : logs.map((log, i) => (
                <div key={i} className="text-white/60 text-xs font-mono border-b border-white/5 pb-2 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
