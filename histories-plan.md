# Git history reconciliation plan — KCW mainsite

**Created:** 2026-11-08  
**Repository:** `kemptvillecw/mainsite`  
**Status:** PLAN ONLY — no history reconciliation, temporary branches, merges, resets, or application-code changes have been executed under this plan.

## 1. Goal

Make the production `main` history an ancestor of development `dev`, while preserving the exact approved development file contents and keeping production `main` unchanged. This should simplify future merges and pull-request reviews without prematurely releasing the Contests feature.

This is a **history reconciliation**, not a request to make `dev` identical to `main`.

**Required final state:**
- `mainsite:main`: **unchanged commit SHA** throughout and after the operation; no pushes, merges, resets, or Actions deliberately triggered against it.
- `mainsite:dev`: still has all production files, the complete unreleased Contests implementation, `cleanup-plan.md`, and this `histories-plan.md`, with no unrelated content changes.
- `mainsite:uat`: unchanged.
- `kemptvillecw/dev:main`: no independent preservation requirement. It is a deployment mirror of `mainsite:dev` and is expected to synchronize automatically, with CNAME and event-share hostname substitutions.

**Caution:** Zero risk cannot be guaranteed in advance. Do a read-only merge feasibility assessment first, and require explicit validation before updating `mainsite:dev`.

## 2. Verified baseline

Most recent recorded branch heads **before creating this document**:

| Branch | Commit |
|---|---|
| `mainsite:main` | `91af77ca6cf0b413f54b185645865a7a3d3d145a` |
| `mainsite:dev` | `43c5e92aa364c0c102d89088e8590d300f66fb38` |

**Refresh both heads before any assessment or execution.** Creating this plan on `dev` will itself create a new commit and trigger the existing dev-site mirror Action. Never use the historical values above as an update lease without rechecking.

At the most recent complete Git-tree comparison:
- Dev had `cleanup-plan.md`, the three Contests-only files (`contests.html`, `scripts/contests.js`, `styles/contests.css`), and 14 changed shared files attributable to Contests navigation, metadata, filtering and layout.
- Main had **zero exclusive files** and **zero unrelated shared-file content differences**.
- The obsolete `code-of-conduct.html` and `group-rules.html` redirects were deleted from Dev.
- The four previously Dev-only event-sharing pages were copied to Main and verified identical.
- A new `histories-plan.md` is expected to be Dev-only once this plan is committed.
- These facts describe **tracked file contents**, not equivalent histories.

Current expected relationship for file contents: **Dev = Main + Contests + `cleanup-plan.md` + `histories-plan.md`.** Confirm again at execution time.

## 3. Why reconcile the history?

The two branches were updated independently. Git's three-way merge uses common ancestry, so an apparent small current file diff does not guarantee a conflict-free future merge. Reconciliation aims to:
- Record that current production work is already accounted for in development.
- Reduce misleading old differences in future PRs.
- Avoid repeating manual conflict resolution over the same historical divergence.
- Keep emergency production fixes flowing back into development.

**Important:** A normal merge of `main` into `dev` may conflict despite nearly identical tips; identical file contents do not guarantee an automatic merge. A merge may also propose changes or deletions that must be rejected unless approved.

## 4. Mandatory constraints / safety gates

1. **Never write to `main`** as part of this plan, including through any bot, merge, branch protection change, or deployment action. Recheck `main` SHA before and after each consequential stage.
2. **Never force-push, reset, rebase, or delete `main`, `dev`, or `uat`**. The active `Protect Branches` ruleset blocks deletion and non-fast-forward changes on these branches.
3. **Never merge all of `dev` into `main` now**: that would publish unreleased Contests and documentation.
4. Do not push a trial merge to `dev`; run the feasibility assessment in a disposable local worktree or temporary branch that does **not** activate the `dev` synchronization workflow.
5. Before any write to `dev`, capture exact original SHAs and a recoverable reference, and determine whether any new commits landed since the audit.
6. Preserve the **entire tree** of `dev`, not merely three Contests-only files; the 14 Contests-related edits to existing files are equally important.
7. If the merge result differs unexpectedly, **stop**. Do not resolve by blindly choosing "ours" or "theirs" for all paths.
8. Updating `mainsite:dev` triggers the existing mirror workflow to `kemptvillecw/dev:main`. This is expected and acceptable; the mirror is not independently authoritative.
9. A passed Git comparison is not a substitute for application tests or a production URL check.
10. Treat an unexpected change to `main`'s SHA as a **hard stop**, regardless of whether the new code looks harmless.

## 5. Phase H1 — read-only merge assessment (no repository writes)

