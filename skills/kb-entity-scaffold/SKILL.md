---
name: kb-entity-scaffold
description: Scaffolds a new custom entity (schema through Explore-tree wiring) following the exact pattern already established by InstanceCode and ReportProject in this fork — extends DEVELOPER.md's generic "Adding a New Entity" checklist with the KB-custom-specific steps and known pitfalls those two entities actually hit.
---

# Custom Entity Scaffolding

## When to Activate

When adding a brand-new custom entity to this fork (not an official OpenMetadata entity, not a
connector — those have their own paths: `DEVELOPER.md`'s "Adding a New Connector" checklist and
`/connector-building`).

## Relationship to `DEVELOPER.md`

`DEVELOPER.md`'s "Adding a New Entity (End-to-End Checklist)" (13 steps) is the **official,
generic** version — schema, DAO, repository, mapper, resource, migration, search index,
integration test. Read it first; it's still correct and this skill doesn't replace it.

This skill adds what that generic checklist doesn't cover, because it's specific to this fork:
the `-kb-cust` naming convention, KB-CUSTOM-*.md tracking, and — the part that actually ate the
most time on both InstanceCode and ReportProject — wiring a new entity into the Explore UI so it
doesn't just have a working API with an invisible frontend.

## Reference implementation — check whether one still exists before writing new code

As of the `vendor/1.13.3` reset, this fork has no custom entities left to copy from — the
InstanceCode (grouped entity, group/detail hierarchy) and ReportProject (flat entity, type +
per-service saved queries) examples that used to anchor this section were wiped along with the
rest of the pre-reset history. If a custom entity exists by the time you read this,
`grep -rl "<EntityName>" --include="*.ts" --include="*.tsx" --include="*.java"` across the repo
to enumerate every touch point, decide whether your new entity is structurally closer to a
grouped or flat shape, and copy accordingly. If none exists yet, the step list below is your
only guide — follow it directly and treat whatever you build as the first reference
implementation for the next one.

## Steps (extends DEVELOPER.md 1–13)

1–13. Follow `DEVELOPER.md` as written, with these fork-specific amendments:

- **Step 1–2 (schemas)**: name the files `create{Entity}-kb-cust.json` / `{entity}-kb-cust.json`.
  Add both to `KB-CUSTOM-NEW.md` immediately, not after the fact.
- **Step 3 (generate)**: when running `quicktype` for the TS types, **always pass
  `--top-level {Entity}` and `--top-level Create{Entity}` explicitly**. Without it, quicktype
  infers the type name from the filename and can mangle a multi-segment filename into the
  identifier (this bit an earlier entity before the naming convention moved from `.kb-cust.` to
  `-kb-cust` specifically to avoid this class of parser confusion — verify it either way).
- **Step 4–8 (backend)**: `Repository`/`Mapper`/`Resource` classes can't take the `-kb-cust`
  suffix — public class name must match the filename and Java identifiers can't contain
  hyphens. Use the CamelCase `KbCust` suffix instead (`FooRepositoryKbCust.java`, class
  `FooRepositoryKbCust`) and track them in `KB-CUSTOM-NEW.md`.
  For the search index class, implement `getEntityTypeName()` (returns the `Entity.*` constant)
  and `buildSearchIndexDocInternal()` — do **not** hand-roll common-field population; the
  `SearchIndex` interface's default `buildSearchIndexDoc()` calls `populateCommonFields()`
  before your method runs.
- **Step 9 (migration)**: add the `CREATE TABLE` to the **current** version's
  `bootstrap/sql/migrations/native/{version}/{mysql,postgres}/schemaChanges.sql` — restarting an
  already-bootstrapped local Docker stack does not re-run older migration folders. If you add a
  statement to a folder whose version was already marked executed on your local DB, immediately
  re-run `execute-migrate-all` in the same session (see `CLAUDE.md` point 6) — don't defer it.
