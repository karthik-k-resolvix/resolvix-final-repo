import fs from 'fs';
import path from 'path';

export default async function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://resolvix.tech/</loc></url>
  <url><loc>https://resolvix.tech/pricing</loc></url>
</urlset>`;

  const projectRoot = process.cwd();
  const publicDir = path.join(projectRoot, 'public');

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

  console.log('✅ Sitemap generated at public/sitemap.xml');
}
