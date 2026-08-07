---
name: kb-verify
description: Runs the 14-item 표준 검증 체크리스트 from KB-CUSTOM-TEST.md against a running local deployment — build health, non-200 responses, search, regressions, CRUD, auth, logs, locale JSON, restart stability, and deployed-artifact freshness — and produces a pass/fail report ready to append to KB-CUSTOM-TEST.md.
---

# KB Custom Standard Verification Checklist Runner

## When to Activate

After any custom change (new entity, new connector, vendor upgrade) is built and deployed
locally, before reporting the work as "done." This is what `CLAUDE.md`'s KB Custom Change
Workflow point 3 points to — don't skip it, and don't stop partway if something fails.

## Source of truth

The 14 checklist items live in `KB-CUSTOM-TEST.md` under "표준 검증 체크리스트" — **read that
table fresh each run** rather than trusting a copy here; it gets edited over time and this
skill should always test against the current version, not a stale snapshot.

## Arguments

- **`--base-url`** (optional, default `http://localhost:8585`): where the server under test is running.
- **`--entities <list>`** (optional): comma-separated entity/API names to focus items 2–9 on
  (e.g. `instanceCodes,reportProjects`). Without this, ask the user which feature(s) this
  verification run is for — the checklist is generic, but items 4/6/8/9 need concrete targets.
- **`--skip <numbers>`** (optional): skip specific item numbers (e.g. `--skip 3,7` if no
  Playwright/browser tool or no ingestion image in scope this run) — always say what was skipped
  and why in the final report, never silently drop an item.

## Running the 14 items

Work through them in this order — some naturally batch together:

**1. 빌드**: re-check the last build's exit status (`mvn`, `npx tsc --noEmit`, `yarn lint`) — if
none was run this session, run it now rather than assuming it's still valid.

**2. 화면 200 체크 + 9. 버전 히스토리 + 10. 권한**: for each entity in `--entities`, hit its
list/detail REST endpoints with a valid token (expect 200), then again with no
`Authorization` header (expect 401/403 — this is item 10). PATCH one field, GET again, confirm
`version` incremented and `changeDescription` reflects the change (item 9).

**3. 콘솔 에러**: requires a browser. If no Playwright/browser tool is available this run, mark
skipped and say so explicitly — don't claim this passed without checking.

**4. 검색**: `GET /api/v1/search/query?index=<index>&q=*` for every relevant search index,
confirm non-zero hits for both pre-existing and newly-added records.

**5. Explore 트리 노출**: delegate to the `/kb-artifact-freshness` skill's check #1 (bundle hash) —
if the served bundle doesn't match the local build, this item can't pass regardless of source
correctness. Once freshness is confirmed, grep the served bundle for the entity's tree label
string as a lightweight proxy for "is it registered and shipped."

**6. 회귀**: pull the entity/feature list this fork has previously shipped (from
`KB-CUSTOM-MODIFIED.md`'s version-history tables) and re-run their basic list/detail checks —
don't only test what you just changed.

**7. 인제스천**: check the ingestion pipeline's last run status is `Success`, and that the
ingestion Docker image actually built — the naming convention moved from `.kb-cust.` to
`-kb-cust` specifically because the old form broke `datamodel-code-generator` on connection
schema JSON (see `CLAUDE.md`); verify a new connector's schema doesn't hit the same class of
bug before assuming it's fixed. A skipped ingestion build isn't the same as a passing one.

**8. CRUD**: POST → GET (confirm fields) → PATCH → GET (confirm change) → DELETE (soft) → GET
(confirm excluded from list) → restore → GET (confirm reappears).

**11. 로그 스캔**: `docker logs <container> 2>&1 | grep -iE "error|exception"` across all
running containers, not just the server — review every hit, don't just count them.

**12. 로케일 JSON**: `python -m json.tool <locale file>` for every touched locale file, plus
`yarn eslint <file> ` to catch `jsonc/sort-keys` violations.

**13. 재기동 안정성**: `docker compose ... up -d --force-recreate <server>`, wait for healthy,
re-run item 11's log scan — a bug that only appears on the *second* startup (like a migration
checksum issue) won't show up on the first.

**14. 배포 아티팩트 신선도**: run the `/kb-artifact-freshness` skill in full and fold its report in.

## Report

Produce a table: item # | 항목 | 결과(✅/❌/⏭️ 생략) | 근거. End with an overall verdict —
**all 14 must be ✅ or explicitly-justified ⏭️ to call the work done**; any ❌ means go back and
fix it, per `CLAUDE.md`'s "don't report done if any item fails" rule.

Ask the user before appending the report as a new dated entry to `KB-CUSTOM-TEST.md` — it's
append-only, so get it right before it goes in permanently.
