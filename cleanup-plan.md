# KCW mainsite branch cleanup and reconciliation plan

**Repository:** `kemptvillecw/mainsite`  
**Branches:** `dev`, `main` (and `uat`, reviewed separately)  
**Snapshot date:** 2026-11-08  
**Status:** Phase A/B read-only review completed for accessible repository data on 2026-11-08. This file is the consolidated plan and audited findings. Application-code changes, deletions, and release actions remain unexecuted. Updating this plan on `mainsite:dev` itself triggers its configured cross-repository synchronization workflow.

## 1. Objective and agreed decisions

Reconcile `dev` and `main` without losing production fixes or the in-progress Contests feature. The desired branch roles are:

- **`dev`:** ongoing implementation and fixes, including the Contests feature.
- **`main`:** released public website; do not promote unfinished Contests functionality.
- **`uat`:** currently has no clear working purpose. Evaluate its workflows and protections before deciding whether to retain or retire it.

The owner has explicitly decided:

1. **Preserve the entire Contests implementation on `dev`.** This includes the page, script, stylesheet, navigation entries, contest metadata, calendar filtering, and event/next-meeting exclusions. Do not inadvertently promote it to `main`.
2. **`sharing-feedback-guidelines.html` is the authoritative replacement for the earlier rules pages.**
3. **`code-of-conduct.html` and `group-rules.html` were never published or distributed and are approved for deletion from `dev`.** Their current contents are short redirects to the consolidated guidelines, but the owner confirms no public compatibility requirement. Deletion belongs in Phase C, not the audit.
4. **Do not rewrite or reset either branch to match the other.** Assess changes by file and purpose, and inspect Actions before any synchronization.

## 2. Evidence and limitations

GitHub's commit comparison on the snapshot date reported:

| Comparison | Ahead / behind | Interpretation |
|---|---:|---|
| `main...dev` | dev ahead 55, behind 69 | Both branches have independent commit history |
| `main...uat` | uat ahead 2, behind 44 | UAT is also divergent |
| `uat...dev` | dev ahead 55, behind 27 | UAT is not simply a copy of dev |

**Caution:** ahead/behind counts are *commit history*, not counts of missing features. GitHub's comparison file list can show historical additions even when the file exists in both current tips. We verified representative current files with branch-specific GitHub file reads and SHA comparisons. A complete recursive tree inventory and workflow audit are still needed before declaring the repository fully identical outside specified exceptions.

Useful comparisons:
- https://github.com/kemptvillecw/mainsite/compare/main...dev
- https://github.com/kemptvillecw/mainsite/compare/dev...main
- https://github.com/kemptvillecw/mainsite/compare/main...uat

## 3. Current verified content differences: `dev` versus `main`

### 3.1 Contests implementation — **KEEP on dev; do not yet release**

| Path(s) | Current difference | Decision |
|---|---|---|
| `contests.html` | Exists on dev only | Keep on dev |
| `scripts/contests.js` | Exists on dev only | Keep on dev |
| `styles/contests.css` | Exists on dev only | Keep on dev |
| `scripts/event-description.js` | Dev adds 21 contest metadata string keys to the accepted metadata fields | Keep dev version |
| `scripts/calendar.js` | Dev recognizes contest pages, filters by metadata type, changes labels and empty/loading messages for contests, and excludes contests from regular schedule listings | Keep dev behavior; regression test regular schedule |
| `scripts/events.js` | Dev skips events whose metadata type denotes a contest | Keep; regression test featured/regular event listing |
| `scripts/next-meeting.js` | Dev excludes contests from next-meeting selection | Keep; regression test meeting selection |
| `styles/styles.css` | Dev adds responsive spacing rules for header/navigation at 701–1080px | Keep as support for the expanded Contests navigation |
| Multiple HTML site pages listed below | Dev adds a Contests link in both header and footer (where applicable) | Keep on dev; do not copy blindly into main until feature release |

