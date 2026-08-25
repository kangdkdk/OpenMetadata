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
| v3 | `custom/1.13.3-v2-instance-code-report-project-add` | Explore 트리 구조를 Databases와 동일 레벨로 변경 + ReportProject 아이콘 교체 |
| v4 | `custom/1.13.3-v2-instance-code-report-project-add` | 트리 노드 `isLeaf` 누락으로 인한 클릭 시 빈 화면 문제 수정 + 아이콘 재교체(작게 보이는 문제) |

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

## v3 — Explore 트리 구조를 Databases와 동일 레벨로 변경 + ReportProject 아이콘 교체

v2의 "KB Custom Entities" 상위 래퍼 노드를 제거하고, `Database`/`Dashboard`/`Pipeline`과
동일한 패턴(각각 독립된 `isRoot: true` 단일 노드)으로 변경 — InstanceCode, ReportProject가
각자 최상위 카테고리로 노출됨. ReportProject 아이콘을 `ChartIcon`에서 설정 메뉴에서 이미
"Query" 개념으로 쓰이는 `query-colored-new.svg`(`QueryIcon`)로 교체.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../utils/SearchClassBase.ts` | 래퍼 노드 제거, InstanceCode/ReportProject를 독립 루트 노드로 변경, ReportProject 아이콘을 QueryIcon으로 교체 |

## v4 — 트리 노드 클릭 시 빈 화면 수정 + 아이콘 재교체

v3까지의 두 노드는 `isLeaf`를 지정하지 않아 `Pipeline`/`Topic`처럼 "서비스 기준으로 하위
분류 가능한" 카테고리로 취급됐음 — `ExploreTree.tsx`의 `onLoadData`가 이런 노드에 대해
`service` 필드 기준 집계로 하위 트리를 동적 생성하려 시도하는데, InstanceCode/ReportProject는
`service` 개념이 없는 완전히 평평한(flat) 엔티티라 이 경로가 의미 없이 실행되며 클릭 동작이
꼬여 결과가 안 보이는 문제로 이어졌을 가능성이 높음. `Glossary`/`Tag`/`Metric`/`DataProduct`
처럼 진짜 평평한 엔티티들은 전부 `isLeaf: true`를 명시하는 패턴을 따르고 있었는데 최초
구현 시 이 패턴 대신 `Pipeline` 패턴을 잘못 참고함 — `isLeaf: true`와 `data.entityType`을
추가해 올바른 패턴으로 수정. ReportProject 아이콘도 `query-colored-new.svg`(89x89 뷰박스에
글리프가 30x30만 차지하는 배지형 아이콘이라 작은 트리 아이콘 크기에서 내용이 작게 보임)에서
`customproperties/sql-query.svg`(20x20 뷰박스, 트리 아이콘 크기에 맞는 SQL 문서 아이콘)로
재교체.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../utils/SearchClassBase.ts` | 두 노드에 `isLeaf: true`, `data.entityType`, `data.isStatic`, `data.dataId` 추가; ReportProject 아이콘을 `sql-query.svg`로 재교체 |
