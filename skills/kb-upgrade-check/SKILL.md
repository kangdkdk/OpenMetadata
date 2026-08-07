---
name: kb-upgrade-check
description: Rehearses a vendor version upgrade for this OpenMetadata fork — creates a throwaway branch, cherry-picks our custom commits against the target release, classifies conflicts, runs a build check, and reports 가능/위험 without ever touching real vendor/custom branches or pushing anything.
---

# Vendor Upgrade Check (Rehearsal Only)

## When to Activate

When the user asks to check whether upgrading to a new OpenMetadata release is safe, wants
a conflict/risk report for a target version, or explicitly invokes `/kb-upgrade-check <version>`.

**This skill never performs the real upgrade.** It only rehearses it in a disposable branch
and reports findings. Applying the upgrade for real (`vendor/<version>` + `custom/<version>`,
resolving conflicts in place, committing) is a separate, human-driven task described in
`CLAUDE.md`'s "KB Custom Change Workflow" — point the user there once this skill's report
comes back "가능" or "가능(단 수작업 필요)".

## Why this shape (read before changing this skill)

Two real bugs surfaced in past upgrades that a conflict-only rehearsal would have missed:
a migration checksum bug and a stale-build-artifact bug — neither has any textual diff
signature at all (see `KB-CUSTOM-TEST.md`'s 2026-08-04 entries and `KB-CUSTOM-UPGRADE-CHECK.md`
for the full writeups). That's why Phase 3 below insists on an actual `mvn install` for the
backend, not just `tsc --noEmit` — the previous rehearsal that only ran `tsc` gave a false
"가능" that a real build would have complicated. It's still not exhaustive (deployment/DB-state
bugs need an actual Docker run, which stays out of scope for a rehearsal), but it catches more
than a diff-only check without materially slowing the rehearsal down.

## Arguments

- **Target version** (required): a release tag or branch to rehearse against, e.g. `1.14.0-release`.
- **`--from <branch>`** (optional): the custom branch whose commits to cherry-pick. Defaults to
  the branch named in the most recent row of `KB-CUSTOM-MODIFIED.md`'s newest "버전 이력" table —
  read that file to find it; ask the user to confirm if more than one line of work exists and
  it's ambiguous which is current.
- **`--skip-build`** (optional): skip Phase 3's `mvn install`/`tsc` step (faster, less thorough —
  only use this for a quick first pass, and say so in the report).

## Safety rules — never violate these

1. **Only ever create/modify a single throwaway branch**, named `kb-upgrade-test-<version>`.
   Never check out or modify `vendor/*` or `custom/*` branches, never amend them, never push.
2. **Always clean up**, even on failure or if interrupted partway: abort any in-progress
   `cherry-pick` (`git cherry-pick --abort`), switch back to the branch the user was on before
   this skill started, and delete `kb-upgrade-test-<version>`.
3. **Never push anything** — this skill has no reason to touch `origin`.
4. Before starting, run `git status` — if the working tree isn't clean, stop and tell the user
   to commit or stash first rather than rehearsing on top of uncommitted changes.

## Workflow

### Phase 1 — Pre-flight (no branch created yet)

1. Read `KB-CUSTOM-UPGRADE-CHECK.md` in full — it is the source of truth for what "가능/위험"
   means and what the checklist items are. Don't hardcode a copy of its criteria here; if it's
   been edited since this skill was last touched, follow the current version.
2. Read `KB-CUSTOM-MODIFIED.md` and `KB-CUSTOM-NEW.md` to build the list of files this fork
   has touched or added — this is what Phase 2's conflict classification will be checked against.
3. Checklist item 1 (naming collision) and item 2 (generated code impact) can be answered from
   diffs alone, without a rehearsal branch — run them now:
   - `git diff <current-vendor-branch> <target-version> -- openmetadata-spec/.../databaseService.json`
     and check whether our custom connector type names now collide with an official addition.
   - Check whether any new official `EntityType`/entity schema collides with our custom entity
     names (from `KB-CUSTOM-NEW.md`).
   - **If this flags a collision: stop here.** Report "위험" immediately — do not proceed to
     Phase 2. A rehearsal cannot fix a naming collision; it needs a redesign decision first.

