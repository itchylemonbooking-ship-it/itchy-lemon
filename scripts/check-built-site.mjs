// Static-site integrity checks. Runs after "astro build", without network access.
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const output = resolve("dist");
const siteOrigin = "https://itchylemon.com";
const routes = [
  "/",
  "/music/",
  "/bio/",
  "/discography/",
  "/press-kit/",
  "/booking/",
  "/media/",
  "/sets/",
  "/connect",
  "/privacy-policy/",
  "/epk-download/",
];

const read = (name) => readFileSync(join(output, name), "utf8");
const isFile = (path) => existsSync(path) && statSync(path).isFile();

function resolveOutputUrl(url) {
  const pathname = decodeURIComponent(new URL(url, siteOrigin).pathname);
  const path = resolve(output, pathname.replace(/^\/+/, ""));
  assert.ok(path === output || path.startsWith(output + sep), "Unsafe URL: " + url);

  const candidates = [path, join(path, "index.html"), path + ".html"];
  return candidates.some(isFile);
}

const redirects = new Set(
  read("_redirects")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/)[0])
);

for (const route of routes) {
  const file = route === "/" ? "index.html" : join(route.slice(1), "index.html");
  assert.ok(isFile(join(output, file)), "Missing route: " + route);

  const html = read(file);
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  assert.ok(canonical, "Missing canonical URL for " + route);
  assert.equal(
    new URL(canonical).origin,
    siteOrigin,
    "Wrong canonical origin for " + route
  );
  assert.equal(
    new URL(canonical).pathname.replace(/\/$/, "") || "/",
    route.replace(/\/$/, "") || "/",
    "Wrong canonical path for " + route
  );
}

const store = read("store/index.html");
assert.match(store, /<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']/i);
const headers = read("_headers");
assert.match(headers, /X-Content-Type-Options:\s*nosniff/);
assert.match(headers, /X-Frame-Options:\s*SAMEORIGIN/);
assert.match(headers, /X-Robots-Tag:\s*noindex/i);

// Guard critical HubSpot form embeds against accidental regressions.
// These are static integrity checks, not live submission tests.
for (const config of [
  {
    route: "booking",
    formVar: "bookingFormId",
    formId: "06399ad4-ccd6-4cfa-a1a0-9b7eb2d587a2",
    openMarker: "data-open-booking-modal",
    modalMarker: "data-booking-modal",
  },
  {
    route: "press-kit",
    formVar: "epkFormId",
    formId: "c48c62f5-f0b6-4153-8aaa-b4f9f4b952ab",
    openMarker: "data-open-epk-modal",
    modalMarker: "data-epk-modal",
  },
]) {
  const html = read(config.route + "/index.html");
  const source = readFileSync(
    resolve("src", "pages", config.route + ".astro"),
    "utf8"
  );
  const idAttribute = html.match(/data-form-id=["']([^"']+)["']/i)?.[1];
  const jsId = source.match(
    new RegExp("const\\s+" + config.formVar + "\\s*=\\s*[\"']([^\"']+)[\"']")
  )?.[1];

  assert.equal(idAttribute, config.formId, config.route + ": wrong embed form ID");
  assert.equal(jsId, config.formId, config.route + ": tracking form ID mismatch");
  assert.match(html, /class=["']hs-form-frame["']/i);
  assert.match(html, /data-portal-id=["']148590426["']/i);
  assert.match(html, /data-region=["']eu1["']/i);
  assert.ok(html.includes(config.openMarker), "Missing form button: " + config.route);
  assert.ok(html.includes(config.modalMarker), "Missing modal: " + config.route);
  assert.ok(
    html.includes("https://js-eu1.hsforms.net/forms/embed/148590426.js"),
    "Missing HubSpot form loader: " + config.route
  );
  assert.ok(
    source.includes("isTrustedHubSpotOrigin(event.origin)"),
    "Missing legacy callback origin check: " + config.route
  );
  assert.ok(
    source.includes("submittedFormId !== " + config.formVar),
    "Missing exact form ID validation: " + config.route
  );
  assert.ok(
    source.includes('localStorage.getItem("itchyLemonTrackingConsentV2") === "granted"'),
    "Missing Meta consent check: " + config.route
  );
}

const pressKitHtml = read("press-kit/index.html");
assert.ok(
  pressKitHtml.includes('href="/downloads/Itchy_Lemon_EPK_2026.pdf"'),
  "EPK download path missing from Press Kit"
);
assert.ok(
  pressKitHtml.includes("data-epk-download-confirmation"),
  "EPK download confirmation missing"
);
assert.ok(
  isFile(join(output, "downloads", "Itchy_Lemon_EPK_2026.pdf")),
  "EPK PDF missing from build"
);

function allHtmlFiles(dir) {
  const paths = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...allHtmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".html")) paths.push(path);
  }
  return paths;
}

const failures = [];
const htmlFiles = allHtmlFiles(output);
let checkedLinks = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const attributes = /\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi;
  for (const match of html.matchAll(attributes)) {
    const value = match[2];
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    checkedLinks += 1;

    try {
      const pathname = new URL(value, siteOrigin).pathname;
      if (!redirects.has(pathname) && !resolveOutputUrl(value)) {
        failures.push(file.replace(output + sep, "") + " → " + value);
      }
    } catch (error) {
      failures.push(file.replace(output + sep, "") + " → " + value + ": " + error.message);
    }
  }
}

assert.deepEqual(
  failures,
  [],
  "Broken internal links or missing assets:\n" + failures.join("\n")
);

console.log("Static-site audit passed: " + routes.length + " routes, " +
  htmlFiles.length + " HTML pages, " + checkedLinks + " local references.");
