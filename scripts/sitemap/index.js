// scripts/sitemap/index.js
import fs from "fs";
import { SitemapStream, streamToPromise } from "sitemap";

// Replace with your actual site URL
const SITE_URL = "https://resolvix.tech";

// Add all the important routes of your site here
const routes = [
  "/",             // home
  "/about",        // about page
  "/contact",      // contact page
  "/blog",         // blog listing
  "/signup",
  "/signin"
  // add more static routes here
];

async function generateSitemap() {
  try {
    // Create a sitemap stream
    const smStream = new SitemapStream({ hostname: SITE_URL });

    // Add each route to sitemap
    routes.forEach((route) => {
      smStream.write({ url: route, changefreq: "weekly", priority: 0.8 });
    });

    // Close stream
    smStream.end();

    // Convert to XML
    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

    // Save to public folder so Vercel serves it at /sitemap.xml
    fs.writeFileSync("public/sitemap.xml", sitemap, "utf8");

    console.log("✅ Sitemap generated at public/sitemap.xml");
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
}

generateSitemap();
