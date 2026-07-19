import { curriculum } from '../lib/curriculum';
import { canonical } from '../lib/site';
import { CHAPTERS, DISCIPLINES, chapterSlug } from '../lib/taxonomy';

const lastModified = new Date('2026-07-19');

export default function sitemap() {
  const pages = ['', '/learn', '/faq', '/privacy', '/terms'].map((path) => ({
    url: canonical(path),
    lastModified,
    changeFrequency: path === '/learn' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const disciplines = Object.keys(DISCIPLINES).map((discipline) => ({
    url: canonical(`/learn/${discipline}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const chapters = Object.entries(CHAPTERS).map(([id, chapter]) => ({
    url: canonical(`/learn/${chapter.discipline}/${chapterSlug(id)}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // The simulators are the content. Leaving them out hid the bulk of the site's
  // indexable pages. The legacy `/missions/*` URLs are deliberately absent —
  // they redirect to these, and a sitemap should only list canonical targets.
  const simulators = curriculum.map((mission) => ({
    url: canonical(mission.path),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pages, ...disciplines, ...chapters, ...simulators];
}
