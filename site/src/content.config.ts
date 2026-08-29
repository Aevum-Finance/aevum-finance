import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// The docs live OUTSIDE the site (aevum-hub/docs/**), already mirrored into this
// repo — so the site build reads them in place and stays self-contained (CF Pages
// builds this repo alone). `base` is resolved from the project root (site/).

// T0 — product docs at `/`. README is the section index the landing replaces.
const product = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: '../docs/public' }),
});

// The ENGINEERING section. The mirror is byte-and-path-faithful, so the curated "how it
// works" docs sit where each lane files them: <lane>/public/engineering/**. Plus the
// retained-by-difference cross-cutting T1 (architecture, performance). The shallow
// per-module retellings under <lane>/public/*.md are excluded — they just re-tell T0.
// This glob is Astro's LOADER; the docs-map contract (docs/internal/docs-map.json) is the
// authority on the published set + routes — the two are kept in step by gen-docs-map's
// `--check`, and any loaded file absent from the contract is simply not routed.
const engineering = defineCollection({
  loader: glob({
    pattern: ['*/public/engineering/**/*.md', '*/architecture.md', '*/performance.md'],
    base: '../docs/internal',
  }),
});

export const collections = { product, engineering };
