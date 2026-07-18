import { curriculum } from '../lib/curriculum';
import { canonical } from '../lib/site';

const lastModified = new Date('2026-07-18');

export default function sitemap() {
  const pages = ['', '/missions', '/faq', '/privacy', '/terms'].map((path) => ({
    url: canonical(path),
    lastModified,
    changeFrequency: path === '/missions' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  // The missions are the content. Leaving them out of the sitemap hid 100 of
  // the site's 105 indexable pages.
  const missions = curriculum.map((mission) => ({
    url: canonical(`/missions/${mission.id}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...pages, ...missions];
}
