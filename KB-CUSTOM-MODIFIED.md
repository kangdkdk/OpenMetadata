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
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | InstanceCode / ReportProject 신규 엔티티 추가 |
| v2 | `custom/1.13.3-v2-instance-code-report-project-add` | InstanceCode / ReportProject Explore 탐색창(트리) 노출 |

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

## 신규 엔티티: InstanceCodes/ReportProject 라인

## v1 — InstanceCode / ReportProject 신규 엔티티 추가

| 파일 | 기능 |
|---|---|
| `openmetadata-service/.../Entity.java` | `INSTANCE_CODE`, `REPORT_PROJECT` 엔티티 상수 등록 |
| `openmetadata-service/.../jdbi3/CollectionDAO.java` | `instanceCodeDAO()`, `reportProjectDAO()` 등록 |
| `openmetadata-service/.../search/SearchIndexFactory.java` | 두 엔티티 검색 인덱스 매핑 등록 |
| `openmetadata-spec/.../elasticsearch/indexMapping.json` | `instanceCode`, `reportProject` 인덱스 별칭 등록 |
| `bootstrap/sql/migrations/native/1.13.3/{mysql,postgres}/schemaChanges.sql` | `instance_code_entity`, `report_project_entity` 테이블 생성 |
| `skills/kb-seed-sample-data/scripts/seed_sample_data.py` | 샘플 테이블 정의 2개 → 5개로 확장 (`--tables 5` 지원) |

## v2 — InstanceCode / ReportProject Explore 탐색창(트리) 노출

`kb-entity-scaffold` 스킬의 프런트엔드 12개 연동 지점을 따라 두 엔티티를 Explore 좌측 트리에
새 루트 카테고리("KB Custom Entities")로 노출. 백엔드는 `indexMapping.json`의
`parentAliases`에 `dataAsset`을 추가해야 Explore 트리 카운트 집계(`dataAsset` 별칭 기반)에
잡히는 것이 이번에 새로 확인된 포인트 — 없으면 카운트 0으로 처리되어 트리 노드가 숨겨짐.

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/.../elasticsearch/indexMapping.json` | `instanceCode`/`reportProject`에 `dataAsset` parentAlias 추가 |
| `openmetadata-ui/.../enums/entity.enum.ts` | `EntityType.INSTANCE_CODE`/`REPORT_PROJECT` 추가 |
| `openmetadata-ui/.../enums/search.enum.ts` | `SearchIndex.INSTANCE_CODE`/`REPORT_PROJECT` 추가 |
| `openmetadata-ui/.../enums/Explore.enum.ts` | `ExplorePageTabs.INSTANCE_CODE`/`REPORT_PROJECT` 추가 |
| `openmetadata-ui/.../interface/search.interface.ts` | `InstanceCodeSearchSource`/`ReportProjectSearchSource` 추가 및 매핑 등록 |
| `openmetadata-ui/.../components/Explore/ExplorePage.interface.ts` | `ExploreSearchIndex` 유니온에 두 인덱스 추가 |
| `openmetadata-ui/.../utils/EntityLinkUtils.ts` | 검색 결과 클릭 시 상세 페이지로 가는 링크 생성 등록 |
| `openmetadata-ui/.../utils/EntityNameUtils.ts` | `EntityTypeName` 레코드에 두 엔티티 라벨 등록 |
| `openmetadata-ui/.../utils/EntityUtilClassBase.ts` | 상세 페이지 컴포넌트 및 `ResourceEntity` 매핑 등록 |
| `openmetadata-ui/.../utils/SearchClassBase.ts` | Explore 트리 신규 루트 노드, 엔티티↔검색인덱스 매핑, 탭 정보 등록 |
| `openmetadata-ui/.../context/PermissionProvider/PermissionProvider.interface.ts` | `ResourceEntity.INSTANCE_CODE`/`REPORT_PROJECT` 추가 |
| `openmetadata-ui/.../constants/mockTourData.constants.ts` | 투어 모크 카운트 객체에 누락되어 있던 `chart`/`tableColumn`과 신규 2개 엔티티 추가 |
| `openmetadata-ui/.../locale/languages/*.json` (19개 파일) | `yarn i18n`으로 라벨 키 동기화 |