- **Step 10 (search index)**: also add the mapping to
  `openmetadata-spec/src/main/resources/elasticsearch/indexMapping.json` (alias/parentAliases).
  Also add `dataAsset` to `parentAliases` if you want the entity's Explore-tree node to show a
  non-zero count — the tree's count aggregation queries the `dataAsset` alias specifically, and
  a node whose aggregated count is 0 gets silently filtered out of the rendered tree.
  **In the entity's own `{entity}_index_mapping.json`, the `entityType` field must be mapped
  with a `.keyword` sub-field carrying `lowercase_normalizer`** (copy the pattern from an
  official mapping file, e.g. `metric_index_mapping.json`) — not a bare `"type": "keyword"`.
  The Explore tree's quick-filter click handler always queries `entityType.keyword` with a
  lowercased value; without the sub-field + normalizer, that query matches nothing and the
  entity is invisible in Explore even though the plain REST API and a naive `entityType` term
  query both return correct results — this is a genuinely silent failure mode (HTTP 200, empty
  hits, no error) that easily survives API-level testing and only surfaces in the browser. If
  you don't have browser access to verify, check `docker logs <server-container>` for the
  actual `GET /api/v1/search/query` request the browser sent and diff its `query_filter` shape
  against a manual curl reproduction — don't assume a passing curl test against a plausible
  filter shape means the real frontend query also passes.
- **Step 12 (frontend) — this is the part the generic checklist under-specifies.** All of these
  are required, not optional, for the entity to actually be usable from the UI:
  1. `enums/search.enum.ts` — add `SearchIndex.{ENTITY}`
  2. `enums/entity.enum.ts` — add `EntityType.{ENTITY}`
  3. `enums/Explore.enum.ts` — add `ExploreTabs.{ENTITY}`
  4. `interface/search.interface.ts` — add `{Entity}SearchSource` (if it extends both
     `SearchSourceBase` and the generated entity type and they share a field with different
     types — e.g. `type` — use `Omit<{Entity}, 'type'>` to avoid a TS2320 conflict) and register
     it in `SearchIndexSearchSourceMapping`
  5. `components/Explore/ExplorePage.interface.ts` — add `SearchIndex.{ENTITY}` to the
     `ExploreSearchIndex` union (missing this is a silent TS error only, easy to overlook)
  6. `utils/EntityUtils.tsx` — add an `EntityType.{ENTITY}` case to `getEntityLinkFromType`
     (**not** the same registration as `EntityUtilClassBase.ts` — this is a separate function
     that generates the Explore search-result title link; missing this sends clicks to a dead
     `/explore` link instead of the entity page) and an entry in the `EntityTypeName` record
  7. `utils/SearchClassBase.ts` — four separate spots:
     `getEntityTypeSearchIndexMapping()`, `getSearchIndexEntityTypeMapping()`, the Explore tree
     (`getExploreTree()`, as an `isRoot: true` node — this is what actually makes the category
     appear in the left sidebar), and `getDropDownItems()`
  8. `utils/EntityUtilClassBase.ts` — register the detail-page component, patch API, and
     `ResourceEntity` mapping
  9. `context/PermissionProvider/PermissionProvider.interface.ts` — add `ResourceEntity.{ENTITY}`
  10. `locale/languages/en-us.json` **and** `ko-kr.json` — add label/message keys for both, not
      just `en-us.json` (the generic checklist's step 13 only mentions English)
  11. Routing: add to `constants/constants.ts` (`ROUTES`) and a lazy import + route in
      `components/AppRouter/AuthenticatedAppRouter.tsx`
  12. If the component library (`openmetadata-ui-core-components`) doesn't yet export a
      component you need (check with a quick `grep` of its `index.es.js`), don't block on it —
      build the page with the existing antd-based pattern from another list page (e.g. metric's)
      and swap in the core-components version later.

## After scaffolding

- Run `/kb-verify` before calling this done — items 4, 5, and 8 (search, Explore tree, CRUD)
  are exactly the ones a partial entity implementation tends to fail silently.
- Update `KB-CUSTOM-NEW.md`/`KB-CUSTOM-MODIFIED.md` for every file touched, per `CLAUDE.md`.
