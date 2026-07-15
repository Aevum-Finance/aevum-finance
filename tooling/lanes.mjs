// Where the code lanes live ON DISK, relative to this superproject clone.
//
// Flat workspace (default): the lanes are SIBLINGS of the aevum-finance clone —
//   ../aevum-api  (the "backend" gitlink)  ·  ../aevum-web  (the "frontend" gitlink)
// while the superproject keeps its submodule gitlink PATHS as backend/frontend, so
// the published doc links in aevum-stats.json / METRICS.md still resolve on GitHub.
//
// Override per layout via env (resolved relative to the repo root) — e.g. a nested
// submodule checkout would set AEVUM_BACKEND_DIR=backend, AEVUM_FRONTEND_DIR=frontend.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const laneDir = (envVar, fallback) =>
  path.resolve(ROOT, process.env[envVar] || fallback);

export const LANE_DIR = {
  backend: laneDir('AEVUM_BACKEND_DIR', '../aevum-api'),
  frontend: laneDir('AEVUM_FRONTEND_DIR', '../aevum-web'),
};
