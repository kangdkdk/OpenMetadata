---
name: kb-seed-sample-data
description: Seeds sample services/tables/dashboards/InstanceCodes/ReportProjects into a local OpenMetadata deployment via REST API, for manual verification or demo purposes — wraps a reusable parameterized script instead of writing one-off curl/python each time.
---

# Seed Sample Data

## When to Activate

When someone asks to add sample/demo data for a service type or a custom entity to a locally
running OpenMetadata instance — for eyeballing a feature, populating a demo, or feeding
`/kb-verify`'s search/CRUD checks with concrete records.

## What this is not

Not test fixtures, not part of any automated test suite, and it talks to a **live REST API**
of a real running server — never point `--base-url` at anything other than a local/disposable
deployment. Data created this way persists in that server's actual database.

## Usage

The script is at `skills/kb-seed-sample-data/scripts/seed_sample_data.py`. It logs in once (default
credentials match the standard local Docker seed admin user) and exposes four subcommands:

```bash
# Database service + N sample tables (orders, customers)
python skills/kb-seed-sample-data/scripts/seed_sample_data.py db-service \
  --name kb_cust_mysql_demo --type Mysql --tables 2 \
  --connection-json '{"type":"Mysql","username":"demo_user","hostPort":"localhost:3306"}'

# Dashboard service + N sample dashboards
python skills/kb-seed-sample-data/scripts/seed_sample_data.py dashboard-service \
  --name kb_cust_tableau_demo --type Tableau --dashboards 2 \
  --connection-json '{"type":"Tableau","hostPort":"https://tableau.demo.local","authType":{"username":"demo_user","password":"demo_password"},"siteName":"demo_site"}'

# InstanceCode entries in one code group
python skills/kb-seed-sample-data/scripts/seed_sample_data.py instance-codes \
  --code-group PAYMENT_METHOD --code-group-name 결제수단코드 --count 2

# ReportProject entries (queries reference an existing service by fully-qualified name)
python skills/kb-seed-sample-data/scripts/seed_sample_data.py report-projects \
  --target-service kb_cust_mysql_demo --count 2
```

`--base-url`, `--email`, `--password-b64` are available on every subcommand if not targeting
the default local `http://localhost:8585` admin login.

## Connection config gotchas (per-type minimal required fields)

The `--connection-json` must satisfy that service type's JSON Schema `required` fields — since
this is sample data, not real ingestion, the values don't need to be reachable, just present.
Known minimums (check `openmetadata-spec/.../connections/database/*.json` if a new type is
needed and isn't listed here):

| Type | Required fields |
|---|---|
| `Mysql` / `MariaDB` | `hostPort`, `username` |
| `Postgres` / `Db2` | `hostPort`, `username`, `database` |
| `Oracle` | `username`, `oracleConnectionType` (nested `oneOf` — e.g. `{"oracleServiceName": "..."}`) |
| `Hive` | `hostPort` |
| `Glue` | `awsConfig` (nested, needs `awsRegion`) |
| `Tableau` | `hostPort`, `authType` (nested `oneOf` — basic auth needs `username`+`password`) |

## Valid enum values worth knowing

- `ReportProject.type`: `Daily`, `Weekly`, `Monthly`, `Adhoc` only — no `Quarterly`/`Yearly`.
- Check `openmetadata-spec/src/main/resources/json/schema/entity/data/reportProject-kb-cust.json`
  (if this fork has a ReportProject-equivalent entity — filename per the current `-kb-cust` convention)
  and `.../services/databaseService.json` directly if unsure of a current enum's exact values —
  don't assume from memory, they do change across versions.

## After seeding

If the goal was to verify a feature (not just populate a demo), follow up with `/kb-verify`
rather than eyeballing the UI once — items 4/5/8 (search, Explore tree, CRUD) are exactly what
this seeded data is meant to exercise.
