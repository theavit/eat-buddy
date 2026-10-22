import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Writes robots.txt and sitemap.xml for search engines, pointed at VITE_SITE_URL.
function searchEngineFiles(siteUrl) {
  return {
    name: "search-engine-files",
    apply: "build",
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          "  <url>",
          `    <loc>${siteUrl}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          "  </url>",
          "</urlset>",
          "",
        ].join("\n"),
      });
    },
  };
}

// Relative base so the built site works from any host or sub-path.
export default defineConfig(({ mode }) => {
  const siteUrl = loadEnv(mode, process.cwd(), "VITE_").VITE_SITE_URL.replace(/\/$/, "");
  return {
    plugins: [react(), searchEngineFiles(siteUrl)],
    base: "./",
  };
});
