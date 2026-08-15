#!/usr/bin/env bash
#
# refresh.sh — keep the cockpit's sub-checkouts and vendored tooling current.
#
# With --pull, fast-forwards each checkout's default branch (only when it's checked out and the tree
# is clean — never touches a feature branch or dirty work). Then, if poolpilot-claude is present,
# runs its vendor.sh to refresh the shared Claude tooling into every family checkout. A no-op if
# poolpilot-claude isn't cloned (e.g. no access) — the cockpit still works.
#
#   ./refresh.sh            just vendor the shared tooling
#   ./refresh.sh --pull     fast-forward default branches first, then vendor
#   ./refresh.sh --check    pass through to vendor.sh --check (drift alarm, no writes)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

DO_PULL=0
for arg in "$@"; do [ "$arg" = "--pull" ] && DO_PULL=1; done

if [ "$DO_PULL" = 1 ]; then
  for d in */; do
    d="${d%/}"
    [ -d "$d/.git" ] || continue
    def="$(git -C "$d" symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')"
    [ -n "$def" ] || def=main
    cur="$(git -C "$d" rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
    if [ "$cur" != "$def" ]; then
      echo "  ~ $d on '$cur' (not '$def') — skipping pull."
    elif [ -n "$(git -C "$d" status --porcelain 2>/dev/null)" ]; then
      echo "  ~ $d has local changes — skipping pull."
    elif git -C "$d" pull -q --ff-only origin "$def" 2>/dev/null; then
      echo "  = $d fast-forwarded ($def)"
    else
      echo "  ~ $d — no fast-forward available (diverged?), left as-is."
    fi
  done
fi

if [ -x poolpilot-claude/vendor.sh ]; then
  echo "vendoring shared Claude tooling ..."
  poolpilot-claude/vendor.sh "$@"
else
  echo "poolpilot-claude/vendor.sh not present — skipping vendor step (cockpit still works)."
fi
