import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MSRX StoryQuest — Interactive STEM missions where the answer comes from the equation.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Social preview card.
 *
 * Composition follows the portal's OG image (same wash, same ambient glows, same
 * gradient wordmark) so a StoryQuest link shares consistently with the rest of
 * the MSRX family. The illustration is the balance beam, since that is the one
 * idea every mission has in common.
 */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(145deg, #f0f4ff 0%, #f5f0ff 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -60, left: -60, width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(0,196,223,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: 0, right: -40, width: 320, height: 320, background: 'radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
          <div
            style={{
              width: 84, height: 84,
              background: 'linear-gradient(135deg, #00c4df 0%, #8b5cf6 100%)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(0,196,223,0.3), 0 20px 60px rgba(139,92,246,0.2)',
            }}
          >
            <svg width="52" height="60" viewBox="0 0 100 115" fill="none">
              <path d="M 5 110 L 5 12 L 22 12 L 22 110 Z" fill="white" opacity="0.95" />
              <path d="M 22 12 L 50 58 L 50 78 L 22 46 Z" fill="white" opacity="0.8" />
              <path d="M 78 12 L 50 58 L 50 78 L 78 46 Z" fill="white" opacity="0.8" />
              <path d="M 78 12 L 95 12 L 95 110 L 78 110 Z" fill="white" opacity="0.95" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #00c4df 0%, #8b5cf6 100%)', backgroundClip: 'text', color: 'transparent' }}>MSRX</span>
            <span style={{ color: '#1d1d1f', marginLeft: 14 }}>StoryQuest</span>
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 40, position: 'relative' }}>
          Think deeply.
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, position: 'relative' }}>
          <span style={{ background: 'linear-gradient(135deg, #00c4df 0%, #8b5cf6 100%)', backgroundClip: 'text', color: 'transparent' }}>Change the outcome.</span>
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: '#6e6e73', marginTop: 28, position: 'relative' }}>
          100 interactive STEM missions · physics · chemistry · maths · biology
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40, position: 'relative' }}>
          {['Solved from the equation', 'No sign-up', 'Nothing stored'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 18, fontWeight: 700, letterSpacing: '0.04em',
                color: '#8b5cf6',
                background: 'rgba(139,92,246,0.08)',
                padding: '10px 20px',
                borderRadius: 100,
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <svg width="320" height="150" viewBox="0 0 320 150" style={{ position: 'absolute', right: 70, bottom: 70 }}>
          <line x1="30" y1="128" x2="290" y2="128" stroke="#c7c7cc" strokeWidth="3" />
          <rect x="52" y="92" width="216" height="10" rx="5" fill="#d1d1d6" />
          <rect x="82" y="56" width="42" height="36" rx="8" fill="#8b5cf6" />
          <rect x="196" y="56" width="42" height="36" rx="8" fill="#00c4df" />
          <path d="M160 102 L140 128 H180 Z" fill="#8b5cf6" />
          <circle cx="160" cy="97" r="11" fill="#ffffff" stroke="#00c4df" strokeWidth="4" />
        </svg>
      </div>
    ),
    size,
  );
}
