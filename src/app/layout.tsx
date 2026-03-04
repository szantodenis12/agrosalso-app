
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://agrosalso.ro'),
  title: {
    default: 'AgroSalso — Utilaje și Echipamente Agricole',
    template: '%s | AgroSalso'
  },
  description: 'Distribuitor autorizat utilaje agricole în România din 2005. Tractoare, combine, sisteme irigații. Livrare rapidă, service autorizat, finanțare.',
  keywords: ['utilaje agricole', 'tractoare Romania', 'combine agricole', 'echipamente agricole', 'John Deere Romania', 'CLAAS Romania', 'irigații agricole'],
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'AgroSalso',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
