# MISTAKES.md — cross-repo cockpit gotchas

Running log of mistakes and their fixes — **what happened · root cause · prevention**, per the rule in `CLAUDE.md`. Newest first.

## Stacked PRs: squash-merging the base with `--delete-branch` closes the child

**What happened.** Two stacked PRs in `poolpilot-cloud`: core #177 (`feat/notifications-history` → `main`) and, on top of it, E1+E2 #178 (base `feat/notifications-history`). Merging #177 with `gh pr merge --squash --delete-branch` **auto-closed** #178 (its base branch was gone) instead of retargeting it — and the closed PR could then neither be reopened nor retargeted (`Cannot change the base branch of a closed pull request` / `Could not open the pull request`).

**Root cause.** GitHub *closes* an open PR when its base branch is deleted (it does not retarget it). Squash-merging the base also rewrites the base commits' SHAs, so the child branch keeps the now-redundant base commits and reads as `CONFLICTING`/`DIRTY` against `main`.

**Prevention / fix.**
- If a base PR has stacked children, do **not** `--delete-branch` until the children are retargeted to `main`; or merge bottom-up and retarget/rebase each child as you go.
- To recover a child after the base was squash-merged and its branch deleted:
  1. `git rebase --onto origin/main <old-base-sha> <child-branch>` — replays only the child's own commits onto the new `main`, dropping the base commits.
  2. `git push --force-with-lease origin <child-branch>:refs/heads/<child-branch>` — force-updating a *feature* branch after a rebase is fine (never `main`).
  3. Open a **fresh** PR against `main` (a closed PR whose base was deleted cannot be reopened). CI re-runs on the new head; set `--auto` merge to land it on green.

## Go worktrees outside the workspace `go.work` produce spurious IDE errors

**What happened.** Editing `poolpilot-cloud` in a `git worktree` placed *outside* the meta workspace (to avoid the harness edit-guard) made gopls/IDE report a flood of `undefined: …` and `use of internal package … not allowed` errors — even on pre-existing, untouched symbols like `h.enroll`/`Throttle`.

**Root cause.** The worktree path isn't listed in the meta `go.work`, so gopls treats each file as outside the module and can't resolve the module's own packages. It's an editor/workspace artifact, not a compile error.

**Prevention.** Trust the CLI: `go build ./...` / `go vet ./...` / `go test ./...` in the worktree are authoritative. Don't chase these diagnostics; verify with the CLI before believing an "undefined symbol" report on a worktree outside `go.work`.

## Subagents time out on `xcodebuild test` and stop mid-run without committing

**What happened.** An implementer subagent ran `xcodebuild test` (~10+ min); the command exceeded the tool timeout / the agent's turn ended while it ran, so the agent reported "waiting on the build" and stopped **without committing** — twice.

**Root cause.** A single `xcodebuild test` on the iOS app is longer than a comfortable tool-call budget, so the result never lands inside one turn.

**Prevention.** For a subagent that must commit, split the gate: run `xcodebuild build` (compile) locally to confirm it compiles + commit, and let the **PR's CI** run the full `xcodebuild test` suite. Only insist on a local `xcodebuild test` when there is no CI backstop.
