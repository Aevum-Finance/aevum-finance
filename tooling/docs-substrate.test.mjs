// Durable tests for the docs-substrate tooling (toml-lite + feature-index).
// Stdlib only (node:test) — no runner dep. Run with `npm test` (from tooling/).
//
// The coverage assertion is the load-bearing safety net: it must FIRE on a
// doctored manifest, or a dropped/mis-tiered module would silently vanish from
// the product docs. These tests pin that behaviour with fixtures.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { parseToml } from './toml-lite.mjs';
import { build, CoverageError } from './feature-index.mjs';
import { assertFullHistory } from './sync-docs.mjs';

// --- toml-lite -----------------------------------------------------------

test('toml-lite: sections, strings, arrays, comments', () => {
  const t = parseToml(`
# a comment
[topics.foo]
title = "Foo"
backend = ["a", "b"]
frontend = []
`);
  assert.deepEqual(t.topics.foo, { title: 'Foo', backend: ['a', 'b'], frontend: [] });
});

test('toml-lite: quoted keys with slashes (tree annotations)', () => {
  const t = parseToml('[entries]\n"core/" = "the core"\n"main.py" = "entrypoint"\n');
  assert.deepEqual(t.entries, { 'core/': 'the core', 'main.py': 'entrypoint' });
});

test('toml-lite: throws on an unquoted value (schema drift fails loudly)', () => {
  assert.throws(() => parseToml('[x]\nk = 42\n'), /expected a quoted string/);
});

test('toml-lite: throws on an unquoted array item', () => {
  assert.throws(() => parseToml('[x]\nk = ["a", b]\n'), /quoted strings/);
});

// --- feature-index coverage ----------------------------------------------

function fixtures({ topics, backend, frontend }) {
  const dir = mkdtempSync(path.join(tmpdir(), 'feat-idx-'));
  const p = {
    topics: path.join(dir, 'product-features.toml'),
    backend: path.join(dir, 'be.toml'),
    frontend: path.join(dir, 'fe.json'),
  };
  writeFileSync(p.topics, topics);
  writeFileSync(p.backend, backend);
  writeFileSync(p.frontend, frontend);
  return p;
}

const BE = `
[modules.alpha]
tier = "user_facing"
title = "Alpha"
scope = "the alpha thing"
[modules.plumbing]
tier = "infra"
title = "Plumbing"
scope = "wiring"
`;
const FE = JSON.stringify({
  modules: { alpha: { tier: 'user_facing', title: 'Alpha', scope: 'the alpha UI' } },
});

test('feature-index: resolves a covered roster deterministically', () => {
  const paths = fixtures({
    topics: `[topics.alpha]\ntitle = "Alpha"\nblurb = "b"\nbackend = ["alpha"]\nfrontend = ["alpha"]\n`,
    backend: BE,
    frontend: FE,
  });
  const a = build(paths);
  const b = build(paths);
  assert.deepEqual(a, b, 'build must be deterministic');
  assert.equal(a.length, 1);
  assert.equal(a[0].coverage, 'both');
  assert.equal(a[0].backend[0].scope, 'the alpha thing');
});

test('feature-index: ORPHAN — a user_facing module in no topic fails', () => {
  const paths = fixtures({
    topics: `[topics.other]\ntitle = "Other"\nblurb = "b"\nbackend = []\nfrontend = []\n`,
    backend: BE,
    frontend: FE,
  });
  assert.throws(() => build(paths), (e) => e instanceof CoverageError && /in no topic/.test(e.message));
});

test('feature-index: DANGLING — a topic pointing at an infra module fails', () => {
  const paths = fixtures({
    topics: `[topics.alpha]\ntitle = "Alpha"\nblurb = "b"\nbackend = ["alpha", "plumbing"]\nfrontend = ["alpha"]\n`,
    backend: BE,
    frontend: FE,
  });
  assert.throws(() => build(paths), (e) => e instanceof CoverageError && /not user_facing/.test(e.message));
});

test('feature-index: DANGLING — a topic pointing at a missing module fails', () => {
  const paths = fixtures({
    topics: `[topics.alpha]\ntitle = "Alpha"\nblurb = "b"\nbackend = ["alpha", "ghost"]\nfrontend = ["alpha"]\n`,
    backend: BE,
    frontend: FE,
  });
  assert.throws(() => build(paths), (e) => e instanceof CoverageError && /does not exist/.test(e.message));
});

// --- mirror provenance: the shallow-clone trap ---------------------------
//
// A shallow lane clone answers "which commit last touched this file?" with HEAD,
// for every file — so the mirror's per-file provenance silently collapses to the
// lane tip. It shipped exactly once: actions/checkout defaults to fetch-depth 1,
// the fold ran green, and every stamp in the mirror was wrong. These pin BOTH the
// refusal and the underlying git behaviour that makes the refusal necessary.

function tinyRepo() {
  const dir = mkdtempSync(path.join(tmpdir(), 'lane-'));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'Test');
  writeFileSync(path.join(dir, 'first.md'), 'one\n');
  git('add', '-A');
  git('commit', '-qm', 'first');
  writeFileSync(path.join(dir, 'second.md'), 'two\n');
  git('add', '-A');
  git('commit', '-qm', 'second');
  return dir;
}

test('sync-docs: refuses to mirror a SHALLOW lane clone', () => {
  const origin = tinyRepo();
  const shallow = mkdtempSync(path.join(tmpdir(), 'shallow-'));
  const clone = path.join(shallow, 'lane');
  execFileSync('git', ['clone', '-q', '--depth', '1', `file://${origin}`, clone]);

  assert.throws(
    () => assertFullHistory({ key: 'backend', repo: 'aevum-api', dir: clone }),
    /SHALLOW clone/
  );
});

test('sync-docs: a full clone passes, and resolves per-file history', () => {
  const dir = tinyRepo();
  assert.doesNotThrow(() => assertFullHistory({ key: 'backend', repo: 'aevum-api', dir }));

  // The property the stamp depends on: the FIRST file still points at the first
  // commit, not at the tip. This is precisely what a shallow clone cannot do.
  const shaOf = (f) =>
    execFileSync('git', ['-C', dir, 'log', '-1', '--format=%H', '--', f], {
      encoding: 'utf8',
    }).trim();
  assert.notEqual(shaOf('first.md'), shaOf('second.md'));
});
