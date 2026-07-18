export default function manifest() {
  return {
    name: 'MSRX StoryQuest',
    short_name: 'StoryQuest',
    description: 'Interactive STEM missions where every answer is solved from a real equation.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#f8f9ff',
    categories: ['education', 'science'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