The following shared HTML files were checked and differ only by the added `<a href="contests.html">Contests</a>` navigation entries:
- `about.html`
- `archive.html`
- `browse.html`
- `contact.html`
- `content.html`
- `index.html`
- `privacy.html`
- `schedule.html`
- `sharing-feedback-guidelines.html`

The `scripts/event-description.js` contest-specific metadata additions are:
`contestOrganizer`, `contestEligibility`, `contestRegion`, `contestOpenDate`,
`contestDeadline`, `contestDeadlineTime`, `contestDeadlineTimezone`,
`contestAnnouncementDate`, `contestUrl`, `contestTermsUrl`, `contestEntryFee`,
`contestPrize`, `contestForm`, `contestGenres`, `contestLengthLimit`,
`contestPublicationPolicy`, `contestAiPolicy`, `contestRestrictions`,
`contestVerifiedAt`, `contestLanguage`.

**Important:** `main` and `dev` both include `unfoldWrappedMetadataJson()`, which attempts to repair newline-damaged JSON string values in the calendar metadata. This logic is **not** a reason to overwrite `dev`; `dev` already preserves it. `uat` lacks that repair in the inspected snapshot.

### 3.2 Obsolete legacy rules pages — **APPROVED FOR DELETION IN PHASE C**

| Path | Dev | Main | Decision |
|---|---|---|---|
| `code-of-conduct.html` | Exists | Not found | Approved: delete from dev in Phase C |
| `group-rules.html` | Exists | Not found | Approved: delete from dev in Phase C |
| `sharing-feedback-guidelines.html` | Exists | Exists | Keep; same guidelines/content across branches, aside from Contests navigation on dev |

Before deleting, check for internal references and verify the consolidated page remains authoritative. The owner confirms these two old URLs were not made public: no redirect-retention requirement. The redirect stubs may be deleted in Phase C.

### 3.3 Four generated event-sharing pages — **REVIEW before removal or promotion**

These files were found on `dev` but not `main` in branch-specific file reads:

| Path | Observed page title |
|---|---|
| `share/events/66okirl57k99ubapgnmpab7re4_20261116T230000Z.html` | KCW Meet-up (Nov 16, 2026) |
| `share/events/66okirl57k99ubapgnmpab7re4_20261123T230000Z.html` | KCW Meet-up (Nov 23, 2026) |
| `share/events/iob2qjmi973us6lvl20atf00hg.html` | Lis Angus: Short Stories |
| `share/events/sfkmdg8v96cjfp2k1deeinra1s.html` | Kimberly Lemaire — Prepare to interview |

These are event-sharing pages, **not Contests files**. They appear generated and may be updated by automation. Their retention policy has **not** been decided. Check the generation/promotion workflow, whether public links depend on them, and whether current events should publish identical versions to both branches. Do not delete them simply to make the branch diff shorter.

### 3.4 Shared files verified identical

The following were explicitly compared by current GitHub blob SHA and were identical on `dev` and `main`:

- `confirm/index.html`
- `preferences/index.html`
- `fb_automation_privacy.html`
- `unsubscribe/index.html`
- `scripts/metadata-wrap.test.cjs`

The specific calendar event image `images/event_17941072041741938843833.jpg` has been previously added to both branches (and UAT), but a fresh binary SHA/tree comparison should still be included in the final full-tree audit. GitHub's commit comparison reports this image as historically added; that by itself does not mean it exists on only one current branch.

### 3.5 What has *not* yet been proven

- A full recursive file-tree comparison of **every** path and blob SHA for both branch tips, including binary/generated files, `.github/workflows`, hidden files, and metadata.
- Whether any historical-only differences are absent from the current tip comparisons.
- Whether production edits exist in other files outside the already reviewed difference set.
- Actual GitHub Actions triggers, permissions, deployment destinations, commit targets and branch protection settings.

Thus, **"everything except Contests matches" is not yet certified**. For the inspected common text files, the remaining differences are Contests-related; the known exceptions are the obsolete pages and four generated event pages.

## 4. Current recommendations / disposition matrix

