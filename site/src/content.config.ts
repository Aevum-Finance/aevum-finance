import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// The docs live OUTSIDE the site (aevum-finance/docs/**), already mirrored into this
// repo — so the site build reads them in place and stays self-contained (CF Pages
// builds this repo alone). `base` is resolved from the project root (site/).

// T0 — product docs at `/`. README is the section index the landing replaces.
const product = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: '../docs/public' }),
});

// The ENGINEERING section: the curated "how it works" mechanics docs
// (engineering/<lane>/**), plus the retained-by-difference cross-cutting T1
// (architecture, performance). The shallow per-module retellings under
// <lane>/public/*.md are deliberately excluded — they just re-tell T0.
const engineering = defineCollection({
  loader: glob({
    pattern: ['engineering/**/*.md', '*/architecture.md', '*/performance.md'],
    base: '../docs/internal',
  }),
});

export const collections = { product, engineering };
