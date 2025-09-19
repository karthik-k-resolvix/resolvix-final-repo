/**
 * index.js
 *
 * Usage:
 *   node index.js
 *
 * Config via environment variables:
 *   DOMAIN         e.g. "https://example.com"  (required)
 *   START_PATH     e.g. "/"                    (optional, default "/")
 *   MAX_PAGES      e.g. 1000                   (optional, default 200)
 *   CONCURRENCY    e.g. 5                      (optional, default 5)
 *   OUTPUT_PATH    e.g. "./public/sitemap.xml" (optional, default "./sitemap.xml")
 *   PING_ENGINES   "true" / "false"            (optional, default true)
 */

const axios = require("axios");
const cheerio = require("cheerio");
const pLimit = require("p-limit");
const robotsParser = require("robots-parser");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const DOMAIN = (process.env.DOMAIN || "").replace(/\/$/, "");

if (!DOMAIN) {
  console.error("Error: set DOMAIN env variable, e.g. DOMAIN=https://example.com");
  process.exit(1);
}
const START_PATH = process.env.START_PATH || "/";
const MAX_PAGES = parseInt(process.env.MAX_PAGES || "200", 10);
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "5", 10);
const OUTPUT_PATH = process.env.OUTPUT_PATH || "./public/sitemap.xml";
const PING_ENGINES = process.env.PING_ENGINES !== "false";

const USER_AGENT = "AutoSitemapCrawlerBot/1.0 (+https://yourdomain.example/)";

function normalizeUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    // strip hash
    u.hash = "";
    // optional: remove trailing slash (keep consistent)
    if (u.pathname !== "/" && u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch (err) {
    return null;
  }
}

async function fetchRobotsTxt(domain) {
  try {
    const robotsUrl = new URL("/robots.txt", domain).toString();
    const res = await axios.get(robotsUrl, { headers: { "User-Agent": USER_AGENT }, timeout: 8000 });
    return robotsParser(robotsUrl, res.data);
  } catch (err) {
    // If robots unavailable, return permissive parser that allows everything
    return robotsParser(new URL("/robots.txt", domain).toString(), "");
  }
}

async function crawl() {
  const baseUrl = DOMAIN;
  const robots = await fetchRobotsTxt(baseUrl);

  const toVisit = [];
  const visited = new Set();
  const results = new Map(); // url -> lastmod(ISO)

  const startUrl = normalizeUrl(new URL(START_PATH, baseUrl).toString());
  if (!startUrl) throw new Error("Invalid start URL");

  toVisit.push(startUrl);
  visited.add(startUrl);

  const limit = pLimit(CONCURRENCY);

  async function processUrl(url) {
    // respect robots
    if (!robots.isAllowed(url, USER_AGENT)) {
      // console.log(`Disallowed by robots: ${url}`);
      return;
    }

    try {
      const res = await axios.get(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
        timeout: 10000,
        maxRedirects: 5
      });

      // record lastmod (use server date if available or now)
      let lastmod;
      if (res.headers["last-modified"]) {
        lastmod = new Date(res.headers["last-modified"]).toISOString();
      } else {
        lastmod = new Date().toISOString();
      }
      results.set(url, lastmod);

      // Only parse HTML for links if content-type is html
      const contentType = (res.headers["content-type"] || "").toLowerCase();
      if (!contentType.includes("text/html")) return;

      const $ = cheerio.load(res.data);

      // extract <a href>
      $("a[href]").each((i, el) => {
        let href = $(el).attr("href").split("#")[0].trim();
        if (!href) return;

        // ignore mailto:, tel:, javascript:
        if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return;

        try {
          // resolve relative URLs
          const absolute = new URL(href, url).toString();
          const normalized = normalizeUrl(absolute);
          if (!normalized) return;

          // only same-origin (same host) - keep on site
          if (new URL(normalized).origin !== new URL(baseUrl).origin) return;

          if (!visited.has(normalized) && results.size + toVisit.length < MAX_PAGES) {
            visited.add(normalized);
            toVisit.push(normalized);
          }
        } catch (err) {
          // ignore parse errors
        }
      });
    } catch (err) {
      // non-fatal; record page but not lastmod
      // console.warn(`Failed to fetch ${url}: ${err.message}`);
    }
  }

  const workers = [];
  while (toVisit.length > 0 && results.size < MAX_PAGES) {
    // pop next
    const next = toVisit.shift();
    // start limited worker
    const w = limit(() => processUrl(next));
    workers.push(w);
    // throttle: don't spawn too many promises unawaited
    if (workers.length > MAX_PAGES * 2) await Promise.all(workers.splice(0));
  }

  // wait for all workers
  await Promise.all(workers);

  // If results < visited (some pages might have failed fetch), include visited pages with now()
  for (const url of visited) {
    if (!results.has(url) && results.size < MAX_PAGES) results.set(url, new Date().toISOString());
  }

  return Array.from(results.entries()).map(([loc, lastmod]) => ({ loc, lastmod }));
}

function buildSitemapXml(entries) {
  // simple xml generation
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const footer = "</urlset>\n";

  const body = entries.map(e => {
    // priority heuristic: root = 1.0, others 0.8
    const priority = (e.loc === DOMAIN || e.loc === normalizeUrl(new URL("/", DOMAIN).toString())) ? "1.0" : "0.8";
    return `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }).join("");

  return header + body + footer;
}

async function pingSitemap(sitemapUrl) {
  try {
    const google = `http://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bing = `http://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    await axios.get(google, { timeout: 8000 });
    await axios.get(bing, { timeout: 8000 });
    console.log("Pinged Google & Bing for sitemap:", sitemapUrl);
  } catch (err) {
    console.warn("Error pinging search engines (non-fatal):", err.message);
  }
}

(async function main() {
  try {
    console.log(`Starting crawl on: ${DOMAIN} (start ${START_PATH})`);
    const entries = await crawl();
    console.log(`Collected ${entries.length} URLs (capped at ${MAX_PAGES})`);

    const xml = buildSitemapXml(entries);

    // ensure output dir exists
    const outDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(OUTPUT_PATH, xml, "utf8");
    console.log("Sitemap generated at", OUTPUT_PATH);

    // ping search engines if enabled
    if (PING_ENGINES) {
      // sitemap must be served publicly - try to form the public URL
      // If OUTPUT_PATH is inside your public folder served at DOMAIN, this should be correct.
      // You may want to set SITEMAP_URL env var if different.
      const SITEMAP_URL = process.env.SITEMAP_URL || new URL(path.basename(OUTPUT_PATH), DOMAIN).toString();
      await pingSitemap(SITEMAP_URL);
    }

  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
})();
