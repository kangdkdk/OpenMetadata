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
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | 테이블 Schema 탭 컬럼 목록에 16개 메타데이터 필드 추가 (Custom Properties 기반) |
| v2 | `custom/1.13.3-v2-instance-code-report-project-add` | 신규 12개 컬럼을 "컬럼 관리" 드롭다운 뒤에 숨기지 않고 기본 노출로 변경 |
| v3 | `custom/1.13.3-v2-instance-code-report-project-add` | 16개 필드를 사용자가 요청한 정확한 순서로 재배열, 라벨을 요청 단어에 맞게 수정 |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | 테이블 Schema 탭에 "데이터셋 정보" 패널 + "테이블 변경이력" 조회 모달 추가 (Custom Properties 기반) |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | 테이블 상세 페이지에 "테이블 인덱스" 탭 신규 추가 (Schema 탭과 활동 피드 및 작업 탭 사이) |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | Explore 검색 결과 및 Schema 탭 컬럼 목록에 CSV 다운로드 버튼 추가 |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | CSV 한글 인코딩 수정 + 커넥터 아이콘 3종 교체 + 서비스타입 대소문자 수정 + ReportProject 상세 화면 개편 |
| v2 | `custom/1.13.3-v2-instance-code-report-project-add` | 홈 위젯 서비스타입 대소문자 수정 + ReportProject 요청정보 필드 추가 + InstanceCode 그룹 페이지 개편(라벨/정보박스/연관테이블) |
| v4 | `custom/1.13.3-v2-instance-code-report-project-add` | Sybase/Tibero/DB2 UDB 커넥터 스키마 파일명 `-kb-cust` → `_kb_cust` 수정 (datamodel-code-generator ingestion 빌드 실패 원인) |
| v3 | `custom/1.13.3-v2-instance-code-report-project-add` | ReportProject 상세/목록 화면에서 "유형" 필드 표시 제거, 쿼리 뷰어를 완전 읽기전용(nocursor)으로 변경 |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | Explore 탐색창/전역 검색에서 Column(테이블 컬럼) 항목 제거 |
| v1 | `custom/1.13.3-v2-instance-code-report-project-add` | User/Team 엔티티에 Custom Properties(extension) 지원 추가 |

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

## v4 — 커넥터 스키마 파일명 하이픈 버그 수정 (`-kb-cust` → `_kb_cust`)

내부망 배포용 `ingestion` amd64 Docker 이미지를 빌드하던 중 `Dockerfile.ci`의
`scripts/datamodel_generation.py`(JSON 스키마 → Python Pydantic 모델 생성, 서드파티
`datamodel-code-generator==0.25.6` 래퍼) 단계에서
`black.parsing.InvalidInput: ... from .connections.database import db2UDBConnection-kb-cust as db2UDBConnection_kb_cust ... bad input`
로 빌드가 실패. 원인 분석: 다른 스키마 파일이 `$ref`로 참조하는(=Python import 문이
생성되는) 스키마 파일명에 하이픈이 들어있으면, 생성기가 `as` 별칭 부분은 언더스코어로
올바르게 치환하지만 `import` 대상(파일명) 부분은 원본 그대로 남겨 문법적으로 잘못된
Python이 만들어짐 — 로컬 최소 재현으로 확인(스크래치 디렉터리에서
`datamodel-code-generator` 단독 실행, `db2UDBConnection-kb-cust.json`/
`sybaseConnection-kb-cust.json` 각각 동일 실패 재현). 대소문자 패턴과는 무관하고
순수하게 "cross-`$ref`되는 파일명의 하이픈" 자체가 원인임을 확인. 언더스코어로 바꾸면
(대소문자 등 나머지는 그대로 유지) 정상 생성됨을 재현 테스트로 검증 후 실제 파일 3개에
적용.

이전에 `CLAUDE.md`의 KB Custom Change Workflow에 기록되어 있던 "`.kb-cust.`(점 두 개)
→ `-kb-cust`(하이픈)로 바꿔서 이미 해결됨" 메모는 **cross-`$ref`되는 connection 스키마
파일에는 적용되지 않는 불완전한 결론**이었음이 이번에 드러남 — 해당 메모를 정정.

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/.../connections/database/db2UDBConnection-kb-cust.json` → `db2UDBConnection_kb_cust.json` | 파일명 리네임 (`$id`도 동일하게 수정) |
| `openmetadata-spec/.../connections/database/sybaseConnection-kb-cust.json` → `sybaseConnection_kb_cust.json` | 파일명 리네임 (`$id`도 동일하게 수정) |
| `openmetadata-spec/.../connections/database/tiberoConnection-kb-cust.json` → `tiberoConnection_kb_cust.json` | 파일명 리네임 (`$id`도 동일하게 수정) |
| `openmetadata-spec/.../entity/services/databaseService.json` | 3개 `$ref` 경로를 새 파일명으로 수정 |
| `openmetadata-ui/.../generated/entity/services/connections/database/{db2UDBConnection,sybaseConnection,tiberoConnection}-kb-cust.ts` → `_kb_cust.ts` | 파일명 리네임 (내용 변경 없음) |
| `openmetadata-ui/.../utils/DatabaseServicePureUtils.ts` | 3개 import 경로를 새 파일명으로 수정 |

**추가 발견 (같은 라운드)**: 실제 `ingestion` Docker 빌드를 재시도한 결과 동일한 버그가
`reportProject-kb-cust.json`(InstanceCode/ReportProject 라인, `createReportProject-kb-cust.json`이
`$ref`로 참조)에도 있었음 — 위 3개 커넥터 파일만 고치고 끝난 게 아니라, **커넥터 스키마에
국한된 문제가 아니라 "다른 스키마가 `$ref`하는 모든 `-kb-cust.json` 파일"에 공통되는 문제**임을
재확인. `openmetadata-spec` 전체 스키마 트리를 훑어 `$ref` 대상인 `-kb-cust.json` 파일을
전수 조사한 결과 이 4개 파일 뿐이었고(`createInstanceCode-kb-cust.json`,
`createReportProject-kb-cust.json`, `instanceCode-kb-cust.json`, `reportProject-kb-cust.json`),
그중 `reportProject-kb-cust.json`만 다른 스키마의 `$ref` 대상이라 실제로 문제가 됨을 확인.

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/.../entity/data/reportProject-kb-cust.json` → `reportProject_kb_cust.json` | 파일명 리네임 (`$id`도 동일하게 수정) |
| `openmetadata-spec/.../api/data/createReportProject-kb-cust.json` | 2개 `$ref` 경로를 새 파일명으로 수정 |
| `openmetadata-ui/.../generated/entity/data/reportProject-kb-cust.ts` → `reportProject_kb_cust.ts` | 파일명 리네임 (내용 변경 없음) |
| `openmetadata-ui/.../interface/search.interface.ts`, `rest/reportProjectAPI-kb-cust.ts`, `utils/ReportProjectUtils-kb-cust.ts`, `pages/ReportProjectPage/*-kb-cust.tsx` (4개) | import 경로를 새 파일명으로 수정 (총 7개 파일) |

