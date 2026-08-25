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

    def get(self, path: str) -> dict:
        r = requests.get(
            f"{self.base_url}/{path}",
            headers={"Authorization": f"Bearer {self.token}"},
        )
        if r.status_code >= 300:
            print(f"FAIL GET {path}: {r.status_code} {r.text[:500]}", file=sys.stderr)
            r.raise_for_status()
        return r.json()

    def put(self, path: str, payload: dict) -> dict:
        r = requests.put(
            f"{self.base_url}/{path}",
            json=payload,
            headers={"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"},
        )
        if r.status_code >= 300:
            print(f"FAIL PUT {path}: {r.status_code} {r.text[:500]}", file=sys.stderr)
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
    ("products", [
        {"name": "id", "dataType": "BIGINT"},
        {"name": "product_name", "dataType": "VARCHAR", "dataLength": 100},
        {"name": "price", "dataType": "DECIMAL"},
    ]),
    ("invoices", [
        {"name": "id", "dataType": "BIGINT"},
        {"name": "order_id", "dataType": "BIGINT"},
        {"name": "amount", "dataType": "DECIMAL"},
        {"name": "issued_date", "dataType": "DATE"},
    ]),
    ("employees", [
        {"name": "id", "dataType": "BIGINT"},
        {"name": "full_name", "dataType": "VARCHAR", "dataLength": 100},
        {"name": "department", "dataType": "VARCHAR", "dataLength": 100},
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


COLUMN_CUSTOM_PROPERTIES = [
    {"name": "attributeName", "displayName": "속성명", "description": "속성명 (Attribute Name)", "fieldType": "string"},
    {
        "name": "instanceCodeName",
        "displayName": "인스턴스명",
        "description": "연결된 인스턴스 코드 (Instance Code)",
        "fieldType": "entityReference",
        "config": {"entityTypes": ["instanceCode"]},
    },
    {
        "name": "infoType",
        "displayName": "인포타입",
        "description": "정보 유형 분류 (Info Type)",
        "fieldType": "enum",
        "config": {"values": ["일반정보", "개인정보", "민감정보", "기타"], "multiSelect": False},
    },
    {"name": "variableName", "displayName": "변수명", "description": "변수명 (Variable Name)", "fieldType": "string"},
    {"name": "columnDefinitionKbCust", "displayName": "컬럼정의", "description": "컬럼 정의 (Column Definition)", "fieldType": "markdown"},
    {
        "name": "lastModifiedDateTime",
        "displayName": "최종변경일시",
        "description": "최종 변경 일시 (Last Modified Date Time)",
        "fieldType": "dateTime-cp",
        "config": "yyyy-MM-dd'T'HH:mm:ss",
    },
    {"name": "businessRule", "displayName": "업무규칙", "description": "업무 규칙 (Business Rule)", "fieldType": "markdown"},
    {"name": "encryptionTransformInfo", "displayName": "암호화변환정보", "description": "암호화 변환 정보 (Encryption Transform Info)", "fieldType": "string"},
    {
        "name": "isEncrypted",
        "displayName": "암호화여부",
        "description": "암호화 여부 (Is Encrypted)",
        "fieldType": "enum",
        "config": {"values": ["Y", "N"], "multiSelect": False},
    },
    {"name": "userDefinedColumnDescription", "displayName": "사용자 정의 컬럼설명", "description": "사용자 정의 컬럼 설명 (User Defined Column Description)", "fieldType": "markdown"},
    {"name": "classificationItem", "displayName": "분류체계 항목", "description": "분류체계 항목 (Classification Item)", "fieldType": "string"},
]


TABLE_CUSTOM_PROPERTIES = [
    {
        "name": "systemInfraKbCust", "displayName": "시스템인프라", "description": "시스템 인프라 (System Infra)", "fieldType": "enum",
        "config": {"values": ["ON_PREMISE", "CLOUD"], "multiSelect": False},
    },
    {"name": "serverNameKbCust", "displayName": "서버명", "description": "서버명 (Server Name)", "fieldType": "string"},
    {"name": "datasetSchemaKbCust", "displayName": "스키마", "description": "데이터셋 스키마 (Schema)", "fieldType": "string"},
    {
        "name": "externalDataYnKbCust", "displayName": "외부데이터여부", "description": "외부 데이터 여부 (External Data Y/N)", "fieldType": "enum",
        "config": {"values": ["Y", "N"], "multiSelect": False},
    },
    {"name": "serverCodeKbCust", "displayName": "서버코드", "description": "서버 코드 (Server Code)", "fieldType": "string"},
    {
        "name": "myDataYnKbCust", "displayName": "마이데이터여부", "description": "마이데이터 여부 (MyData Y/N)", "fieldType": "enum",
        "config": {"values": ["Y", "N"], "multiSelect": False},
    },
    {
        "name": "lastLoadDateTimeKbCust", "displayName": "최종적재일시", "description": "최종 적재 일시 (Last Load Date Time)", "fieldType": "dateTime-cp",
        "config": "yyyy-MM-dd'T'HH:mm:ss",
    },
    {"name": "workCycleKbCust", "displayName": "작업주기", "description": "작업 주기 (Work Cycle)", "fieldType": "string"},
    {
        "name": "tableNewDateKbCust", "displayName": "테이블신규일", "description": "테이블 신규일 (Table New Date)", "fieldType": "date-cp",
        "config": "yyyy-MM-dd",
    },
    {
        "name": "odateKbCust", "displayName": "기준일자(ODATE)", "description": "기준일자 ODATE", "fieldType": "date-cp",
        "config": "yyyy-MM-dd",
    },
    {"name": "holidayCaseKbCust", "displayName": "휴일일 경우", "description": "휴일일 경우 처리 (Holiday Case)", "fieldType": "string"},
    {"name": "tableTypeKbCust", "displayName": "테이블종류", "description": "테이블 종류 (Table Type)", "fieldType": "string"},
    {
        "name": "qualityCheckResultKbCust", "displayName": "품질점검결과", "description": "품질 점검 결과 (Quality Check Result)", "fieldType": "enum",
        "config": {"values": ["통과", "실패"], "multiSelect": False},
    },
    {
        "name": "changeHistoryKbCust", "displayName": "테이블 변경이력",
        "description": "테이블 변경이력 - JSON 배열 문자열로 저장 (Table Change History)", "fieldType": "string",
    },
]


def seed_entity_custom_properties(client: OMClient, entity_type_name: str, properties: list):
    field_types = client.get("metadata/types?category=field&limit=50")["data"]
    field_type_ids = {t["name"]: t["id"] for t in field_types}

    entity_type = client.get(f"metadata/types/name/{entity_type_name}?fields=customProperties")
    existing_names = {p["name"] for p in entity_type.get("customProperties", [])}

    created = 0
    for prop in properties:
        if prop["name"] in existing_names:
            print(f"  skip {prop['name']}: already exists")
            continue
        body = {
            "name": prop["name"],
            "displayName": prop["displayName"],
            "description": prop["description"],
            "propertyType": {"id": field_type_ids[prop["fieldType"]], "type": "type"},
        }
        if "config" in prop:
            body["customPropertyConfig"] = {"config": prop["config"]}
        client.put(f"metadata/types/{entity_type['id']}", body)
        created += 1
        print(f"  created {prop['name']} ({prop['fieldType']})")
    print(f"  {created} {entity_type_name} custom properties created, {len(existing_names)} already present")


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

    sub.add_parser(
        "column-custom-properties",
        help="Idempotently create the tableColumn custom properties for the Schema tab extra fields",
    )

    sub.add_parser(
        "table-info-custom-properties",
        help="Idempotently create the table custom properties for the Dataset Info panel + change history modal",
    )

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
    elif args.command == "column-custom-properties":
        seed_entity_custom_properties(client, "tableColumn", COLUMN_CUSTOM_PROPERTIES)
    elif args.command == "table-info-custom-properties":
        seed_entity_custom_properties(client, "table", TABLE_CUSTOM_PROPERTIES)


if __name__ == "__main__":
    main()