- [ ] Record updated exact SHAs for `main` and `dev`.
- [ ] Fetch both full commit histories and locate the common merge base.
- [ ] Compare tree/path/blob SHA sets; generate a complete expected-difference manifest.
- [ ] Verify all Dev-only files (including both Markdown plans) and all 14 Contests-related shared-file edits.
- [ ] Inspect historical changes and any merge-base-sensitive deletions that a three-way merge could reintroduce.
- [ ] Determine whether a normal `main` -> `dev` merge is conflict-free; do not infer this from tip comparisons.
- [ ] Create a trial merged tree locally **without pushing**. If tooling cannot safely produce a trial merged tree, record that the merge is **not yet verified** and stop before Phase H2.
- [ ] Enumerate every conflict and its proposed resolution.
- [ ] Verify trial tree is byte-for-byte identical to the intended current Dev tree before any implementation, including binary files and hidden files.
- [ ] Run available tests on the trial result. Inspect calendar/next-meeting, event metadata, Contests page, navigation, event-share pages and images.
- [ ] Confirm `main` SHA remains unchanged.
- [ ] Produce a short written assessment: merge base, conflicts, proposed merge result, test results, and any blockers.

**Gate to proceed:** No unexpected file changes; Contests fully retained; `main` untouched. Otherwise stop and revise the approach.

## 6. Phase H2 — controlled reconciliation (requires separate approval)

- [ ] Refresh and compare current branch heads to the audited SHAs; if changed, repeat H1.
- [ ] Create a named, recoverable checkpoint/reference to original Dev state; do not move existing protected branch pointers.
- [ ] Create a temporary reconciliation branch starting from the **current** Dev head.
- [ ] Merge current Main into that temporary branch using a normal merge commit (two parents) where possible; resolve only verified conflicts.
- [ ] Preserve Dev's file tree exactly; this operation is intended to change ancestry, not deployed source content.
- [ ] Review the resulting merge commit's parents and full Git tree SHA. Require the result's tree to equal the pre-merge Dev tree; any permitted exception must be explicitly documented and approved.
- [ ] Run tests and review PR/diff. The PR should not target `main`.
- [ ] Verify Main SHA is still the same as the recorded protected snapshot.
- [ ] Advance `dev` only by an approved **fast-forward** to the validated reconciliation commit, using a checked expected head SHA (or equivalent safe lease). If connector/UI constraints cannot guarantee this, stop and use an authorized, reviewable process instead.
- [ ] Let the existing Dev mirror sync run; do not preserve independent edits in `kemptvillecw/dev`.
- [ ] Verify `main` unchanged, `dev` contents and Contests retained, and mirror status.
- [ ] Do not modify `uat`.

**Rollback strategy:** If a temporary-branch trial fails, abandon it; original branches remain untouched. If Dev has already advanced, do not force-rewind protected history. Investigate and use a reviewed forward-fix or approved recovery procedure based on the saved original commit and exact file-tree comparisons. Never promise a force-reset rollback.

## 7. Acceptance checklist

- [ ] `main` HEAD after = `main` HEAD before, exactly.
- [ ] `uat` HEAD after = `uat` HEAD before, exactly.
- [ ] `dev` new merge commit descends from both old Dev and current Main.
- [ ] `dev` full Git tree SHA after reconciliation equals its tree SHA before reconciliation.
- [ ] All three Contests-only files remain.
- [ ] All 14 Contests-related shared-file edits remain.
- [ ] Both planning documents remain.
- [ ] The four event share pages remain and match Main.
- [ ] No obsolete legacy rule pages reappear.
- [ ] All relevant automated tests and manual spot checks pass.
- [ ] No uncontrolled production deployment occurred.
- [ ] The development mirror sync behaves as intended.
- [ ] The work is documented with the merge/PR reference and final SHAs.

## 8. Future workflow recommendations

- Use `main` strictly for released production content and `dev` for unfinished features.
- Prefer small PRs for feature work and controlled release PRs.
- Bring urgent fixes made on Main back into Dev promptly, using reviewed merges/cherry-picks according to context.
- Avoid treating `kemptvillecw/dev:main` as an independently editable source branch; it is a generated deployment mirror.
- Revisit `uat` separately after this history reconciliation; do not fold it into this operation.
- Before a Contests release, explicitly decide whether planning documents should be published on Main and keep other unfinished features out of the release.

## 9. Current execution decision

**Only this plan is authorized now.** Do not start H2 merely because this Markdown file exists. Next action is **Phase H1: read-only merge assessment**, followed by review of concrete merge results and explicit approval before changing `mainsite:dev` history.
