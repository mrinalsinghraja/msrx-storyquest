import { Inter, Instrument_Serif, JetBrains_Mono, Newsreader } from 'next/font/google';
import './globals.css';
import { SITE_ORIGIN, canonical } from '../lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

/**
 * Catalogue faces, used only by the mission library (`.catalogue` in globals.css).
 *
 * The rest of the site stays on Inter and the portal tokens. Loading them here
 * rather than in the route keeps a single font pipeline, and `display: swap`
 * plus the fallback stacks mean a slow font never blanks the page.
 */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-text',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-data',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'MSRX StoryQuest — Interactive STEM Missions',
    template: '%s — MSRX StoryQuest',
  },
  description:
    'MSRX StoryQuest turns physics, chemistry, maths and biology into 100 interactive missions. Tune a live lab until the real equation balances. Free, no sign-up, nothing stored.',
  applicationName: 'MSRX StoryQuest',
  authors: [{ name: 'Mrinal Singh Raja', url: 'https://www.linkedin.com/in/mrinalsinghraja/' }],
  creator: 'Mrinal Singh Raja',
  publisher: 'Mrinal Singh Raja',
  category: 'education',
  keywords: [
    'MSRX', 'MSRX StoryQuest', 'StoryQuest', 'interactive STEM', 'STEM learning app',
    'physics simulation', 'chemistry simulation', 'interactive maths', 'biology simulation',
    'middle school science', 'science story game', 'learn physics interactively',
    'free STEM app', 'no sign-up learning', 'Mrinal Singh Raja',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MSRX StoryQuest — Interactive STEM Missions',
    description:
      '100 interactive STEM missions across physics, chemistry, maths and biology. Every answer is solved from a real equation, not guessed.',
    url: canonical('/'),
    siteName: 'MSRX StoryQuest',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSRX StoryQuest — Interactive STEM Missions',
    description: '100 interactive STEM missions where the answer comes from the equation, not a guess.',
    creator: '@mrinalsinghraja',
    site: '@mrinalsinghraja',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

// Light-only, matching every other MSRX app. Declaring colorScheme stops
// browsers auto-darkening the UI.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f8f9ff',
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_ORIGIN}/#app`,
      name: 'MSRX StoryQuest',
      url: SITE_ORIGIN,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description:
        '100 interactive STEM missions across physics, chemistry, mathematics and biology. Each mission is built on a real equation; the learner tunes a live lab until both sides balance.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': 'https://www.msrx.co.in/#organization' },
      isPartOf: { '@id': 'https://www.msrx.co.in/#website' },
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: 'MSRX StoryQuest',
      publisher: { '@id': 'https://www.msrx.co.in/#organization' },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