## v3 — ReportProject "유형" 필드 표시 제거 + 쿼리 뷰어 읽기전용화

사용자 요청: (1) ReportProject 상세/연도별 목록 화면에 노출되던 "유형"(Daily/Weekly/
Monthly/Adhoc) 필드가 필요 없음 — 스키마 필드 자체(`reportProjectType`)는 백엔드에 그대로
두고 화면 노출만 제거(생성 UI가 없어 백엔드/시딩 스크립트에는 영향 없음). (2) 쿼리 카드가
`SchemaEditor`(CodeMirror 기반, `readOnly: true`)로 표시되는데, `readOnly: true`는
CodeMirror에서 클릭 시 여전히 포커스가 잡히고 커서가 깜빡임 — 완전히 클릭 불가능한
뷰어처럼 보이게 CodeMirror의 `readOnly: 'nocursor'` 옵션으로 교체(포커스/커서 자체를
비활성화하는 CodeMirror 전용 값, `true`와 다름).

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectDetailsPage-kb-cust.tsx` | "유형" Badge 카드 제거(미사용 `Badge` import도 제거), 쿼리 `SchemaEditor`를 `readOnly: 'nocursor'`로 변경 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectYearDetailsPage-kb-cust.tsx` | 목록 표에서 "유형" 컬럼 제거 |

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

## 신규 기능: 테이블 컬럼 메타데이터 확장 라인

## v1 — 테이블 Schema 탭 컬럼 목록에 16개 메타데이터 필드 추가 (Custom Properties 기반)

사용자 요청: 순서/컬럼명/PK여부/속성명/타입&길이/인스턴스명/인포타입/변수명/컬럼정의/
최종변경일시/업무규칙/암호화변환정보/암호화여부/사용자 정의 컬럼설명/태그/분류체계 항목
16개 필드를 Table 상세 페이지의 Schema 탭 컬럼 목록에 노출. 코어 `Column` JSON 스키마를
직접 확장하는 방법과 OpenMetadata 기본 Custom Properties(`Column.extension` 필드 재사용)
활용 방법 중 사용자가 후자를 명시적으로 선택 — 코어 스키마는 건드리지 않음.

