#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const problems = [];

function readProjectFile(path) {
  return readFileSync(resolve(ROOT, path), 'utf8');
}

function expect(name, condition) {
  if (!condition) problems.push(name);
}

const robots = readProjectFile('public/robots.txt');
expect('robots.txt must disallow /admin/', /^Disallow:\s*\/admin\/\s*$/m.test(robots));
expect('robots.txt must advertise the sitemap index', /^Sitemap:\s*https:\/\/quidproquo\.cc\/sitemap-index\.xml\s*$/m.test(robots));

const astroConfig = readProjectFile('astro.config.mjs');
expect('sitemap filter must exclude /admin', astroConfig.includes("pathname !== '/admin'"));
expect('sitemap filter must exclude /admin/...', astroConfig.includes("!pathname.startsWith('/admin/')"));
expect('sitemap integration must use the public-page filter', /sitemap\(\{\s*filter:\s*isPublicSitemapPage,\s*\}\)/s.test(astroConfig));

const postPage = readProjectFile('src/pages/posts/[...slug].astro');
expect('post page must normalize Astro.site before URL composition', postPage.includes("Astro.site?.toString().replace(/\\/$/, '')"));
expect('post OG image must use normalized siteUrl', postPage.includes("const ogImage = `${siteUrl}/og/${post.id}.png`;"));
expect('post canonical JSON-LD URL must use trailing slash', postPage.includes('const postUrl = `${siteUrl}/posts/${post.id}/`;'));
expect('English hreflang URL must use trailing slash', postPage.includes('const enHref = enId ? `${siteUrl}/posts/${enId}/` : undefined;'));
expect('Chinese hreflang URL must use trailing slash', postPage.includes('const zhHref = zhId ? `${siteUrl}/posts/${zhId}/` : undefined;'));

const postSamplePath = 'dist/client/posts/tech/2026-08-21-llms-txt/index.html';
const homePath = 'dist/client/index.html';
const sitemapPath = 'dist/client/sitemap-0.xml';

if (existsSync(resolve(ROOT, postSamplePath)) && existsSync(resolve(ROOT, homePath)) && existsSync(resolve(ROOT, sitemapPath))) {
  const post = readProjectFile(postSamplePath);
  const home = readProjectFile(homePath);
  const sitemap = readProjectFile(sitemapPath);

  expect('built sitemap must not include /admin URLs', !/https:\/\/quidproquo\.cc\/admin\/?/.test(sitemap));
  expect('built home page must include WebSite JSON-LD', home.includes('application/ld+json') && home.includes('"@type":"WebSite"'));
  expect('built post page must include BlogPosting JSON-LD', post.includes('application/ld+json') && post.includes('"@type":"BlogPosting"'));
  expect('built post page must not include double-slash OG URL', !post.includes('https://quidproquo.cc//og/'));
  expect(
    'built post page must use canonical trailing slash',
    post.includes('rel="canonical" href="https://quidproquo.cc/posts/tech/2026-08-21-llms-txt/"')
  );
}

if (problems.length > 0) {
  console.error('SEO smoke check failed:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
