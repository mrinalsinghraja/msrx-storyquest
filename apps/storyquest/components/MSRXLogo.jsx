/**
 * The MSRX mark.
 *
 * Ported verbatim from the portal (www.msrx.co.in) so the brand is pixel-identical
 * across every MSRX app. Do not restyle it locally — change it in the portal first.
 */
export default function MSRXLogo({ size = 28, glow = false }) {
  const id = glow ? 'glow' : 'noglow';
  return (
    <svg
      width={size}
      height={Math.round(size * 1.15)}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MSRX"
    >
      <defs>
        <linearGradient id={`mg-left-${id}`} x1="50" y1="8" x2="0" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7EE8F8" /><stop offset="100%" stopColor="#00AAC8" />
        </linearGradient>
        <linearGradient id={`mg-right-${id}`} x1="50" y1="8" x2="100" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD" /><stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        {glow ? (
          <filter id={`m-glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b1" />
            <feFlood floodColor="#38BDF8" floodOpacity="0.65" result="c1" />
            <feComposite in="c1" in2="b1" operator="in" result="g1" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="b2" />
            <feFlood floodColor="#8B5CF6" floodOpacity="0.4" result="c2" />
            <feComposite in="c2" in2="b2" operator="in" result="g2" />
            <feMerge><feMergeNode in="g2" /><feMergeNode in="g1" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        ) : null}
      </defs>
      <g filter={glow ? `url(#m-glow-${id})` : undefined}>
        <path d="M 5 110 L 5 12 L 22 12 L 22 110 Z" fill={`url(#mg-left-${id})`} />
        <path d="M 22 12 L 50 58 L 50 78 L 22 46 Z" fill={`url(#mg-left-${id})`} opacity="0.8" />
        <path d="M 5 12 L 50 12 L 50 22 L 22 22 Z" fill="rgba(200,248,255,0.4)" />
        <path d="M 22 46 L 50 78 L 78 46 L 78 62 L 50 94 L 22 62 Z" fill="rgba(0,0,30,0.28)" />
        <path d="M 78 12 L 50 58 L 50 78 L 78 46 Z" fill={`url(#mg-right-${id})`} opacity="0.8" />
        <path d="M 78 12 L 95 12 L 95 110 L 78 110 Z" fill={`url(#mg-right-${id})`} />
        <path d="M 50 12 L 95 12 L 78 22 L 50 22 Z" fill="rgba(220,210,255,0.38)" />
        <path d="M 5 12 L 22 12 L 50 58 L 78 12 L 95 12 L 95 20 L 78 20 L 50 68 L 22 20 L 5 20 Z" fill="rgba(255,255,255,0.18)" />
      </g>
    </svg>
  );
}