| Category | Recommendation | Priority |
|---|---|---|
| Contests files and associated edits | Preserve unchanged on dev; test together as one feature set | Must keep |
| Consolidated sharing/feedback guidelines | Preserve as single authoritative page | Must keep |
| Obsolete `code-of-conduct.html` and `group-rules.html` | Remove from dev after checking links / redirect strategy | Planned cleanup |
| Four event-sharing pages | Inspect generator and active links; decide whether to retain, regenerate or promote | Unresolved |
| Wrapped-metadata JSON repair | Preserve the repair already present in main and dev | Must keep |
| Main production fixes | Keep; ensure future dev reconciliation contains all legitimate fixes | Must keep |
| UAT branch | No automatic deletion; decide after Actions/deployment audit | Unresolved |
| GitHub Actions | Read and review before merges or any branch rewrite | Blocking prerequisite |

## 5. GitHub Actions and deployment audit — required before changing branch relationships

**Update:** The subsequent Phase A/B audit did successfully inspect the two workflow files, active repository ruleset, and relevant recent Actions runs. Findings are recorded in Section 9 below. Some GitHub Pages settings and classic protection endpoints remain inaccessible.

For each file under `.github/workflows/`, document:

1. **Trigger:** `push`, `pull_request`, `workflow_dispatch`, schedule, and any `workflow_run` chains; branch/path filters.
2. **Read/write permissions:** `contents: write`, PAT versus `GITHUB_TOKEN`, environment secrets, cross-repository credentials.
3. **Checkout ref and write target:** branch checked out; explicit `git push` target; force push; branch creation; bot-generated commits.
4. **Deployment destination:** dev vs production URL, Pages configuration, and whether publication is bound to a branch or artifact.
5. **Generation/promotion rules:** calendar images, event share pages, content projection, and any script that copies files between branches.
6. **Protection checks:** required reviews/status checks, "Protect Branches" logic, bypass permissions and how workflows behave when blocked.
7. **Loop and race risks:** bot commits triggering other workflows, parallel runs overwriting each other, stale checkout pushing over new changes.
8. **Failure behavior:** partial artifact publication, retries, dry-run availability and rollback path.

Produce a workflow matrix: `workflow | trigger | reads from | writes to | destination | permissions | risks | recommended fix`.

**Do not** disable protections or run an Actions workflow just to test without understanding its downstream effects.

## 6. Proposed safe execution sequence

### Phase A — freeze the baseline and inventory (read-only; audited findings in Section 9)

- [ ] Record exact `main`, `dev`, and `uat` commit SHAs before starting.
- [ ] Export complete recursive tree listings for `main` and `dev`: path, file type, blob SHA; compare sets and contents.
- [ ] Include hidden files, binary image paths, generated `share/events` pages and `.github/workflows`.
- [ ] Categorize each true tip-of-branch difference as Contests, obsolete rules, generated content, legitimate production fix, or unknown.
- [ ] Check links to obsolete pages and sharing-page content.
- [ ] Audit GitHub Actions and branch protections and record observed behavior; do not trigger deployments.

### Phase B — resolve questions and make a change plan (decision log in Section 9)

- [x] Owner explicitly approved deleting both obsolete rules redirect pages; no public legacy-link requirement.
- [ ] Decide fate/owner of four generated event-sharing pages.
- [ ] Confirm that Dev Contests changes remain isolated from public production.
- [ ] Identify any legitimate non-Contests change on main missing from dev in the full-tree comparison.
- [ ] Record keep-main / keep-dev / combine / retire decisions for all unresolved differences.

### Phase C — safe implementation

- [ ] Make backup refs/tags or record recoverable immutable SHAs for each branch.
- [ ] Prefer a dedicated reconciliation branch/PR based on dev; do not force reset main or dev.
- [ ] Apply **only approved** obsolete-page cleanup and any confirmed missing production fixes.
- [ ] Avoid merging all of dev into main: that would release unfinished Contests.
- [ ] Do not overwrite generated files until their source of truth and workflow are understood.
- [ ] Use pull-request review with explicit file diff; preserve Contests on dev.

