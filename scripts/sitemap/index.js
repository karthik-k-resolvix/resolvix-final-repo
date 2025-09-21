// scripts/sitemap/index.js
import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";

const SITE_URL = "https://resolvix.tech";

const routes = ["/", "/about", "/contact", "/signup", "signin"];

async function generateSitemap() {
  try {
    const smStream = new SitemapStream({ hostname: SITE_URL });
    routes.forEach((route) => {
      smStream.write({ url: route, changefreq: "weekly", priority: 0.8 });
    });
    smStream.end();

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
 fs.writeFileSync(path.join(__dirname, 'dist','spa', 'sitemap.xml'), sitemap, "utf8");

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap, 'utf8');


    console.log("✅ Sitemap generated at public/sitemap.xml");
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
}

generateSitemap();
