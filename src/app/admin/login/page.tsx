
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Eroare de autentificare",
        description: "Email sau parolă incorectă.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
      <Card className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-none">
        <CardHeader className="pt-10 pb-6 text-center border-b border-neutral-100">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-5 bg-accent-lime rounded-sm rotate-12" />
          </div>
          <CardTitle className="font-headline font-extrabold text-2xl tracking-tighter">AgroSalso Admin</CardTitle>
          <p className="text-neutral-400 text-sm font-medium mt-1">Conectați-vă pentru a gestiona catalogul</p>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Email</label>
              <Input 
                type="email" 
                placeholder="admin@agrosalso.ro" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest ml-1">Parolă</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 rounded-2xl bg-neutral-50 border-none focus-visible:ring-accent-lime"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-neutral-900 hover:bg-black text-white font-extrabold rounded-2xl text-sm tracking-widest uppercase transition-all shadow-xl shadow-black/10"
            >
              {loading ? 'Se conectează...' : 'AUTENTIFICARE'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
