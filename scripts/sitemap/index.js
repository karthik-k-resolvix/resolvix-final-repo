import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://resolvix.tech/</loc></url>
  <url><loc>https://resolvix.tech/pricing</loc></url>
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../../public', 'sitemap.xml'), sitemap, 'utf8');
  console.log('✅ Sitemap generated');
}
