#!/usr/bin/env bash
#
# bootstrap.sh — set up the PoolPilot meta cockpit.
#
# Clones the family repos side-by-side into this directory as gitignored sub-checkouts, then hands
# off to refresh.sh (which vendors the shared Claude tooling if poolpilot-claude is present). Safe to
# re-run: existing checkouts are fetched, never clobbered. Degrades gracefully — a repo you cannot
# access is skipped with a note, not a hard failure.
#
#   ./bootstrap.sh            clone/fetch everything, then refresh
#   ./bootstrap.sh --pull     also fast-forward each checkout's default branch (passed to refresh.sh)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

OWNER="ylabonte"
REPOS=(poolpilot-app poolpilot-cloud poolpilot-relay poolpilot-site poolpilot-claude)

remote_slug() {
  local url; url="$(git -C "$1" remote get-url origin 2>/dev/null || true)"
  [ -n "$url" ] || return 1
  url="${url%.git}"; url="${url#git@github.com:}"; url="${url#https://github.com/}"; url="${url#ssh://git@github.com/}"
  printf '%s' "$url" | tr '[:upper:]' '[:lower:]'
}

echo "PoolPilot cockpit bootstrap — $SCRIPT_DIR"
for name in "${REPOS[@]}"; do
  want="$OWNER/$name"
  if [ -d "$name/.git" ]; then
    have="$(remote_slug "$name" || true)"
    if [ "$have" != "$want" ]; then
      echo "  ! $name exists but origin is '${have:-none}', expected '$want' — leaving it alone."
    else
      if git -C "$name" fetch -q origin 2>/dev/null; then
        echo "  = $name (fetched)"
      else
        echo "  ! $name — fetch failed (offline or access lost), keeping local copy."
      fi
    fi
  else
    if git clone -q "git@github.com:$OWNER/$name.git" "$name" 2>/dev/null; then
      echo "  + $name (cloned)"
    else
      echo "  ! $name — clone failed (no access?), skipping. The cockpit works without it."
    fi
  fi
done

# go.work template for local multi-module Go dev (cloud consumes the relay module). Written once,
# never overwritten — it's gitignored, so your local edits are yours to keep.
if [ ! -e go.work ] && [ -d poolpilot-cloud ] && [ -d poolpilot-relay ]; then
  cat > go.work <<'GOWORK'
go 1.26

use (
	./poolpilot-cloud
	./poolpilot-relay
)
GOWORK
  echo "  + go.work (template written — cloud CI sets GOWORK=off, so this is local-only)"
fi

echo "handing off to refresh.sh ..."
exec "$SCRIPT_DIR/refresh.sh" "$@"
