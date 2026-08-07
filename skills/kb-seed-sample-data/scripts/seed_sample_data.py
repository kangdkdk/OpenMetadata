#!/usr/bin/env python3
"""Seed sample data into a local OpenMetadata instance for manual/demo verification.

Not a test fixture and not wired into any test suite - this is a developer convenience
for populating a local Docker deployment with enough sample records to eyeball a feature
or an /kb-verify run. See skills/kb-seed-sample-data/SKILL.md for usage.
"""
import argparse
import sys

import requests

DEFAULT_BASE_URL = "http://localhost:8585/api/v1"
DEFAULT_EMAIL = "admin@open-metadata.org"
DEFAULT_PASSWORD_B64 = "YWRtaW4="  # "admin", base64 - matches default local Docker seed user


class OMClient:
    def __init__(self, base_url: str, email: str, password_b64: str):
        self.base_url = base_url.rstrip("/")
        resp = requests.post(
            f"{self.base_url}/users/login",
            json={"email": email, "password": password_b64},
        )
        resp.raise_for_status()
        self.token = resp.json()["accessToken"]

    def post(self, path: str, payload: dict) -> dict:
        r = requests.post(
            f"{self.base_url}/{path}",
            json=payload,
            headers={"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"},
        )
        if r.status_code >= 300:
            print(f"FAIL POST {path}: {r.status_code} {r.text[:500]}", file=sys.stderr)
            r.raise_for_status()
        return r.json()


DEFAULT_TABLE_DEFS = [
    ("orders", [
        {"name": "id", "dataType": "BIGINT"},
        {"name": "customer_name", "dataType": "VARCHAR", "dataLength": 100},
        {"name": "order_date", "dataType": "DATE"},
    ]),
    ("customers", [
        {"name": "id", "dataType": "BIGINT"},
        {"name": "name", "dataType": "VARCHAR", "dataLength": 100},
        {"name": "email", "dataType": "VARCHAR", "dataLength": 200},
    ]),
]


def seed_db_service(client: OMClient, service_name: str, service_type: str, connection_config: dict,
                     table_count: int, database: str = "kb_cust_db", schema: str = "kb_cust_schema"):
    client.post(
        "services/databaseServices",
        {"name": service_name, "serviceType": service_type, "connection": {"config": connection_config}},
    )
    db = client.post("databases", {"name": database, "service": service_name})
    sch = client.post("databaseSchemas", {"name": schema, "database": db["fullyQualifiedName"]})
    for table_name, columns in DEFAULT_TABLE_DEFS[:table_count]:
        client.post("tables", {"name": table_name, "databaseSchema": sch["fullyQualifiedName"], "columns": columns})
    print(f"  {service_name} ({service_type}): {min(table_count, len(DEFAULT_TABLE_DEFS))} tables created")


def seed_dashboard_service(client: OMClient, service_name: str, service_type: str, connection_config: dict,
                            dashboard_count: int):
    client.post(
        "services/dashboardServices",
        {"name": service_name, "serviceType": service_type, "connection": {"config": connection_config}},
    )
    names = [(f"dashboard_{i+1}", f"Sample Dashboard {i+1}") for i in range(dashboard_count)]
    for name, display in names:
        client.post("dashboards", {"name": name, "displayName": display, "service": service_name})
    print(f"  {service_name} ({service_type}): {dashboard_count} dashboards created")


def seed_instance_codes(client: OMClient, code_group: str, code_group_name: str, count: int):
    for i in range(count):
        value = f"{i+1:02d}"
        client.post(
            "instanceCodes",
            {
                "name": f"{code_group}_{value}",
                "codeGroup": code_group,
                "codeGroupName": code_group_name,
                "codeValue": value,
                "codeName": f"{code_group_name} {i+1}",
                "sortOrder": i + 1,
                "registeredDate": "20260101",
                "active": True,
            },
        )
    print(f"  {count} InstanceCode entries created (group: {code_group})")


def seed_report_projects(client: OMClient, target_service: str, count: int):
    types = ["Daily", "Weekly", "Monthly", "Adhoc"]
    for i in range(count):
        name = f"sample_report_project_{i+1}"
        client.post(
            "reportProjects",
            {
                "name": name,
                "displayName": f"Sample Report Project {i+1}",
                "description": f"Sample Report Project {i+1} - seeded for verification.",
                "type": types[i % len(types)],
                "queries": [{"service": target_service, "query": f"SELECT * FROM orders LIMIT {i+1};"}],
            },
        )
    print(f"  {count} ReportProject entries created")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--email", default=DEFAULT_EMAIL)
    parser.add_argument("--password-b64", default=DEFAULT_PASSWORD_B64)
    sub = parser.add_subparsers(dest="command", required=True)

    p_db = sub.add_parser("db-service", help="Seed a database service with N sample tables")
    p_db.add_argument("--name", required=True)
    p_db.add_argument("--type", required=True, help="Official DatabaseServiceType enum value, e.g. Mysql, Oracle, Db2")
    p_db.add_argument("--tables", type=int, default=2)
    p_db.add_argument("--connection-json", required=True, help="JSON string for the connection config")

    p_dash = sub.add_parser("dashboard-service", help="Seed a dashboard service with N sample dashboards")
    p_dash.add_argument("--name", required=True)
    p_dash.add_argument("--type", required=True, help="Official DashboardServiceType enum value, e.g. Tableau")
    p_dash.add_argument("--dashboards", type=int, default=2)
    p_dash.add_argument("--connection-json", required=True)

    p_ic = sub.add_parser("instance-codes", help="Seed N InstanceCode entries in one code group")
    p_ic.add_argument("--code-group", required=True)
    p_ic.add_argument("--code-group-name", required=True)
    p_ic.add_argument("--count", type=int, default=2)

    p_rp = sub.add_parser("report-projects", help="Seed N ReportProject entries")
    p_rp.add_argument("--target-service", required=True, help="Fully qualified service name the sample queries reference")
    p_rp.add_argument("--count", type=int, default=2)

    args = parser.parse_args()
    client = OMClient(args.base_url, args.email, args.password_b64)

    if args.command == "db-service":
        import json
        seed_db_service(client, args.name, args.type, json.loads(args.connection_json), args.tables)
    elif args.command == "dashboard-service":
        import json
        seed_dashboard_service(client, args.name, args.type, json.loads(args.connection_json), args.dashboards)
    elif args.command == "instance-codes":
        seed_instance_codes(client, args.code_group, args.code_group_name, args.count)
    elif args.command == "report-projects":
        seed_report_projects(client, args.target_service, args.count)


if __name__ == "__main__":
    main()
