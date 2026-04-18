import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { VisitorTracker } from '@/components/analytics/VisitorTracker';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';
import { CookieConsent } from '@/components/legal/CookieConsent';
import { GTMListener } from '@/components/analytics/GTMListener';
import Script from 'next/script';
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
        <Script id="gtm-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TFS9F4D8');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFS9F4D8"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <GTMListener />
        <LanguageProvider>
          <FirebaseClientProvider>
            <VisitorTracker />
            {children}
            <Toaster />
            <CookieConsent />
          </FirebaseClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
