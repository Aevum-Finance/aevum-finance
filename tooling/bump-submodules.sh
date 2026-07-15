#!/usr/bin/env bash
# Bump aevum-finance's submodule pointers from the FLAT sibling clones — no
# nested checkout needed (the submodules stay deinit'd in this workspace).
#
#   gitlink "backend"  <-  ../aevum-api
#   gitlink "frontend" <-  ../aevum-web
#
# Run from anywhere in the superproject:
#   npm run bump            (from tooling/)
#   bash tooling/bump-submodules.sh
# Then review `git diff --cached`, commit, and push.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

sibling() { case "$1" in
  backend)  echo ../aevum-api ;;
  frontend) echo ../aevum-web ;;
  *) return 1 ;;
esac; }

changed=0
for gitlink in backend frontend; do
  sib="$(sibling "$gitlink")"
  [ -d "$sib/.git" ] || { echo "!! missing sibling clone: $sib" >&2; exit 1; }
  sha="$(git -C "$sib" rev-parse HEAD)"
  # Guard: don't pin a commit that isn't on the lane's origin.
  if ! git -C "$sib" merge-base --is-ancestor "$sha" '@{upstream}' 2>/dev/null; then
    echo "!! WARNING: $sib HEAD ${sha:0:7} is not on origin — push it before committing the bump." >&2
  fi
  cur="$(git rev-parse ":$gitlink" 2>/dev/null || echo none)"
  if [ "$cur" = "$sha" ]; then
    echo "  $gitlink already at ${sha:0:7} (no change)"
  else
    git update-index --add --cacheinfo "160000,$sha,$gitlink"
    echo "  $gitlink  ${cur:0:7} -> ${sha:0:7}   (from $(basename "$sib"))"
    changed=1
  fi
done

[ "$changed" -eq 1 ] \
  && echo "Staged pointer bump(s). Review: git diff --cached ; then commit + push." \
  || echo "Pointers already current — nothing staged."
