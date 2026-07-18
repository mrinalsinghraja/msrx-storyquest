import './globals.css';

export const metadata = {
  title: 'MSRX StoryQuest',
  description: 'Adaptive universal STEM concept storytelling workspace.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-950 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      <body className="h-full overflow-hidden text-slate-100">
        {children}
      </body>
    </html>
  );
}
