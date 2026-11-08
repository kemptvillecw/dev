# KCW mainsite branch cleanup and reconciliation plan

**Repository:** `kemptvillecw/mainsite`  
**Branches:** `dev`, `main` (and `uat`, reviewed separately)  
**Snapshot date:** 2026-11-08  
**Status:** Planning and review only. No application-code cleanup, merges, deletions, or deployment actions authorized by this document.

## 1. Objective and agreed decisions

Reconcile `dev` and `main` without losing production fixes or the in-progress Contests feature. The desired branch roles are:

- **`dev`:** ongoing implementation and fixes, including the Contests feature.
- **`main`:** released public website; do not promote unfinished Contests functionality.
- **`uat`:** currently has no clear working purpose. Evaluate its workflows and protections before deciding whether to retain or retire it.

The owner has explicitly decided:

1. **Preserve the entire Contests implementation on `dev`.** This includes the page, script, stylesheet, navigation entries, contest metadata, calendar filtering, and event/next-meeting exclusions. Do not inadvertently promote it to `main`.
2. **`sharing-feedback-guidelines.html` is the authoritative replacement for the earlier rules pages.**
3. **`code-of-conduct.html` and `group-rules.html` are obsolete and are not needed on `dev`.** They are candidates for removal after checking references. Do not remove or redirect them blindly.
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

### 3.2 Obsolete legacy rules pages — **REMOVE from dev after checks**

| Path | Dev | Main | Decision |
|---|---|---|---|
| `code-of-conduct.html` | Exists | Not found | Obsolete: remove from dev after reference and inbound-link review |
| `group-rules.html` | Exists | Not found | Obsolete: remove from dev after reference and inbound-link review |
| `sharing-feedback-guidelines.html` | Exists | Exists | Keep; same guidelines/content across branches, aside from Contests navigation on dev |

Before deleting obsolete files:
- Search internal links, sitemap entries, scripts, newsletter templates, and external references.
- Redirect old addresses to `sharing-feedback-guidelines.html` if important inbound links exist and hosting allows it. Otherwise remove their links and pages.
- Confirm the consolidated guidelines contain all rules still intended to be public.
- Verify live page and dev page render properly after the change.

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

The workflow definitions and protection settings were **not successfully inspected during the earlier read-only comparison**. Do not assume they are safe or inactive.

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

### Phase A — freeze the baseline and inventory (read-only)

- [ ] Record exact `main`, `dev`, and `uat` commit SHAs before starting.
- [ ] Export complete recursive tree listings for `main` and `dev`: path, file type, blob SHA; compare sets and contents.
- [ ] Include hidden files, binary image paths, generated `share/events` pages and `.github/workflows`.
- [ ] Categorize each true tip-of-branch difference as Contests, obsolete rules, generated content, legitimate production fix, or unknown.
- [ ] Check links to obsolete pages and sharing-page content.
- [ ] Audit GitHub Actions and branch protections and record observed behavior; do not trigger deployments.

### Phase B — resolve questions and make a change plan

- [ ] Confirm removal strategy for two obsolete rules pages and redirects, if required.
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

**Complete the full recursive snapshot comparison and GitHub Actions audit before editing branch history or merging.** Based on the shared files already inspected, Dev's substantive differences are mostly Contests-related, with the two obsolete pages and four generated event pages as known exceptions. This observation is encouraging, but it is not a substitute for the remaining checks.