### Phase 2 — Rehearsal branch: cherry-pick and classify conflicts

1. Create `kb-upgrade-test-<version>` from the target version's tag/branch.
2. Cherry-pick the full commit range from the `--from` branch
   (`<current-vendor-branch>..<from-branch>`) — every commit, not a subset.
3. For each conflict git stops on:
   - Read the conflict markers and classify it as **mechanical** (both sides can coexist —
     tail-inserts into an enum/array/mapping table, independent lines that happen to be near
     each other) or **structural** (the official side changed an interface contract, renamed
     symbols our code depends on, or replaced a whole mechanism our code plugged into).
   - Resolve mechanical conflicts inline and continue the cherry-pick.
   - For structural conflicts, resolve them too (that's what makes this a real rehearsal, not
     just a dry-run) but flag them clearly in the report — these are the ones that turn a
     "가능" into "가능(단 수작업 필요)".
   - If a conflict can't be resolved without a design decision only the user can make (this is
     the rare case — most structural conflicts from past upgrades turned out to be mechanical
     once actually attempted), stop, report it, and treat this as "위험" pending that decision.
4. Keep a running list: file path → conflict type → one-line description of the fix applied.

### Phase 3 — Build check (skip only if `--skip-build` was passed)

Run enough of a real build to catch what a diff can't:
1. `npx tsc --noEmit -p .` in `openmetadata-ui/src/main/resources/ui` — compare the error count
   against the pre-upgrade baseline (some pre-existing unrelated errors are normal; only new
   ones matter).
2. `mvn -pl openmetadata-spec -am install -DskipTests -q` then
   `mvn -pl openmetadata-service -am install -DskipTests -q` — an actual backend build, not
   just a schema check. This is what would have caught the `SearchIndex` interface contract
   change in a past upgrade before it became a runtime surprise.
3. Record pass/fail and any new errors against files this fork owns.

Do **not** attempt a Docker build/deploy in this skill — that's real-infrastructure territory
(image builds, migration state, running containers) that belongs to the actual upgrade, not a
rehearsal. Say so explicitly in the report so the user doesn't mistake a clean rehearsal for a
guarantee that deployment will also be clean.

### Phase 4 — Report

Produce a report in the same shape as `KB-CUSTOM-UPGRADE-CHECK.md`'s dated entries:
- 판정: 가능 / 가능(단 수작업 필요) / 위험, following that file's 판단 기준 section
- Per-checklist-item results (1 through 6, using whatever items currently exist in the file)
- Conflict list from Phase 2 with mechanical/structural classification
- Build check results from Phase 3 (or "생략됨" if `--skip-build`)
- Explicit reminder that Docker/deployment/migration-state issues are out of scope for this
  rehearsal and must still be checked for real during actual application

Present this to the user. Ask whether to append it as a new dated entry in
`KB-CUSTOM-UPGRADE-CHECK.md`'s 점검 이력 — do not write to that file without confirmation,
since it's an append-only historical record and a bad entry is annoying to have to caveat later.

### Phase 5 — Cleanup (always, regardless of outcome)

1. `git cherry-pick --abort` if a cherry-pick is still in progress.
2. Switch back to the branch active before this skill ran.
3. Delete `kb-upgrade-test-<version>`.
4. Confirm with `git status` and `git branch` that the working tree and branch list are back
   to their pre-skill state before finishing.

## Explicitly out of scope

- Creating or modifying real `vendor/<version>` / `custom/<version>` branches
- Resolving conflicts "for real" (i.e. anywhere other than the throwaway branch)
- Docker image builds, container deploys, or migration execution
- Committing or pushing anything
- Updating `KB-CUSTOM-MODIFIED.md`/`KB-CUSTOM-NEW.md`/`KB-CUSTOM-TEST.md` (those describe the
  real applied change, which this skill never performs)

When the report comes back "가능" or "가능(단 수작업 필요)" and the user wants to proceed,
tell them to follow `CLAUDE.md`'s "KB Custom Change Workflow" for the real application —
that part stays manual by design.
