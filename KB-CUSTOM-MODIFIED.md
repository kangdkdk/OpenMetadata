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
| v5 | `custom/1.13.3-v2-instance-code-report-project-add` | ES 매핑에 `entityType.keyword` 서브필드 누락으로 인한 검색 결과 0건 문제 수정 (진짜 원인) |
| v6 | `custom/1.13.3-v2-instance-code-report-project-add` | 상세 페이지 디자인 시스템 적용 + ReportProject 쿼리 CRUD·복사 기능 추가 |
| v7 | `custom/1.13.3-v2-instance-code-report-project-add` | InstanceCode 코드그룹 표 뷰 + ReportProject 연도별 그룹 뷰 추가 (참고 구현 이식) |

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

## v5 — 검색 결과 0건 문제의 진짜 원인 수정 (ES 매핑 `entityType.keyword` 누락)

v4까지 고쳐도 사용자가 트리 클릭 시 결과 패널이 계속 빈 목록으로 나온다고 재현 — 서버
액세스 로그(`docker logs openmetadata_server`)에서 브라우저가 실제로 보낸 쿼리를 그대로
확인한 결과, `{"term":{"entityType.keyword":"reportproject"}}`처럼 **`entityType.keyword`
서브필드 + 소문자 값**으로 필터링하고 있었음. 반면 우리 ES 매핑은 `entityType`을 서브필드
없는 단순 `keyword` 타입으로만 정의했고 저장된 값도 원본 그대로(`"reportProject"`,
`"instanceCode"`)라 이 쿼리와 전혀 매치되지 않아 결과가 항상 0건이었음 — 이게 v2~v4에서
계속 놓쳤던 진짜 원인. `metric_index_mapping.json` 등 공식 엔티티들의 매핑을 대조해서
`entityType`이 전부 `lowercase_normalizer`가 적용된 `.keyword` 서브필드를 갖는 패턴임을
확인하고 동일하게 수정. ES 인덱스를 삭제 후 재생성하고 샘플 데이터를 재시딩, 실제 브라우저가
보냈던 쿼리를 그대로 재실행해서 5건씩 정상 반환되는 것까지 확인.

**교훈**: 이번 엔티티 스캐폴딩에서 `entityType` 필드는 단순 `keyword` 타입으로 매핑하면 안
되고, 반드시 `.keyword` 서브필드(`lowercase_normalizer` 포함)를 갖춰야 함 — Explore
트리/퀵필터가 전부 이 서브필드 기준으로 쿼리를 만들기 때문. `kb-entity-scaffold` 스킬에도
반영 필요.

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/.../elasticsearch/{en,jp,ru,zh}/instance_code_index_mapping.json` | `entityType`에 `lowercase_normalizer` 적용된 `.keyword` 서브필드 추가 |
| `openmetadata-spec/.../elasticsearch/{en,jp,ru,zh}/report_project_index_mapping.json` | 위와 동일 |

## v6 — 상세 페이지 디자인 시스템 적용 + ReportProject 쿼리 CRUD·복사 기능

두 상세 페이지를 순수 HTML 테이블에서 `@openmetadata/ui-core-components`(Card, Table,
Badge, PageHeader 등) 기반으로 재작성 — `IntakeFormsPage`의 테이블+모달 CRUD 패턴을 그대로
참고. ReportProject 쪽에 쿼리 추가/수정/삭제(PATCH 기반, `fast-json-patch`의 `compare`로
`queries` 배열 통째 교체) + 클립보드 복사(기존 `CopyToClipboardButton` 재사용) 기능 추가.
백엔드 PATCH 자체는 이미 있던 `/v1/reportProjects/{id}` 엔드포인트를 그대로 사용, 프런트에
`patchReportProject` 함수만 추가. curl로 add/replace/remove 세 가지 JSON Patch 오퍼레이션을
전부 재현해 정상 동작 확인.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeDetailsPage-kb-cust.tsx` | Card 기반 디자인으로 재작성 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectDetailsPage-kb-cust.tsx` | Card/Table 기반 재작성, 쿼리 추가/수정/삭제/복사 버튼 추가 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectQueryModal-kb-cust.tsx` | 쿼리 추가/수정용 모달(신규) |
| `openmetadata-ui/.../rest/reportProjectAPI-kb-cust.ts` | `patchReportProject` 함수 추가 |
| `openmetadata-ui/.../locale/languages/*.json` (19개 파일) | 코드/정렬순서/등록일 등 라벨 키 추가, `yarn i18n`으로 동기화 |