**필드 매핑**: 5개는 기존 네이티브 Column 필드 재사용(컬럼명=`name`, 타입&길이=
`dataTypeDisplay`+`dataLength`, 태그=`tags` — 이미 노출 중; 순서=`ordinalPosition`,
PK여부=`constraint`— 이번에 컬럼 추가). 나머지 11개는 `tableColumn` Type(엔티티 타입
category, id `de29fcea-d1c4-4cd8-af33-f0a3e3c897eb`)에 새 Custom Property로 등록:
`attributeName`(string), `instanceCodeName`(entityReference, `entityTypes:["instanceCode"]`
로 InstanceCode에만 링크 제한), `infoType`/`isEncrypted`(enum — enum 값은 API상 배열로
전송해야 함, 단일값이어도 `["값"]` 형태 필요), `variableName`(string),
`columnDefinitionKbCust`(markdown), `lastModifiedDateTime`(dateTime-cp —
`customPropertyConfig.config`에 포맷 문자열 필수, 없으면 400），`businessRule`(markdown),
`encryptionTransformInfo`(string), `userDefinedColumnDescription`(markdown),
`classificationItem`(string).

**인스턴스명 팝오버**: `PropertyValue.tsx`의 기존 entityReference 렌더러
(`getEntityRefLinkValue`)는 페이지 이동 `<Link>`만 지원 — `item.type === EntityType.INSTANCE_CODE`
분기를 추가해 신규 `InstanceCodePopoverValue-kb-cust.tsx`로 위임. 이 컴포넌트는 컬럼
extension에 저장된 entityReference가 `id`/`type`만 갖고 `fullyQualifiedName`/`name`이
없다는 걸 실측으로 확인(추가로 hydrate되지 않음) — 그래서 `fullyQualifiedName` 기반 조회
대신 `id` 기반 `getInstanceCodeById`로 즉시(mount 시) 조회해 트리거 라벨과 팝오버 내용을
채움. `SchemaTable.component.tsx`에서도 동일 컴포넌트를 그대로 재사용.

**컬럼 노출**: Schema 탭 표는 이미 `defaultVisibleColumns`/`staticVisibleColumns` 기반의
컬럼 관리(show/hide) 드롭다운을 갖추고 있어(사용자별 로컬 저장) 신규 컬럼 전용 UI를 새로
만들 필요 없음. 새 11개 컬럼은 `columnCustomPropertyColumns`로 분리해 `columns` 배열에
합치고 `DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`는 그대로 둬 초기 화면은 기존과 동일, 나머지는
드롭다운에서 켜서 사용.

**재현성**: Custom Property는 런타임 API로 생성되는 DB 상태라 `docker compose down -v` 등
DB 초기화 시 사라짐 — `skills/kb-seed-sample-data/scripts/seed_sample_data.py`에
`column-custom-properties` 서브커맨드(멱등, 이미 존재하는 속성은 skip)를 추가해 재현 가능하게
함.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/Database/SchemaTable/SchemaTable.component.tsx` | 순서/PK여부 네이티브 컬럼 + 11개 Custom Property 컬럼 추가 |
| `openmetadata-ui/.../constants/TableKeys.constants.ts` | 신규 컬럼 키 12개 추가 |
| `openmetadata-ui/.../components/common/CustomPropertyTable/PropertyValue.tsx` | entityReference 렌더러에 InstanceCode 팝오버 분기 추가 |
| `openmetadata-ui/.../components/common/CustomPropertyTable/InstanceCodePopoverValue-kb-cust.tsx` | InstanceCode 상세를 보여주는 팝오버(신규) |
| `openmetadata-ui/.../rest/instanceCodeAPI-kb-cust.ts` | `getInstanceCodeById` 함수 추가 |
| `openmetadata-ui/.../locale/languages/*.json` (17개 파일) | 11개 신규 라벨 키 추가, `yarn i18n` 동기화 |
| `skills/kb-seed-sample-data/scripts/seed_sample_data.py` | `column-custom-properties` 서브커맨드(멱등) 추가 |

## v2 — 신규 컬럼 기본 노출로 변경

v1에서 신규 12개 컬럼(순서/PK여부 + 커스텀 속성 10개)을 기존 "컬럼 관리(Customize)" 드롭다운
토글 뒤에만 추가했더니, 사용자가 Schema 탭을 열어도 기존 4개 컬럼(설명/타입/태그/분류체계
용어)만 그대로 보이고 신규 컬럼은 전혀 안 보인다고 확인 — 드롭다운으로 켜야만 보이는 구조라
"화면에서 보고 싶다"는 요청과 안 맞음. `DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`에 신규 12개
키를 전부 추가해 페이지 최초 진입 시 기본으로 렌더링되도록 변경(사용자가 원하면 여전히
드롭다운으로 개별 숨김 가능).

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../constants/TableKeys.constants.ts` | `DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`에 신규 12개 컬럼 키 추가 |

## v3 — 16개 필드 순서/라벨 수정

사용자가 지정한 정확한 순서(순서→컬럼명→PK여부→속성명→타입&길이→인스턴스명→인포타입→
변수명→컬럼정의→최종변경일시→업무규칙→암호화변환정보→암호화여부→사용자 정의 컬럼설명→
태그→분류체계 항목)로 `columns` 배열을 재배열(antd Table의 실제 렌더 순서는 `columns` prop
배열 순서를 따르며 `DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`는 표시 여부만 결정하고 순서에는
영향 없음 — `getReorderedColumns`가 `columns` 배열 순서 기반으로 정렬함을 확인). 순서/컬럼명
두 컬럼을 `fixed: 'left'`로 나란히 고정해 스크롤 시에도 순서가 유지되도록 함. 기존
Description/글로서리 용어/Data Quality 컬럼은 요청 목록에 없어 기본 노출에서 제외(정의는
유지, 드롭다운으로 여전히 켤 수 있음).

라벨 수정: "순서" 컬럼이 기존 `label.ordinal-position`("서수 위치")을 재사용하고 있던 것을
지적받아 전용 키로 교체. "컬럼명"/"PK여부"/"타입&길이" 헤더도 전용 키 신설. 커스텀 속성
11개 중 10개는 v1에서 한국어 번역 없이 영어 폴백 텍스트(`yarn i18n`이 채운 placeholder)가
그대로 남아있던 버그를 발견 — ko-kr.json에 실제 한국어 텍스트로 수정.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/Database/SchemaTable/SchemaTable.component.tsx` | 컬럼 배열 순서 재배열, 타입 컬럼에 길이(dataLength) 결합 표시 |
| `openmetadata-ui/.../locale/languages/en-us.json` | 신규 라벨 키 4개 추가(`order-kb-cust`, `column-name-header-kb-cust`, `primary-key-flag-kb-cust`, `type-length-kb-cust`), `instance-code-name-kb-cust` 영문 텍스트 수정 |
| `openmetadata-ui/.../locale/languages/ko-kr.json` | 위 4개 신규 키 + 기존 10개 커스텀 속성 키의 한국어 번역 수정(영어 폴백 → 실제 한글) |

## 신규 기능: 테이블 데이터셋 정보 패널 라인

## v1 — "데이터셋 정보" 패널 + "테이블 변경이력" 조회 모달 추가

사용자가 첨부한 스크린샷 2장을 근거로, Table 엔티티의 Schema 탭에서 설명(Description)과
컬럼 목록(SchemaTable) 사이에 "데이터셋 정보"/"데이터셋 운영 정보" 요약 패널을 추가하고,
"테이블 변경이력" 옆 "조회" 클릭 시 정렬 가능한 이력 표 모달이 뜨도록 구현. 컬럼 확장과
동일하게 `table` 엔티티 타입(카테고리=entity)에 Custom Properties 14개를 등록해 Table의
기존 `extension` 필드에 저장 — 핵심 스키마 변경 없음.

필드 매핑: 시스템인프라(`systemInfraKbCust`, enum)/서버명(`serverNameKbCust`, string)/
스키마(`datasetSchemaKbCust`, string)/외부데이터여부(`externalDataYnKbCust`, enum)/
서버코드(`serverCodeKbCust`, string)/마이데이터여부(`myDataYnKbCust`, enum)/
최종적재일시(`lastLoadDateTimeKbCust`, dateTime-cp)/작업주기(`workCycleKbCust`, string)/
테이블신규일(`tableNewDateKbCust`, date-cp)/기준일자(`odateKbCust`, date-cp)/
휴일일경우(`holidayCaseKbCust`, string)/테이블종류(`tableTypeKbCust`, string)/
품질점검결과(`qualityCheckResultKbCust`, enum, "통과"/"실패")/
테이블변경이력(`changeHistoryKbCust`, string — JSON 배열 문자열로 직렬화). "플랫폼"
필드는 별도 속성을 만들지 않고 기존 `table.serviceType` + 서비스 아이콘을 재사용.

`table-cp`(테이블형 커스텀 속성) 타입은 최대 3컬럼 제약이 있어 5컬럼(변경년월일/변경구분/
변경대상/대상컬럼/변경상세내용)이 필요한 변경이력에는 부적합함을 확인 — 대신 `string` 타입에
JSON 배열을 직렬화해 저장하고, 전용 모달 컴포넌트가 직접 파싱/렌더링하도록 구현(범용
CustomPropertyTable 에디터에 의존하지 않는 읽기 전용 표시).

Table 상세 페이지 레이아웃은 `TableClassBase.getDefaultLayout()`의 위젯 그리드 설정으로
구동되는 공용 커스터마이즈 가능 레이아웃 엔진(`GenericTab`/`CommonWidgets`/
`LeftPanelContainer`)을 따로 확장하는 대신, `SchemaTable.component.tsx`(Schema 탭의
TABLE_SCHEMA 위젯 콘텐츠 자체) 최상단에 새 패널을 렌더링하는 방식으로 구현 — Description
위젯 바로 다음이 TABLE_SCHEMA 위젯이므로 시각적으로 "설명과 컬럼 사이"에 위치하면서도
공용 위젯/커스터마이즈 시스템(다른 엔티티 타입도 공유)을 건드리지 않는 저위험 경로.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/Database/SchemaTable/SchemaTable.component.tsx` | `DatasetInfoPanel` 임포트 및 컬럼 표 바로 위에 렌더링 |
| `openmetadata-ui/.../locale/languages/en-us.json` | 신규 라벨 키 21개 추가 (데이터셋 정보/운영 정보 패널 + 변경이력 모달) |
| `openmetadata-ui/.../locale/languages/ko-kr.json` | 위 21개 키의 실제 한국어 텍스트 (스크린샷 문구 그대로) |
| `skills/kb-seed-sample-data/scripts/seed_sample_data.py` | `table-info-custom-properties` 서브커맨드(멱등) 추가, 기존 컬럼 속성 생성 로직과 공통 헬퍼로 통합 |

## 신규 기능: 테이블 인덱스 탭 라인

## v1 — "테이블 인덱스" 탭 신규 추가

사용자 스크린샷(인덱스명/인덱스종류구분/유니크여부/컬럼순서/컬럼명/컬럼길이/인덱스정렬구분
표) 근거로, Table 상세 페이지의 기존 "Schema" 탭과 "활동 피드 및 작업" 탭 사이에 새 탭을
추가. 하나의 인덱스가 여러 컬럼으로 구성될 수 있어(복합 인덱스), 인덱스명/종류/유니크여부
3개 컬럼은 같은 인덱스에 속한 행끼리 rowSpan으로 병합해 스크린샷과 동일한 시각 효과를 냄.

데이터는 `table` 엔티티에 커스텀 속성 `tableIndexesKbCust`(string, JSON 배열 직렬화) 1개를
추가로 등록해 저장 — 변경이력(`changeHistoryKbCust`)과 동일한 이유로 `table-cp` 대신
`string`+JSON 직렬화 방식을 씀(인덱스 레코드가 7개 필드라 `table-cp`의 3컬럼 제약을 넘음).

새 탭을 등록하려면 `EntityTabs`에 신규 값 추가 → `TableClassBase.getTableDetailPageTabsIds()`
배열에서 SCHEMA와 ACTIVITY_FEED 사이에 삽입 → `TableTabsUtils.getTableDetailPageBaseTabs()`
반환 배열에도 동일한 위치에 탭 엔트리(`TabsLabel` + `children`) 추가, 3곳을 함께 수정해야
함을 기존 탭 등록 코드를 읽어 확인. `getDefaultLayout()`은 SCHEMA 탭 외에는 항상 빈 배열을
반환하므로 새 탭은 커스터마이즈 가능 위젯 그리드 시스템과 무관 — Activity Feed/Sample Data
등 다른 비-Schema 탭과 동일하게 전용 컴포넌트를 그대로 렌더링.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../enums/entity.enum.ts` | `EntityTabs.TABLE_INDEX_KB_CUST` 신규 값 추가 |
| `openmetadata-ui/.../utils/TableClassBase.ts` | `getTableDetailPageTabsIds()`에 새 탭 id를 Schema와 Activity Feed 사이에 삽입 |
| `openmetadata-ui/.../utils/TableTabsUtils.tsx` | `getTableDetailPageBaseTabs()`에 새 탭(`TabsLabel` + `TableIndexTab`) 등록 |
| `openmetadata-ui/.../locale/languages/en-us.json` | 신규 라벨 키 8개 추가 (탭 이름 + 표 헤더 6개, 컬럼명은 기존 `column-name-header-kb-cust` 재사용) |
| `openmetadata-ui/.../locale/languages/ko-kr.json` | 위 8개 키의 실제 한국어 텍스트 |
| `skills/kb-seed-sample-data/scripts/seed_sample_data.py` | `TABLE_CUSTOM_PROPERTIES`에 `tableIndexesKbCust` 추가 |

## 신규 기능: CSV 다운로드 버튼 라인

## v1 — Explore 검색 결과 + Schema 탭 컬럼 목록 CSV 다운로드 버튼

**Explore 검색 결과**: 이미 "Tools" 드롭다운 안에 "Export" 기능이 백엔드
(`GET /search/export`, `SearchResultCsvExporter.java` — Entity Type/Service Name/
Service Type/FQN/Name/Display Name/Description/Owners/Tags/Glossary Terms/Domains/Tier
컬럼)까지 완전히 구현되어 있던 것을 리서치로 확인 — 새로 만들지 않고, 같은
`handleOpenExportScopeModal` 핸들러를 재사용하는 별도의 눈에 띄는 "CSV 다운로드" 버튼을
툴바에 추가(기존 Tools 드롭다운 안의 Export 항목은 그대로 유지, 중복 진입점 제공).

**Schema 탭 컬럼 목록**: 컬럼 단위 CSV export는 백엔드에 없어서(테이블 전체 bulk-edit CSV만
있음) 신규 백엔드 없이 순수 프런트엔드로 구현 — 이미 로드되어 있는 `tableColumns` 배열을
그대로 사용해 16개 필드(순서/컬럼명/PK여부/속성명/타입&길이/인스턴스명/인포타입/변수명/
컬럼정의/최종변경일시/업무규칙/암호화변환정보/암호화여부/사용자 정의 컬럼설명/태그/
분류체계 항목) 순서 그대로 CSV 문자열을 만들고 `utils/Export/ExportUtils.ts`의 기존
`downloadFile()`(Blob + anchor 다운로드)을 재사용. enum 타입 커스텀 속성 값이 배열로
저장된다는 걸 이전 작업에서 이미 알고 있어 처음부터 배열/문자열 겸용 처리 로직을 넣음.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/ExploreV1/ExploreV1.component.tsx` | 툴바에 "CSV 다운로드" 버튼 추가 (기존 export-scope 모달 재사용) |
| `openmetadata-ui/.../components/Database/SchemaTable/SchemaTable.component.tsx` | 컬럼 목록 CSV 빌더 + 다운로드 버튼 추가 |
| `openmetadata-ui/.../locale/languages/en-us.json` | `csv-download-kb-cust` 라벨 키 추가 |
| `openmetadata-ui/.../locale/languages/ko-kr.json` | 위 키의 한국어 텍스트("CSV 다운로드") |

## 신규 기능: CSV 인코딩/커넥터 아이콘/ReportProject 개편 라인

## v1 — CSV 한글 인코딩 + 커넥터 아이콘 3종 + 서비스타입 대소문자 + ReportProject 화면 개편

**CSV 한글 깨짐 수정**: Excel(특히 한글 Windows)이 BOM 없는 UTF-8 CSV를 시스템 코드페이지로
잘못 해석해 한글이 깨지는 문제. Explore 검색 결과 CSV(백엔드 스트리밍)와 Schema 탭 컬럼
CSV(프런트 Blob 다운로드) 양쪽 모두 파일 맨 앞에 UTF-8 BOM(`EF BB BF`)을 추가.

**커넥터 아이콘 3종 교체**: 기존 Sybase/Tibero 아이콘은 실제 콘텐츠가 캔버스의 10~15%만
차지하는 여백투성이 워드마크 PNG라 작은 아이콘 크기로 축소하면 사실상 안 보이는 문제를
발견(PIL로 alpha bbox 확인: Tibero는 498x498 캔버스에 356x47 텍스트만). 두 로고를 실제
브랜드 색상(Sybase 네이비, Tibero 브랜드 블루 + 레드 액센트)을 유지한 채 텍스트가 꽉 차는
정사각 배지 스타일로 새로 제작. Db2UDB 아이콘은 기존에 "DB2"라고만 나오던 걸, 공식 Db2
아이콘(흑색+녹색 2톤, 둥근 사각형)과 같은 스타일로 "DB2"(상단 흑색)/"UDB"(하단 녹색) 두
줄로 재구성해 "Db2UDB"가 온전히 드러나도록 함.

**서비스타입 대소문자 버그**: "커넥터 타입 목록에 표시되는 이름이 소문자로 나온다"는 제보를
받고 실제 Explore 퀵필터 API 응답을 직접 조회해 원인 확정 — `table_index_mapping.json`의
`serviceType` 필드가 `lowercase_normalizer`를 쓰기 때문에(공식 매핑, Tibero/Sybase/Db2UDB
전용이 아니라 mysql/postgres 등 전체 커넥터에 영향) Elasticsearch 집계(aggregation) 버킷의
`key`가 전부 소문자로 반환됨. 반면 REST API(`GET /services/databaseServices`)로 직접 조회한
`serviceType` 값은 정상적으로 대소문자가 살아있음을 확인 — 즉 문제는 MySQL 원본 데이터가
아니라 ES 집계 결과를 그대로 필터 라벨로 쓰는 프런트 로직(`getOptionsFromAggregationBucket`)
에 있었음. 매핑의 normalizer를 건드리면 기존 대소문자 무관 필터링 동작이 깨질 위험이 있어
매핑은 그대로 두고, 프런트에서 `serviceType` 퀵필터일 때만 소문자 버킷 키를 8개
서비스타입 enum(Database/Dashboard/Messaging/Pipeline/MlModel/Metadata/Storage/Search)
전체에서 대소문자 무관 역매핑해 올바른 표기로 복원하는 방식으로 수정 — 재인덱싱 불필요.

**ReportProject 상세 화면 개편**: 쿼리가 항상 정확히 1개뿐이라는 걸 사용자에게 확인받은 후,
기존 "쿼리 추가/테이블 목록/행별 수정삭제" 구조를 걷어내고 설명 카드 → 쿼리 카드(SQL
문법강조 에디터로 크게 표시) 순서의 단순한 레이아웃으로 교체. 복사/수정 버튼은 카드 헤더에
그대로 유지, 추가/삭제 버튼과 다중 쿼리 표는 제거(쿼리가 아직 없을 때만 "추가" 버튼이 빈
상태 CTA로 남음).

| 파일 | 기능 |
|---|---|
| `openmetadata-service/.../search/SearchRepository.java` | `exportSearchResultsCsvStream`에 UTF-8 BOM 프리픽스 추가 |
| `openmetadata-ui/.../components/Database/SchemaTable/SchemaTable.component.tsx` | 클라이언트 CSV 빌드 결과에 UTF-8 BOM 프리픽스 추가 |
| `openmetadata-ui/.../utils/AdvancedSearchPureUtils.ts` | `getOptionsFromAggregationBucket`에 `fieldKey` 파라미터 추가, `serviceType` 필드일 때 대소문자 복원 |
| `openmetadata-ui/.../components/Explore/ExploreQuickFilters.tsx` | 위 함수 호출 시 `key`(필드명) 전달 |
| `openmetadata-ui/.../assets/img/service-icon-sybase-kb-cust.png` | 정사각 배지 스타일로 재제작 |
| `openmetadata-ui/.../assets/img/service-icon-tibero-kb-cust.png` | 정사각 배지 스타일로 재제작 |
| `openmetadata-ui/.../assets/img/service-icon-db2udb-kb-cust.png` | 공식 Db2 아이콘 스타일(흑+녹 2톤)로 재제작, "DB2"/"UDB" 표기 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectDetailsPage-kb-cust.tsx` | 리스트/표 구조 제거, 설명+단일 쿼리 카드 레이아웃으로 개편 |
| `openmetadata-ui/.../styles/components/code-mirror.less` | `.report-project-query-editor-kb-cust` 클래스 추가 (큰 SQL 에디터용) |

## v2 — 홈 위젯 대소문자 + ReportProject 요청정보 필드 + InstanceCode 그룹 페이지 개편

**홈 위젯 서비스타입 대소문자**: v1에서 Explore 퀵필터의 서비스타입 대소문자는 고쳤지만,
사용자가 홈 화면 "데이터 자산들" 위젯 스크린샷을 보내와 sybase/tibero만 소문자로 보이는
걸 재확인 — 조사해보니 이 위젯은 v1에서 고친 `AdvancedSearchPureUtils.
getOptionsFromAggregationBucket`을 안 거치고 `entityUtilClassBase.getFormattedServiceType()`
→ `FormattedDatabaseServiceType` enum(모든 공식 커넥터의 "예쁜" 표시명을 담은 enum,
예: `Mysql = "MySQL"`, `MariaDB = "Maria DB"`)을 직접 쓰는 별도 경로였음. 이 enum에
Sybase/Tibero/Db2UDB 항목이 애초에 빠져있어서 매핑 실패 시 원본(소문자 ES 버킷 키) 그대로
노출된 게 진짜 원인 — v1의 수정은 그대로 유효하되 이 enum이 더 근본적인 지점이라 여기에도
3개 항목을 추가. 아이콘 자체는 이미 정상 렌더링되고 있었음(별도 대소문자 무관 매핑을 쓰는
`getServiceIcon`).

**ReportProject 요청정보 필드**: 설명과 쿼리 사이에 의뢰부서\|의뢰직원, IT담당부서\|담당직원,
의뢰년월일을 보여주는 칸 추가 요청 — InstanceCode/ReportProject는 Table과 달리 `extension`
필드(Custom Properties 저장소)가 애초에 없는 자체 커스텀 엔티티라, Custom Properties 대신
5개 필드(`requestDeptKbCust`/`requestEmployeeKbCust`/`itOwnerDeptKbCust`/
`itOwnerEmployeeKbCust`/`requestDateKbCust`)를 네이티브 필드로 스키마에 직접 추가(우리가
전적으로 소유한 엔티티라 핵심 스키마 오염 우려 없음). 추가 후 PATCH로 값을 넣었더니 API는
200을 반환하는데 실제로는 저장이 안 되는 버그 발견 — 원인은
`ReportProjectRepositoryKbCust`의 `PATCH_FIELDS`/`UPDATE_FIELDS` 상수가
`"displayName,description,type,queries"`로 하드코딩된 필드 화이트리스트였고, 새 필드가
여기 없어서 OpenMetadata의 `EntityRepository` 프레임워크가 PATCH를 허용된 필드만 조용히
반영하고 나머지는 버렸던 것 — MySQL의 실제 저장된 JSON을 직접 조회해서 확정(API 200 응답과
DB 실제 상태가 다르다는 걸 발견하는 데 시간이 걸림). 화이트리스트에 5개 필드 추가 +
`entitySpecificUpdate()`에 변경이력 추적 로직도 함께 추가하고 나서야 정상 저장 확인.

**InstanceCode 그룹 페이지 개편**: "세부사항" 섹션 제목을 "인스턴스코드"로 변경, 표 컬럼을
코드값/코드명에서 "업무 인스턴스 코드"/"업무 인스턴스 내용"으로(등록일시 유지), 제목과 표
사이에 인스턴스 정의/인스턴스 식별자/표준구분이 무엇을 뜻하는지 설명하는 고정 안내 박스
추가, 오른쪽에 "연관테이블" 패널 추가 — 이 그룹의 인스턴스 코드를 `인스턴스명` 컬럼 커스텀
속성으로 참조하고 있는 테이블/컬럼을 보여줌. 연관테이블 조회를 위한 전용 백엔드 엔드포인트가
없어 `GET /tables?fields=columns,extension`으로 전체 테이블을 가져와 클라이언트에서
`column.extension.instanceCodeName.id`가 현재 그룹의 인스턴스 코드 id 집합에 속하는지
필터링하는 방식으로 구현(데모 규모 데이터셋 전제, 프로덕션 규모라면 전용 검색 인덱싱 필요).

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../utils/EntityUtils.interface.ts` | `FormattedDatabaseServiceType`에 `Sybase`/`Tibero`/`Db2UDB` 항목 추가 |
| `openmetadata-spec/.../entity/data/reportProject-kb-cust.json` | 요청정보 필드 5개 추가 |
| `openmetadata-spec/.../api/data/createReportProject-kb-cust.json` | 위 5개 필드를 생성 요청 스키마에도 추가 |
| `openmetadata-service/.../resources/data/ReportProjectMapperKbCust.java` | 생성 요청 → 엔티티 매핑에 5개 필드 추가 |
| `openmetadata-service/.../jdbi3/ReportProjectRepositoryKbCust.java` | `PATCH_FIELDS`/`UPDATE_FIELDS` 화이트리스트에 5개 필드 추가(누락 시 PATCH가 200을 반환하면서도 조용히 무시됨), 변경이력 추적 로직 추가 |
| `openmetadata-ui/.../generated/entity/data/reportProject-kb-cust.ts` | TS 타입에 5개 필드 추가 |
| `openmetadata-ui/.../generated/api/data/createReportProject-kb-cust.ts` | TS 생성 요청 타입에 5개 필드 추가 |
| `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectDetailsPage-kb-cust.tsx` | 설명과 쿼리 카드 사이에 요청정보 3열 박스 추가 |
| `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeGroupDetailsPage-kb-cust.tsx` | 섹션 제목/컬럼 라벨 변경, 정의 안내 박스 추가, 연관테이블 패널 추가(2단 레이아웃) |
| `openmetadata-ui/.../locale/languages/en-us.json`, `ko-kr.json` | 위 기능들에 필요한 신규 라벨/설명 키 추가 |

## 신규 기능: Column 탐색/검색 숨김 라인

## v1 — Explore 탐색창/전역 검색에서 Column 제거 + 오래된 샘플 데이터 정리

사용자 스크린샷 근거: Explore 좌측 탐색창의 "데이터베이스들" 하위에 개별 테이블 컬럼이
`transaction_id`, `account_no`처럼 최상위 카드로 노출되고 있었음(예: "Sample_Mysql /
sample_database / sample_schema / 계좌거래내역 / transaction_id"). 두 단계로 나눠 수정:

**1단계 (프런트엔드)**: `SearchClassBase.ts`의 Explore 트리 `childEntities`와 전역 검색
타입 드롭다운(`getGlobalSearchOptions()`)에서 `EntityType.TABLE_COLUMN`/`SearchIndex.COLUMN`
제거, 상단 검색창 자동완성(`Suggestions.tsx`)에서도 컬럼 결과 그룹 렌더링 제거. 이것만으로는
Explore 기본 진입 화면(트리/드롭다운에서 아무 것도 선택 안 한 "데이터 자산들" 기본 뷰)에서
컬럼이 계속 노출되는 문제가 안 고쳐짐 — 이 기본 뷰는 `SearchIndex.DATA_ASSET`(ES
`dataAsset` 별칭)을 그대로 질의하는데, 이 별칭이 실제로 어떤 인덱스를 묶는지는 프런트엔드가
아니라 백엔드 `indexMapping.json`의 `parentAliases` 설정이 결정하기 때문.

**2단계 (백엔드, 진짜 원인)**: `openmetadata-spec/.../elasticsearch/indexMapping.json`에서
`tableColumn` 엔트리의 `parentAliases`가 `["all", "table", "dataAsset"]`로 돼 있어 컬럼
전용 ES 인덱스(`column_search_index`)가 `dataAsset`/`all` 별칭에도 묶여 있었음 — Explore
기본 뷰와 상단 검색창 자동완성(`Suggestions.tsx`도 동일하게 `SearchIndex.DATA_ASSET`을
기본값으로 씀) 둘 다 이 별칭을 질의하므로 컬럼이 계속 섞여 나왔음. `table` 별칭만 남기고
`all`/`dataAsset`을 제거 → 컬럼 전용 인덱스가 더 이상 기본 뷰/전역 검색에 섞이지 않음(개별
테이블 상세 페이지의 Schema 탭 등 `table` 별칭 기반 기능은 영향 없음).

**ES 별칭 변경은 코드 배포만으로는 반영 안 됨**: 별칭은 인덱스 생성 시점에 고정되므로
`openmetadata-ops.sh drop-indexes` → `create-indexes`로 전체 인덱스를 재생성해야 새
`parentAliases` 설정이 실제로 적용됨(v5에서도 동일하게 겪은 문제). 재생성 직후 인덱스가
비어 있어 `SearchIndexingApplication` 앱을 트리거(`POST /api/v1/apps/trigger/...`)해 DB
기준으로 전체 재색인 — 이 과정에서 `reindex` CLI 서브커맨드만으로는 InstanceCode/
ReportProject 같은 커스텀 엔티티가 재색인에서 누락되는 것을 발견(둘 다 검색 결과 0건),
`entities: ["all"]`로 설정된 `SearchIndexingApplication`을 대신 트리거하니 정상적으로
5건/4건 복구됨 — 향후 전체 재인덱싱이 필요하면 CLI `reindex`보다 이 앱 트리거 방식을
우선 사용할 것.

**오래된 샘플 데이터 정리**: 사용자가 스크린샷 속 결과가 예전에 시딩해둔 테스트 데이터라는
것도 함께 지적, 완전 삭제를 명시적으로 확인받고 `skills/kb-seed-sample-data`로 생성된 11개
샘플 데이터베이스 서비스(`kb_cust_{mysql,postgres,mssql,oracle,hive,glue,db2,db2udb,mariadb,sybase,tibero}_demo`)를
전부 `DELETE .../databaseServices/{id}?hardDelete=true&recursive=true`로 하드 삭제(하위
database/schema/table/column 전부 cascade 삭제). InstanceCode/ReportProject 샘플 데이터는
삭제 대상이 아니었고 실제로 영향 없음을 확인.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../utils/SearchClassBase.ts` | Explore 트리 `childEntities`와 `getGlobalSearchOptions()`에서 Column 항목 제거 |
| `openmetadata-ui/.../components/AppBar/Suggestions.tsx` | 전역 검색 자동완성에서 Column 결과 그룹 제거 |
| `openmetadata-spec/.../elasticsearch/indexMapping.json` | `tableColumn`의 `parentAliases`에서 `all`/`dataAsset` 제거(`table`만 유지) |

## 신규 기능: User/Team Custom Properties 지원 라인

## v1 — User/Team 엔티티에 extension(Custom Properties) 지원 추가

`datahub/hris_account_to_openmetadata.py` 작성 중 발견: 이 OpenMetadata 버전(1.13.3)은
Table/Column과 달리 **User/Team 엔티티가 Custom Properties를 아예 지원하지 않음** —
`metadata/types` API에 "user"/"team"이 존재조차 하지 않았음(`GET
/api/v1/metadata/types?category=entity`에 39개 타입만 있고 둘 다 누락). 원인 확정:
`table.json`에는 있는 `"$comment": "@om-entity-type"` 마커가 `user.json`/`team.json`에는
없었고, `extension` 필드 자체도 스키마에 없었음.

사용자에게 (1) 스키마에 extension 추가해서 정식 지원 vs (2) description 필드에 텍스트로
욱여넣기 중 확인받고 전자로 진행. 스키마 수정만으로는 부족했고 실제 API 테스트로 2단계
버그를 추가로 발견:

1. **컨테이너 재생성만으로 `user`/`team`이 `metadata/types`에 자동 등록됨**(마이그레이션
   재실행 불필요, 서버 부팅 시 스키마를 스캔해서 등록하는 것으로 보임) — 39개 → 41개로 증가
   확인.
2. **Team은 정상 저장되는데 User만 `extension`이 계속 `null`로 저장됨**: `TeamMapper`는
   공용 `EntityMapper.copy()` 헬퍼를 써서 `extension`을 자동으로 복사하지만, User는
   `UserResource`가 `EntityMapper`가 아니라 별도의 정적 유틸리티
   `UserUtil.getUser(String, CreateUser)`로 엔티티를 만드는데 이 메서드가 `extension`을
   빼먹고 있었음(CREATE와 PUT 기반 createOrUpdate 둘 다 이 경로를 탐). `UserMapper.java`도
   똑같이 `extension`이 빠져있어서 같이 고쳤지만, 실제 REST 엔드포인트가 쓰는 건
   `UserUtil.getUser()` 쪽이었고 이걸 안 고쳤을 때는 재현 테스트에서 여전히 `extension:
   null`이 나와서 발견함 — REST 리소스가 실제로 어느 매핑 코드를 타는지 직접 추적해서
   확인한 것이지 추측 아님.
3. **스크립트 자체 버그(Java 아님)**: `hris_account_to_openmetadata.py`의 부모 팀 연결
   2단계 PUT이 `{name, teamType, parents}`만 보내서, PUT이 병합이 아니라 완전 교체라
   1단계에서 넣은 `displayName`/`extension`이 지워짐 — 2단계도 전체 payload를 재전송하도록
   수정.

세 가지 다 실제 테스트 데이터(팀 계층 2단계, 직원 5명, DB계정-테이블권한 3건)로 저장→재조회
확인 완료.

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/.../entity/teams/user.json` | `$comment: @om-entity-type` 마커 추가, `extension` 필드 추가 |
| `openmetadata-spec/.../entity/teams/team.json` | 위와 동일 |
| `openmetadata-spec/.../api/teams/createUser.json` | `extension` 필드 추가 |
| `openmetadata-spec/.../api/teams/createTeam.json` | `extension` 필드 추가 |
| `openmetadata-service/.../jdbi3/UserRepository.java` | `USER_PATCH_FIELDS`/`USER_UPDATE_FIELDS`에 `extension` 추가 |
| `openmetadata-service/.../jdbi3/TeamRepository.java` | `TEAM_PATCH_FIELDS`/`TEAM_UPDATE_FIELDS`에 `extension` 추가 |
| `openmetadata-service/.../resources/teams/UserMapper.java` | `createToEntity()`에 `.withExtension(create.getExtension())` 추가 |
| `openmetadata-service/.../util/UserUtil.java` | `getUser()`(실제 REST 경로가 타는 메서드)에 `.withExtension(create.getExtension())` 추가 — 진짜 원인 |

## 신규 기능: User 프로필 페이지 인사정보 표시 라인

## v1 — 직급/직책/전화번호/담당업무를 프로필 카드·호버 카드에 표시

User `extension`(HRIS 커스텀 프로퍼티: `kbJobtlName`/`kbJobclName`/`kbExno`/
`kbTaskAssignmentName`)을 프로필 사이드바 이름 아래, 좌측 연락처 카드, 그리고 사용자
호버(Popover) 카드에 모두 동일하게 노출.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/ProfileCard/ProfileSectionUserDetailsCard.component.tsx` | 이름 아래 `positionAndLevel`(직급/직책) 텍스트 추가 |
| `openmetadata-ui/.../components/Settings/Users/UsersProfile/UserProfileContactInfo-kb-cust.tsx` | 신규: 전화번호/담당업무 표시 카드(읽기 전용) |
| `openmetadata-ui/.../components/Settings/Users/Users.component.tsx` | 위 카드를 프로필 사이드바에 배치 |
| `openmetadata-ui/.../components/common/PopOverCard/UserPopOverCard.tsx` | `EXTENSION` 필드 fetch 추가, `UserContactInfo` 컴포넌트로 호버 카드에도 동일 정보 표시 |
| `openmetadata-ui/.../pages/UserPage/UserPage.component.tsx` | 메인 유저 데이터 fetch에 `EXTENSION` 필드 추가 |
| `openmetadata-ui/.../generated/entity/teams/user.ts` / `team.ts` | `extension?: any;` 필드 수동 추가(백엔드 재생성만으로 동기화 안 됨) |
| `openmetadata-ui/.../locale/languages/en-us.json` / `ko-kr.json` | `label.duty-kb-cust` 키 추가 |

## 신규 기능: 로그인 후 버전 업데이트/GitHub 팝업 제거 라인

## v1 — `PopupAlertsCardsClassBase.alertsCards()`가 빈 배열 반환하도록 변경

내부망(폐쇄망) 배포 대상이라 로그인 직후 뜨는 두 팝업이 문제: (1) "새 버전 출시" 안내
(`WhatsNewAlert`, OM 자체 `/version` API만 호출해서 안전하지만 어차피 불필요), (2) "Star us
on GitHub" 카드(`GithubStarCard`, `https://api.github.com/repos/open-metadata/OpenMetadata`로
실제 외부 네트워크 요청을 보내서 폐쇄망에서 실패/지연 유발). `NavBar.tsx`가
`PopupAlertsCardsClassBase.alertsCards()`가 반환하는 목록을 렌더링하는 구조라, 두 컴포넌트
import와 배열 항목을 제거하고 빈 배열을 반환하도록 수정.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/.../components/NavBar/PopupAlertClassBase.ts` | `WhatsNewAlert`/`GithubStarCard` import 및 배열 항목 제거, `alertsCards()`가 `[]` 반환(타입 명시로 `never[]` 추론 TS 에러 회피) |

배포 검증 중 발견한 별개 이슈(수정 완료, 코드 변경 아님): 이번 세션에서 여러 차례
`mvn -pl openmetadata-ui install`을 반복 실행하면서 `openmetadata-ui/target/classes/assets`
디렉터리가 한 번도 `clean`되지 않아 이전 빌드들의 JS 청크가 계속 누적됐음(같은
`AuthenticatedRoutes-*.js` 파일이 19개나 쌓여있었고, 그중 옛날 청크에 제거 대상 코드가 여전히
남아있어서 배포된 jar에서 문자열이 계속 검출됨 — 최신 소스 코드 문제가 아니라 누적된 stale
빌드 산출물 문제였음). `target/classes/assets` 삭제 후 재빌드하여 해결(jar 크기도
349MB → 46MB로 정상화). 앞으로 UI를 반복 재빌드할 때는 `mvn clean`을 끼워 넣거나
`target/classes/assets`를 수동 삭제하는 것을 권장.
