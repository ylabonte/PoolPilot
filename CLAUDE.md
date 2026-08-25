# CLAUDE.md — PoolPilot meta cockpit

This repository is the **meta cockpit**: PoolPilot's public issue tracker, plus a launcher that
clones the whole family side-by-side so you can drive it from one place. It tracks almost nothing of
its own — the real code lives in the member repos.

## First run

```bash
./bootstrap.sh          # clone the family repos side-by-side (gitignored), then vendor shared tooling
./refresh.sh --pull     # later: fast-forward default branches + re-vendor
```

`bootstrap.sh` clones these as gitignored sub-checkouts and hands off to `refresh.sh`:

| checkout | what it is |
| --- | --- |
| `poolpilot-app` | the native iOS + Android apps (drive both ProCon.IP and VIOLET controllers) |
| `poolpilot-cloud` | the backend the apps talk to |
| `poolpilot-relay` | the public self-updating Go edge agent (bridges the controllers to the apps) |
| `poolpilot-site` | the public website (poolpilot.eu) |
| `poolpilot-claude` | the canonical shared Claude tooling, vendored into the others by its `vendor.sh` |

Open `poolpilot.code-workspace` to get all of them in one editor window.

## How to work here

- **The cockpit is a launcher, not a workspace.** Do real work inside a member checkout — `cd
  poolpilot-app/` (etc.) first. A branch, a commit, or a PR belongs to one member repo.
- **Don't open a git worktree of this meta repo** — the sub-checkouts and the private rules file are
  gitignored, so they don't materialize in a fresh worktree.
- **Match repos by their `origin` remote, not by folder name**, if you also work in the older
  `~/workspace` layout — the private cockpit rules explain the trap.

Private maintainer rules (dir-name map, push discipline, intake policy) live in `CLAUDE.local.md`,
vendored here by `poolpilot-claude` and imported below when present.

@CLAUDE.local.md
