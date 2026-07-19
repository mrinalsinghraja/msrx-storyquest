import { Bricolage_Grotesque, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE_ORIGIN, canonical } from '../lib/site';
import { CATALOGUE, gradeRange } from '../lib/catalogue-stats';

/**
 * Workbench faces, used by `.bench` in globals.css.
 *
 * Bricolage Grotesque is the display voice: a variable grotesque that reads as
 * engineered without reading as corporate, which is the line this site has to
 * walk for an audience that spans a six-year-old and a sixteen-year-old. It is
 * held to headings only.
 *
 * IBM Plex Sans carries body copy for a reason that is not aesthetic: this is
 * used by students worldwide, and Plex has the script coverage to render their
 * names and languages. A face chosen only for its Latin shapes would fail that
 * quietly.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Telemetry face. Every measured number on the site is set in it — plate
 * numbers, readouts, chapter rules — which is the one job it has.
 *
 * Instrument Serif and Newsreader used to sit here too, for the catalogue.
 * `.catalogue` now rebinds `--font-display` and `--font-text` to the workbench
 * faces, so both had no consumer left and were two font families downloaded for
 * nothing. Checked before removing: all eleven `var(--font-display|text)` reads
 * are inside blocks that rebind them.
 */
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
    `MSRX StoryQuest turns physics, chemistry, maths and biology into ${CATALOGUE.missions} interactive missions across ${gradeRange}. Tune a live lab until the real equation balances. Free, no sign-up, nothing stored.`,
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
      `${CATALOGUE.missions} interactive STEM missions across physics, chemistry, maths and biology. Every answer is solved from a real equation, not guessed.`,
    url: canonical('/'),
    siteName: 'MSRX StoryQuest',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSRX StoryQuest — Interactive STEM Missions',
    description: `${CATALOGUE.missions} interactive STEM missions where the answer comes from the equation, not a guess.`,
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
        `${CATALOGUE.missions} interactive STEM missions across physics, chemistry, mathematics and biology, covering ${gradeRange}. Each mission is built on a real equation; the learner tunes a live lab until both sides balance.`,
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
      className={`${bricolage.variable} ${plexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