### Phase D — testing / release gates

- [ ] Verify `sharing-feedback-guidelines.html` and navigation links.
- [ ] Verify schedule displays normal events and correctly excludes contests where intended.
- [ ] Verify Contests page displays only contest-category events and handles missing metadata.
- [ ] Verify next-meeting/featured-event behavior.
- [ ] Verify metadata with ordinary JSON and line-break-wrapped JSON.
- [ ] Verify event pages, images, links, canonical URLs and social share previews.
- [ ] Verify responsive header/navigation at mobile and mid-width sizes.
- [ ] Verify Actions on non-production refs where possible and confirm production cannot be modified by a dev-only change.
- [ ] Record test results and approval before any production promotion.

### Phase E — sustainable branch policy

- [ ] Define `dev` as feature-development branch and `main` as protected release branch.
- [ ] If UAT remains, give it a real testing purpose, deployment URL and defined promotion path. Otherwise plan controlled retirement only after checking references and automations.
- [ ] Route normal work via PRs and required tests; document emergency `main` hotfix backport into `dev`.
- [ ] Define which generated files belong in Git and how/when bots can update them.
- [ ] Add branch-diff checks or periodic review so production fixes do not remain unmerged into dev.
- [ ] Restrict automatic cross-branch writes; use explicit branch targets and concurrency guards.

## 7. Completion criteria

The cleanup can be considered complete only when:

- The two obsolete rules pages are removed from dev **or** intentionally retained with documented reasons; the consolidated guidelines are the single authoritative content.
- Every current file-tree difference is classified and approved; no undocumented non-Contests divergence remains.
- Contests is fully preserved on dev and has **not** leaked into main accidentally.
- The four generated event pages have an explicit lifecycle decision.
- Legitimate production fixes are present in the intended development baseline.
- GitHub Actions have been reviewed for branch writes, deployment effects, and protection handling.
- Reconciliation changes pass testing and are recorded via reviewable commits/PRs.
- Branch roles and the procedure for hotfix sync are documented.

## 8. Immediate next action

**Completed for tracked snapshots:** recursive tree comparison and review of the two workflow YAML files, active ruleset, and recent runs. See Section 9 for confirmed results and remaining external checks. **Next:** compare `kemptvillecw/mainsite:dev` against `kemptvillecw/dev:main`, normalize only the known CNAME/share URL transforms, and investigate any other differences before altering synchronization.

## 9. Phase A/B completed audit findings and updated decisions (2026-11-08)

The detailed audit was recorded as `cleanup-audit-phases-A-B.md` (standalone read-only deliverable); this section incorporates its findings and subsequent owner clarifications. This section supersedes earlier uncompleted or tentative recommendations in this plan where they differ.

### 9.1 Snapshot and exhaustive Git file inventory — COMPLETED

Recorded branch heads:
- `mainsite:main` = `8e1f9b30deec9f2b2eac142e151cd0d14243cefb`
- `mainsite:dev` at audit = `7604ffa27d681eda9fbb6fc80b9c22b6315cbc66`
- `mainsite:uat` = `1ef2cd450b168a9fcd123162bbce1d1d9926998e`
- `kemptvillecw/dev:main` observed before this plan revision = `b014213af56790bcd647790a5a2d51cfd0256ef8`.

- [x] Retrieve complete recursive Git trees for `mainsite:dev` (131 tree entries) and `mainsite:main` (121 entries).
- [x] Verify both tree API responses returned `truncated=false`.
- [x] Compare current file paths and blob SHAs; images, hidden files, workflows, and generated artifacts included.
- [x] Identify **10 dev-only files**, **0 main-only files**, and **14 differing shared files**.
- [x] Confirm the 14 differing shared files are attributable to the Contests feature, its navigation links, and responsive navigation styling.
- [x] Confirm `images/event_17941072041741938843833.jpg` has the exact same blob SHA in both branches.
- [x] Confirm the two workflow files have identical blob SHAs in `mainsite:main`, `mainsite:dev`, and `mainsite:uat`.
- [ ] Save a separate complete machine-readable SHA manifest if required for long-term archival.

