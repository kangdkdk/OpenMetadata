---
name: kb-artifact-freshness
description: Quick diagnostic for "the code is right but the browser/API doesn't show it" — compares the running server's actual served frontend bundle, Docker image, and applied migrations against the latest local build, to rule out (or catch) stale-artifact bugs before chasing a phantom code bug.
---

# Artifact Freshness Check

## When to Activate

Whenever someone reports "I fixed X but it's still not showing up" / "화면에 안 나와요" /
"새로고침해도 안 됨" for a locally-running `openmetadata-server` Docker deployment — **run this
before** re-reading the source code for the third time. A clean build and a stale deployment
look identical from the browser.

## Why this exists

Two real incidents motivated this: an Explore-tree registration that was correct in source but
invisible in the browser because `mvn -pl openmetadata-dist install` (a scoped rebuild) silently
reused a months-old `openmetadata-ui` jar from `~/.m2` instead of the one just built — the build
exited 0, the tarball packaged fine, only the actual bundle hash was wrong. And separately, a
migration checksum going unrecorded made an already-applied version show as pending again after
a routine restart. Neither had any signal you'd notice without deliberately comparing
"what's running" against "what I just built."

## Checks (run all three; each is independent and fast)

### 1. Served frontend bundle vs local build

```bash
# What hash is the running server actually serving? (the entry chunk, referenced directly
# from index.html — the dist/assets folder has many other unrelated "index-*.js"-named
# chunks, e.g. vendor bundles, so don't grep dist/ loosely and eyeball-compare)
SERVED=$(curl -s http://localhost:8585/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1)
echo "$SERVED"

# Does a file with that EXACT name exist locally?
ls "openmetadata-ui/src/main/resources/ui/dist/$SERVED"
```

If the `ls` fails (file not found), that alone is conclusive: the served entry chunk doesn't
even exist in the local build, so the deployed image is from a different (older) build.

If the hashes differ, the deployed image has an **older frontend build** than what's on disk.
Confirm by fetching the served chunk and grepping for a string you know you just added:

```bash
curl -s "http://localhost:8585/assets/index-<served-hash>.js" -o /tmp/served.js
grep -c "<marker string you just added, e.g. a new i18n key>" /tmp/served.js
```

Zero matches on a hash mismatch = confirmed stale deploy, not a source bug. Fix: rebuild
`openmetadata-ui` with the `install` goal (not just `package`) so `.m2` is current, then
rebuild the module you scoped your last build to, then rebuild the Docker image. See
`CLAUDE.md`'s "Scoped rebuilds and `.m2` staleness" note for the exact mechanism.

### 2. Docker image freshness

```bash
docker images | grep openmetadata-server
docker inspect openmetadata_server --format='{{.Created}} {{.Image}}'
```

Compare the image `Created` timestamp against when you last ran `docker compose build`. If the
timestamp predates your latest source change, the `build` step didn't actually produce a new
layer (check the full build log, not just the exit code — a `docker compose build` that reports
success can still have skipped rebuilding a layer it thinks is cached).

### 3. Migration state vs available migrations

```bash
docker logs openmetadata_server 2>&1 | grep -i "pending migrations"
```

Match on the specific message text, not the bare `IllegalStateException` class name — this
server can throw that exception for unrelated, benign reasons (e.g. an optional RDF module
that's disabled by default logs one at startup that has nothing to do with migrations), so a
broad class-name grep produces false positives.

If "pending migrations" is non-empty after a restart, don't assume it's a fresh problem — check whether a
`schemaChanges.sql` file was edited *after* its version was already marked executed (see
`CLAUDE.md` point 6 of the KB Custom Change Workflow). Cross-reference:

```sql
SELECT version, count(*) FROM SERVER_MIGRATION_SQL_LOGS WHERE version='<suspect version>';
```

against the actual statement count in that version's `schemaChanges.sql` — a mismatch means a
statement's checksum was never logged (often because the file was edited in a later session
without re-running migrate at the time).

## Report format

```
| 체크 | 상태 | 상세 |
|---|---|---|
| 프론트엔드 번들 | ✅/❌ | 서빙 해시 vs 로컬 해시 |
| Docker 이미지 | ✅/❌ | 이미지 타임스탬프 vs 마지막 빌드 시각 |
| 마이그레이션 상태 | ✅/❌ | pending 여부, 체크섬 불일치 있는지 |
```

If any check fails, say so plainly and point at the fix above — don't just report "stale" and
stop; this skill's whole point is to save a debugging cycle, so hand back a next action, not
just a diagnosis.
