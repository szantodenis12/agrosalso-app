'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { LayoutDashboard, Package, PlusCircle, LogOut, MessageSquare, Languages, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { name: 'Cereri Ofertă', href: '/admin/cereri', icon: <MessageSquare size={18} /> },
  { name: 'Produse', href: '/admin/produse', icon: <Package size={18} /> },
  { name: 'Adaugă Produs', href: '/admin/produse/nou', icon: <PlusCircle size={18} /> },
  { name: 'Utilitare Traducere', href: '/admin/tools', icon: <Languages size={18} /> },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleSignOut = async () => {
    const { getAuth, signOut } = await import('firebase/auth');
    await signOut(getAuth());
    router.push('/admin/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-5 h-3 bg-accent-lime rounded-sm rotate-12" />
          <span className="font-headline font-extrabold text-xl tracking-tighter">AgroSalso Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              pathname === item.href ? 'bg-accent-lime text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
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
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          Deconectare
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 text-white flex items-center justify-between px-6 z-50 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-4 h-2.5 bg-accent-lime rounded-sm rotate-12" />
          <span className="font-headline font-extrabold text-lg tracking-tighter">Admin</span>
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-neutral-900 p-0 text-white border-none w-[280px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Meniu Navigare</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-neutral-900 text-white shrink-0 fixed h-full flex-col z-40">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-24 lg:pt-10 print:ml-0 print:p-0">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