**Ten dev-only paths at audit:**
1. `contests.html` — keep
2. `scripts/contests.js` — keep
3. `styles/contests.css` — keep
4. `code-of-conduct.html` — owner approved deletion in Phase C
5. `group-rules.html` — owner approved deletion in Phase C
6. `share/events/66okirl57k99ubapgnmpab7re4_20261116T230000Z.html` — retain pending event lifecycle review
7. `share/events/66okirl57k99ubapgnmpab7re4_20261123T230000Z.html` — retain pending event lifecycle review
8. `share/events/iob2qjmi973us6lvl20atf00hg.html` — retain pending event lifecycle review
9. `share/events/sfkmdg8v96cjfp2k1deeinra1s.html` — retain pending event lifecycle review
10. `cleanup-plan.md` — keep, documentation only.

**Fourteen differing shared files:**
- Contests links in header/footer only: `about.html`, `archive.html`, `browse.html`, `contact.html`, `content.html`, `index.html`, `privacy.html`, `schedule.html`, `sharing-feedback-guidelines.html`.
- Contests filtering/metadata: `scripts/calendar.js`, `scripts/event-description.js`, `scripts/events.js`, `scripts/next-meeting.js`.
- Contests navigation layout: `styles/styles.css`.

Additional checked shared files including `scripts/metadata-wrap.test.cjs`, `confirm/index.html`, `preferences/index.html`, `fb_automation_privacy.html`, and `unsubscribe/index.html` are identical. The `unfoldWrappedMetadataJson` metadata repair already exists on both main and dev, so preserve dev's contest extension rather than replacing it.

### 9.2 Workflow audit — COMPLETED for repository YAML and accessible run records

| Workflow | Trigger | Writes | Risk / disposition |
|---|---|---|---|
| `.github/workflows/sync-dev.yml` | push to `mainsite:dev` or manual dispatch (job restricted to `dev`) | Rewrites CNAME and event-share hostnames in runner; then **force-pushes** prepared HEAD to **`kemptvillecw/dev:main`** using `TARGET_TOKEN` | Confirm destination is intended to be a mirror. `--force` can erase destination-only commits. Do not blindly treat bot-created copy as a separate source of truth. |
| `.github/workflows/enforce-cname.yml` | push or PR on main/dev, plus manual dispatch with job gate | If CNAME wrong on push, bot commits repair to originating branch; on main optionally POSTs Pages rebuild | Changes are conditional. PRs with invalid CNAME fail instead of repair. Review future workflow changes separately. |
| GitHub-managed Pages | Native publishing events | Deploys site | Observed successful `main` Pages build; Pages settings endpoint inaccessible through this connector. |

Important observed evidence: `sync-dev.yml` run `42471312302` succeeded on the previous plan creation push. The destination `kemptvillecw/dev:main` head became bot commit `b014213af56790bcd647790a5a2d51cfd0256ef8` (parent `7604ffa27d681eda9fbb6fc80b9c22b6315cbc66`). This is direct evidence that a human-initiated Git commit triggered automatic mirror publication.

**Owner clarification:** Content/files are created following **human interaction** (e.g. site, Calendar Manager, or direct GitHub action); there is no asserted independent, unsupervised content-authoring process. GitHub Actions and Apps Script may **automatically perform technical generation or copying downstream of human actions**. B3 should verify the actual human-initiated write path and synchronization safety rather than presume autonomous content creation.

### 9.3 Protection/settings audit

- [x] Active `Protect Branches` repository ruleset `23697271` covers `main`, `dev`, and `uat` in `kemptvillecw/mainsite`.
- [x] Rules block deletion and non-fast-forward updates; no bypass actors listed.
- [x] That ruleset contains no required status checks or PR-review rule.
- [x] `kemptvillecw/dev` had no repository rulesets and its `main` was reported unprotected.
- [ ] Verify any **additional classic** branch protections through authorized settings access (direct protection endpoint returned HTTP 403).
- [ ] Verify Pages publishing settings and actual deployed artifacts; Pages configuration API unavailable through current connector.

