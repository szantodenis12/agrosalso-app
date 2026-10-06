import Link from 'next/link';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NOUTATI } from '@/content/noutati';
import { ChromeText, ArticleDate } from '@/components/noutati/Chrome';
import { Reveal } from '@/components/noutati/Reveal';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

// Pagină server — listarea e randată complet pe server (SEO), doar
// textele de interfață și formatul datei sunt localizate client-side
// (ChromeText / ArticleDate, vezi components/noutati/Chrome.tsx).
export default function NoutatiPage() {
  const articole = [...NOUTATI].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <BreadcrumbJsonLd trasee={[{ nume: 'Acasă', url: '/' }, { nume: 'Noutăți', url: '/noutati' }]} />
      <Navbar />
      <main className="bg-neutral-50 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[100px] md:pt-[140px] pb-20 md:pb-32">
          <div className="flex gap-2 text-[9px] md:text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest mb-6 md:mb-10">
            <Link href="/" className="hover:text-accent-lime transition-colors">
              Acasă
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-neutral-900">
              <ChromeText k="breadcrumbLabel" />
            </span>
          </div>

          <Reveal className="max-w-3xl space-y-4 md:space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-lime rounded-full" />
              <span className="text-accent-lime text-xs font-bold uppercase tracking-[0.3em]">
                <ChromeText k="eyebrow" />
              </span>
            </div>
            <h1 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-neutral-900 tracking-tight leading-[1.05]">
              <ChromeText k="title" />
            </h1>
            <p className="text-neutral-500 text-base md:text-xl max-w-2xl font-body leading-relaxed">
              <ChromeText k="subtitle" />
            </p>
          </Reveal>

          {articole.length === 0 ? (
            <p className="mt-16 text-neutral-400 font-body">
              <ChromeText k="emptyState" />
            </p>
          ) : (
            <div className="mt-12 md:mt-20 space-y-6 md:space-y-8">
              {articole.map((articol, i) => (
                <Reveal key={articol.slug} delay={i * 0.06}>
                  <Link href={`/noutati/${articol.slug}`} className="block group">
                    <article className="bg-white p-6 md:p-10 rounded-[2rem] border border-neutral-100 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 space-y-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                        <CalendarDays size={14} />
                        <ArticleDate iso={articol.date} />
                      </div>
                      <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-neutral-900 group-hover:text-accent-lime transition-colors leading-tight">
                        {articol.title}
                      </h2>
                      <p className="text-neutral-500 font-body leading-relaxed">
                        {articol.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 font-bold text-sm text-neutral-900">
                        <ChromeText k="readArticle" />
                        <ArrowUpRight
                          size={16}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </span>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
