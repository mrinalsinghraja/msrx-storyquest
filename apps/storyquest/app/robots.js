import { canonical } from '../lib/site';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: canonical('/sitemap.xml'),
  };
}