### 9.4 Phase B owner decisions — CONFIRMED

- [x] `sharing-feedback-guidelines.html` replaces legacy rules content and must be preserved.
- [x] `code-of-conduct.html` and `group-rules.html` **may be deleted** from `mainsite:dev`. The owner confirms those previous URLs were never made public. No redirect preservation needed.
- [x] Contests page, JavaScript, metadata, calendar filtering, and navigation must remain on `mainsite:dev`; do not release to `main` yet.
- [x] No main-only files or other non-Contests changes were found in the audited tracked tree snapshot.
- [x] File creation should be understood as **human-initiated**, with downstream automatic synchronization where configured.
- [x] **New architecture clarification:** `kemptvillecw/dev:main` is intended to mirror `kemptvillecw/mainsite:dev`, **not** to hold independently developed code. The present sync workflow deliberately transforms `CNAME` and production-domain references in `share/events/*.html` to the dev domain. These two transformations are presently *known intentional exceptions* to a literal byte-identical mirror, but the owner's expectation is that all other files match. If exact byte-for-byte identity is required even for these files, deployment domain handling must be redesigned in a separately approved phase.
- [ ] Resolve generated share-page promotion and lifecycle without deleting old Facebook URLs.
- [ ] Decide whether `uat` has a purpose and how its promotion should work.
- [ ] Inspect other repositories' human-initiated content generators and publication paths only as necessary to validate the four event pages.
- [ ] Approve any actual workflow hardening, branch cleanup, or merge separately (Phase C).

### 9.5 Cross-repository mirror verification — COMPLETED

**Result: VERIFIED IN SYNC as designed on 2026-11-08.** The audit compared `kemptvillecw/mainsite:dev` at `2b3166cc2a3fb9b5771be2e66729d95f54940e86` with `kemptvillecw/dev:main` at `10a6a0c965bcb6b06fa4ecddf2dce49ba9e96afe`, after the prior documentation update and its completed sync Action.

Checklist:
- [x] Recorded both current head SHAs and confirmed synchronization workflow run `42472420484` completed successfully.
- [x] Retrieved complete recursive Git trees from both repositories; neither response was truncated.
- [x] Compared all tracked file paths: **116 files in each**, **zero missing from either repository**.
- [x] Compared all Git blob SHAs, including binaries, images and hidden files.
- [x] Confirmed **105 byte-identical files**.
- [x] Investigated all **11 differing files**: `CNAME` plus the **10** `share/events/*.html` pages.
- [x] Verified the only difference in `CNAME` is the intended production-to-development domain substitution.
- [x] Verified every one of the 10 event-share files differs **only** by the expected conversion of `https://www.kemptvillecreativewriters.com/` to `https://dev.kemptvillecreativewriters.com/`.
- [x] Confirmed **zero unexpected differences, missing files, or destination-only additions**.
- [x] Confirmed the destination HEAD commit's direct parent is the exact source dev commit `2b3166c...`, proving the destination was prepared from that source snapshot.
- [x] Comparison itself was read-only, with no repair, overwrite or merge.

**Disposition: CLOSED — no current cleanup work required for `kemptvillecw/dev`.** The target's `main` is an intentional published mirror of `mainsite:dev`, with expected hostname adjustments. It is logically synchronized, though not literally byte-identical. Do not attempt a branch merge or force overwrite solely to remove these intended differences. Existing cross-repository sync is operational and need not be treated as an unresolved mismatch. Its configured use of `--force` is a documented architectural characteristic; only revisit it if future requirements call for independently maintained changes in the mirror or a different synchronization strategy.

**Ongoing rule:** Treat `mainsite:dev` as source of truth and `kemptvillecw/dev:main` as a generated/deployed derivative. Future source commits trigger the configured sync workflow; a new divergence concern should arise only if that workflow fails or unexpected file differences appear.
