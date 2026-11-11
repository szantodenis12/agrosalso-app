import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/produse/ProductCard';
import type { Product } from '@/types';

// Bucati server-side comune pentru paginile SEO /utilaje/*, /marci/*, /utilaje-agricole-bihor.
// Stilul urmeaza /servicii (hero intunecat, breadcrumb, carduri rotunjite, CTA negru).

export function LandingHero({ label, title, image = '/thumb-0-v2.webp' }: { label: string; title: string; image?: string }) {
  return (
    <section className="relative h-[42vh] md:h-[55vh] w-full flex flex-col justify-end overflow-hidden bg-neutral-900">
      <Image src={image} alt="Utilaj agricol Agro Salso la lucru pe câmp" fill priority className="object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
      <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 md:px-14 pb-10 md:pb-16">
        <div className="max-w-3xl space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-lime rounded-full" />
            <span className="text-accent-lime text-xs font-bold uppercase tracking-[0.3em]">{label}</span>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tighter">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}

export function LandingBreadcrumb({ items }: { items: { nume: string; url?: string }[] }) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-14 pt-6 md:pt-8">
      <nav aria-label="Breadcrumb" className="text-xs font-bold uppercase tracking-widest text-neutral-400">
        {items.map((it, i) => (
          <span key={it.nume}>
            {i > 0 && <span className="mx-2">/</span>}
            {it.url ? (
              <Link href={it.url} className="hover:text-neutral-900 transition-colors">{it.nume}</Link>
            ) : (
              <span className="text-neutral-900">{it.nume}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}

export function LandingProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5 text-neutral-600 font-body text-base md:text-lg leading-relaxed max-w-3xl">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function LandingProducts({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-14 md:mt-20">
      <h2 className="font-headline font-extrabold text-2xl md:text-4xl text-neutral-900 tracking-tight mb-8 md:mb-10">{title}</h2>
      <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} viewMode="grid" />
        ))}
      </div>
    </section>
  );
}

export function LandingLinkChips({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <section className="mt-14 md:mt-20">
      <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 tracking-tight mb-6">{title}</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex items-center gap-2 bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-md rounded-full px-5 py-2.5 text-sm font-bold text-neutral-900 transition-all"
            >
              {l.label}
              <ArrowUpRight size={14} className="text-neutral-400" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingCta() {
  return (
    <div className="relative overflow-hidden bg-neutral-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 mt-16 md:mt-24">
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="https://wa.me/40761927076"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-accent-lime hover:bg-accent-lime/90 text-black rounded-full p-1.5 flex items-center justify-between gap-10 w-fit shadow-2xl shadow-accent-lime/20 transition-all group/btn"
        >
          <span className="pl-6 text-sm font-bold uppercase tracking-widest">Cere ofertă pe WhatsApp</span>
          <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
            <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
          </span>
        </a>
        <Link
          href="/produse"
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full p-1.5 flex items-center justify-between gap-10 w-fit transition-all group/btn"
        >
          <span className="pl-6 text-sm font-bold uppercase tracking-widest">Tot catalogul</span>
          <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45">
            <ArrowUpRight size={20} className="text-black" strokeWidth={3} />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function LandingPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export function LandingBody({ children }: { children: React.ReactNode }) {
  return <section className="max-w-[1440px] mx-auto px-6 md:px-14 py-12 md:py-20">{children}</section>;
}
