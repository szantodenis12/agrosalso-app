import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ArrowUpRight, CalendarDays } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NOUTATI } from '@/content/noutati';
import { ChromeText, ArticleDate } from '@/components/noutati/Chrome';
import { Reveal } from '@/components/noutati/Reveal';
import ArticleJsonLd from '@/components/noutati/ArticleJsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

const BASE_URL = 'https://agrosalso.ro';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NOUTATI.map((articol) => ({ slug: articol.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articol = NOUTATI.find((n) => n.slug === slug);
  if (!articol) return {};

  return {
    title: { absolute: `${articol.title} — Agro Salso` },
    description: articol.excerpt,
    alternates: { canonical: `/noutati/${slug}` },
    openGraph: {
      type: 'article',
      title: articol.title,
      description: articol.excerpt,
      url: `${BASE_URL}/noutati/${slug}`,
      publishedTime: articol.date,
    },
  };
}

// Pagină server — articolul e randat integral pe server (SEO: title,
// descriere, canonical, JSON-LD și tot textul apar în HTML-ul servit, nu
// doar după hidratare). Doar textele de interfață (etichete, data) sunt
// componente client mici, localizate — vezi components/noutati/Chrome.tsx.
export default async function NoutatePage({ params }: Props) {
  const { slug } = await params;
  const articol = NOUTATI.find((n) => n.slug === slug);
  if (!articol) notFound();

  const url = `${BASE_URL}/noutati/${slug}`;

  return (
    <>
      <ArticleJsonLd
        headline={articol.title}
        description={articol.excerpt}
        datePublished={articol.date}
        url={url}
      />
      <BreadcrumbJsonLd
        trasee={[
          { nume: 'Acasă', url: '/' },
          { nume: 'Noutăți', url: '/noutati' },
          { nume: articol.title, url: `/noutati/${articol.slug}` },
        ]}
      />

      <Navbar />
      <main className="bg-neutral-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-[100px] md:pt-[140px] pb-20 md:pb-32">
          <div className="flex gap-2 text-[9px] md:text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest mb-8 md:mb-12">
            <Link href="/" className="hover:text-accent-lime transition-colors">
              Acasă
            </Link>
            <span className="opacity-30">/</span>
            <Link href="/noutati" className="hover:text-accent-lime transition-colors">
              <ChromeText k="breadcrumbLabel" />
            </Link>
          </div>

          <Reveal>
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest mb-4">
              <CalendarDays size={14} />
              <ArticleDate iso={articol.date} />
            </div>

            <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-neutral-900 tracking-tight leading-[1.1] mb-6">
              {articol.title}
            </h1>

            <p className="text-neutral-400 text-xs font-medium italic mb-10">
              <ChromeText k="contentLanguageNote" />
            </p>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6 text-neutral-700 font-body text-lg leading-relaxed">
            {articol.body.map((paragraf, i) => (
              <p key={i}>{paragraf}</p>
            ))}
          </Reveal>

          {articol.cta && (
            <Reveal delay={0.15}>
              <a
                href={articol.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-10 bg-accent-lime hover:bg-accent-lime/90 text-black rounded-full p-1.5 transition-all duration-300 group/btn w-fit shadow-2xl shadow-accent-lime/20"
              >
                <span className="pl-6 text-sm font-bold uppercase tracking-widest">
                  {articol.cta.text}
                </span>
                <span className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform group-hover/btn:rotate-45 shrink-0">
                  <ArrowUpRight size={20} className="text-white" strokeWidth={3} />
                </span>
              </a>
            </Reveal>
          )}

          <div className="mt-16 pt-8 border-t border-neutral-200">
            <Link
              href="/noutati"
              className="inline-flex items-center gap-2 font-bold text-sm text-neutral-900 hover:text-accent-lime transition-colors"
            >
              <ChevronLeft size={16} />
              <ChromeText k="backToList" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
