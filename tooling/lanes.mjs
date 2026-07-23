// Where the code lanes live ON DISK, relative to this clone.
//
// This repo AGGREGATES the lanes; it does not vendor or track them (no submodules).
// It only ever needs them on disk at generation time, to copy each lane's public
// docs into the mirror — after which everything it publishes is self-contained.
//
// Flat workspace (default): the lanes are SIBLINGS of this clone —
//   ../aevum-api  (backend)  ·  ../aevum-web  (frontend)
//
// Override per layout via env (resolved relative to the repo root) — CI checks the
// lanes out explicitly and sets AEVUM_BACKEND_DIR / AEVUM_FRONTEND_DIR to those paths.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const laneDir = (envVar, fallback) =>
  path.resolve(ROOT, process.env[envVar] || fallback);

export const LANE_DIR = {
  backend: laneDir('AEVUM_BACKEND_DIR', '../aevum-api'),
  frontend: laneDir('AEVUM_FRONTEND_DIR', '../aevum-web'),
};