## v7 — InstanceCode 코드그룹 표 뷰 + ReportProject 연도별 그룹 뷰 (참고 구현 이식)

사용자가 별도 WSL 환경(`\\wsl$\Ubuntu\home\kysmh\OpenMetadata`)에 이미 구현된 참고 화면을
제시 — InstanceCode는 코드그룹별 카드 목록 → 그룹 클릭 시 표(Table), ReportProject는
연도별 카드 목록 → 연도 클릭 시 목록. 참고 저장소의 `InstanceCodeListPage`/
`InstanceCodeGroupDetailsPage`/`QueryReportListPage`/`QueryReportYearDetailsPage`와
`ExploreTree.tsx`의 특수 케이스 네비게이션(트리 노드 클릭 시 필터 대신 전용 목록 페이지로
이동)을 그대로 참고해 이식.

**참고 구현과의 차이점**: 참고 저장소의 `QueryReport`는 이름에 연도가 박혀있는 네이밍
컨벤션(`P{year}...`)에서 정규식으로 연도를 추출하지만, 우리 `ReportProject`는 그런 네이밍
규칙이 없어 대신 `updatedAt` 타임스탬프에서 연도를 뽑아냄(`ReportProjectUtils-kb-cust.ts`).
또한 참고 저장소는 쿼리를 별도의 공식 `Query` 엔티티로 분리해 usage 연결로 관리하지만,
우리는 이미 v1에서 `queries`를 ReportProject의 임베디드 배열 필드로 설계했으므로 그
구조는 유지(백엔드 재설계 범위가 커서 이번엔 화면 구조만 이식).

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeListPage-kb-cust.tsx` | 코드그룹별 카드 목록(신규) |
| `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeGroupDetailsPage-kb-cust.tsx` | 그룹 내 코드 표 뷰 + 표 복사(신규) |
| `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeDetailsPage-kb-cust.tsx` | 개별 코드 상세 대신 그룹 페이지로 리다이렉트하도록 변경 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectListPage-kb-cust.tsx` | 연도별 카드 목록(신규) |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectYearDetailsPage-kb-cust.tsx` | 연도 내 ReportProject 목록(신규) |
| `openmetadata-ui/.../utils/ReportProjectUtils-kb-cust.ts` | `updatedAt` 기반 연도 추출 유틸(신규) |
| `openmetadata-ui/.../utils/RouterUtils.ts` | `getInstanceCodeGroupPath`, `getReportProjectYearPath` 추가 |
| `openmetadata-ui/.../constants/constants.ts` | `INSTANCE_CODES`/`INSTANCE_CODE_GROUP`/`REPORT_PROJECTS`/`REPORT_PROJECT_YEAR` 라우트 추가 |
| `openmetadata-ui/.../components/AppRouter/AuthenticatedAppRouter.tsx` | 위 4개 라우트 등록 |
| `openmetadata-ui/.../components/Explore/ExploreTree/ExploreTree.tsx` | 두 엔티티 트리 노드 클릭 시 퀵필터 대신 전용 목록 페이지로 이동하는 특수 케이스 추가 |
| `openmetadata-ui/.../utils/SearchClassBase.ts` | 트리 노드에서 지난 라운드에 추가했던 `isLeaf`/`entityType` 등 불필요해진 필드 제거(참고 구현과 동일하게 단순화) |
| `openmetadata-ui/.../locale/languages/*.json` (19개 파일) | `copy-table`/`unknown`/그룹·연도 설명 라벨 추가, `yarn i18n` 동기화 |
