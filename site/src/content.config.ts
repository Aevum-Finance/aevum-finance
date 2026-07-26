import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// The docs live OUTSIDE the site (aevum-finance/docs/**), already mirrored into this
// repo — so the site build reads them in place and stays self-contained (CF Pages
// builds this repo alone). `base` is resolved from the project root (site/).

// T0 — product docs at `/`. README is the section index the landing replaces.
const product = defineCollection({
  loader: glob({ pattern: ['*.md', '!README.md'], base: '../docs/public' }),
});

// T1 — the mirrored lane docs at `/engineering`. MIRROR.md is a private-SHA
// provenance table (D3): kept in the repo, never a route.
const engineering = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!MIRROR.md'], base: '../docs/internal' }),
});

export const collections = { product, engineering };
