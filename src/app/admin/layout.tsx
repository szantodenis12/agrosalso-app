
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { LayoutDashboard, Package, PlusCircle, Database, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-8 h-8 border-4 border-accent-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white shrink-0 fixed h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-5 h-3 bg-accent-lime rounded-sm rotate-12" />
            <span className="font-headline font-extrabold text-xl tracking-tighter">AgroSalso Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
            { name: 'Produse', href: '/admin/produse', icon: <Package size={18} /> },
            { name: 'Adaugă Produs', href: '/admin/produse/nou', icon: <PlusCircle size={18} /> },
            { name: 'Seed DB', href: '/admin/seed', icon: <Database size={18} /> },
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === item.href ? 'bg-accent-lime text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 h-12"
            onClick={async () => {
              const { getAuth, signOut } = await import('firebase/auth');
              await signOut(getAuth());
              router.push('/admin/login');
            }}
          >
            <LogOut size={18} />
            Deconectare
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
