# KB Custom - Modified Files Log

기존 공식 파일 중 커스텀 목적으로 수정한 파일 목록입니다. 신규로 만든 파일은
`KB-CUSTOM-NEW.md` 참고. 버전(`v1`, `v2`, ...)은 **기능 라인별로 별도 채번**합니다 —
서로 다른 기능(예: 데이터베이스 커넥터 vs 신규 엔티티)은 각자 `v1`부터 시작하며,
브랜치명이 어떤 라인의 몇 번째 버전인지 구분해줍니다.

## 버전 이력

| 버전 | 브랜치 | 내용 |
|---|---|---|
| v1 | `custom/1.13.3-v1-database-connectors-add` | Sybase 데이터베이스 서비스 커넥터 추가 |
| v2 | `custom/1.13.3-v1-database-connectors-add` | Tibero 데이터베이스 서비스 커넥터 추가 |
| v3 | `custom/1.13.3-v1-database-connectors-add` | DB2 UDB 데이터베이스 서비스 커넥터 추가 |

## v1 — Sybase 데이터베이스 서비스 커넥터 추가

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/src/main/resources/json/schema/entity/services/databaseService.json` | Sybase 서비스 타입 등록 |
| `openmetadata-ui/src/main/resources/ui/src/generated/**` (14개 파일) | Sybase 타입 반영 (재생성) |
| `openmetadata-ui/src/main/resources/ui/src/utils/ServiceIconUtils.ts` | Sybase 로고 등록 |
| `openmetadata-ui/src/main/resources/ui/src/utils/DatabaseServicePureUtils.ts` | Sybase 연결 스키마 매핑 등록 |

## v2 — Tibero 데이터베이스 서비스 커넥터 추가

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/src/main/resources/json/schema/entity/services/databaseService.json` | Tibero 서비스 타입 등록 |
| `openmetadata-ui/src/main/resources/ui/src/generated/**` (14개 파일) | Tibero 타입 반영 (재생성) |
| `openmetadata-ui/src/main/resources/ui/src/utils/ServiceIconUtils.ts` | Tibero 로고 등록 |
| `openmetadata-ui/src/main/resources/ui/src/utils/DatabaseServicePureUtils.ts` | Tibero 연결 스키마 매핑 등록 |

## v3 — DB2 UDB 데이터베이스 서비스 커넥터 추가

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/src/main/resources/json/schema/entity/services/databaseService.json` | DB2 UDB 서비스 타입 등록 |
| `openmetadata-ui/src/main/resources/ui/src/generated/**` (14개 파일) | DB2 UDB 타입 반영 (재생성) |
| `openmetadata-ui/src/main/resources/ui/src/utils/ServiceIconUtils.ts` | DB2 UDB 로고 등록 |
| `openmetadata-ui/src/main/resources/ui/src/utils/DatabaseServicePureUtils.ts` | DB2 UDB 연결 스키마 매핑 등록 |
