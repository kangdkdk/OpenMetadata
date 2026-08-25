# KB Custom - New Files Manifest

공식 코드베이스에 없던 완전히 새로운 파일(신규 생성) 목록입니다. 기존 파일 수정 이력은
`KB-CUSTOM-MODIFIED.md` 참고.

**신규 파일 명명 규칙**: 확장자 앞에 `-kb-cust` 접미사를 붙입니다 (예: `foo-kb-cust.ts`).
과거엔 `.kb-cust.`(점 2개) 규칙을 썼으나, 커넥션 스키마 JSON에서 `datamodel-code-generator`가
그 형태를 잘못 파싱해 인제스천 이미지 빌드를 깨뜨리는 문제가 있어 `-kb-cust`(하이픈)로
변경했습니다. **단, `openmetadata-spec/.../connections/**` 아래 다른 스키마가 `$ref`하는
커넥션 스키마 JSON 파일은 `-kb-cust`도 동일한 codegen 실패를 일으켜(2026-08-11 재현/수정,
`KB-CUSTOM-MODIFIED.md` v4 참고) `_kb_cust`(언더스코어)를 씁니다** — 예:
`sybaseConnection_kb_cust.json`. codegen 자체는 `.json` 스키마 파일만 처리하지만, 같은
커넥터의 생성된 `.ts` 타입 파일도 파일명을 맞춰 함께 `_kb_cust`로 리네임했습니다(필수는
아니고 가독성 목적).

**Java 예외**: public 클래스명은 파일명과 정확히 일치해야 하고 Java 식별자에는 하이픈도 점도
쓸 수 없어 `-kb-cust`를 그대로 쓸 수 없습니다. 대신 구두점 없는 CamelCase 접미사를 붙입니다 —
`FooKbCust.java` (클래스명 `FooKbCust`). 이름만으로는 하이픈 버전보다 눈에 덜 띄니 반드시 이
파일에 기록해서 추적하세요.

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/sybaseConnection_kb_cust.json` | Sybase 커넥터 - 연결 스키마 |
| v1 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/sybaseConnection_kb_cust.ts` | 위 스키마의 TypeScript 타입 |
| v1 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-sybase-kb-cust.png` | Sybase 정사각형 공식 로고 |
| v2 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/tiberoConnection_kb_cust.json` | Tibero 커넥터 - 연결 스키마 |
| v2 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/tiberoConnection_kb_cust.ts` | 위 스키마의 TypeScript 타입 |
| v2 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-tibero-kb-cust.png` | Tibero 정사각형 공식 로고 |
| v3 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/db2UDBConnection_kb_cust.json` | DB2 UDB 커넥터 - 연결 스키마 |
| v3 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/db2UDBConnection_kb_cust.ts` | 위 스키마의 TypeScript 타입 |
| v3 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-db2udb-kb-cust.png` | DB2 UDB 정사각형 공식 로고 |

## 신규 엔티티: InstanceCodes/ReportProject 라인

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-spec/src/main/resources/json/schema/entity/data/instanceCode-kb-cust.json` | InstanceCode 엔티티 스키마 |
| v1 | `openmetadata-spec/src/main/resources/json/schema/api/data/createInstanceCode-kb-cust.json` | InstanceCode 생성 API 스키마 |
| v1 | `openmetadata-service/.../jdbi3/InstanceCodeRepositoryKbCust.java` | InstanceCode 리포지토리 |
| v1 | `openmetadata-service/.../resources/data/InstanceCodeMapperKbCust.java` | InstanceCode 생성 요청 매퍼 |
| v1 | `openmetadata-service/.../resources/data/InstanceCodeResourceKbCust.java` | InstanceCode REST 리소스 (`/v1/instanceCodes`) |
| v1 | `openmetadata-service/.../search/indexes/InstanceCodeIndexKbCust.java` | InstanceCode 검색 인덱스 |
| v1 | `openmetadata-spec/.../elasticsearch/{en,jp,ru,zh}/instance_code_index_mapping.json` | InstanceCode ES 매핑 |
| v1 | `openmetadata-spec/src/main/resources/json/schema/entity/data/reportProject_kb_cust.json` | ReportProject 엔티티 스키마 |
| v1 | `openmetadata-spec/src/main/resources/json/schema/api/data/createReportProject-kb-cust.json` | ReportProject 생성 API 스키마 |
| v1 | `openmetadata-service/.../jdbi3/ReportProjectRepositoryKbCust.java` | ReportProject 리포지토리 |
| v1 | `openmetadata-service/.../resources/data/ReportProjectMapperKbCust.java` | ReportProject 생성 요청 매퍼 |
| v1 | `openmetadata-service/.../resources/data/ReportProjectResourceKbCust.java` | ReportProject REST 리소스 (`/v1/reportProjects`) |
| v1 | `openmetadata-service/.../search/indexes/ReportProjectIndexKbCust.java` | ReportProject 검색 인덱스 |
| v1 | `openmetadata-spec/.../elasticsearch/{en,jp,ru,zh}/report_project_index_mapping.json` | ReportProject ES 매핑 |
| v2 | `openmetadata-ui/.../generated/entity/data/instanceCode-kb-cust.ts` | InstanceCode TypeScript 타입 |
| v2 | `openmetadata-ui/.../generated/api/data/createInstanceCode-kb-cust.ts` | InstanceCode 생성 요청 TypeScript 타입 |
| v2 | `openmetadata-ui/.../rest/instanceCodeAPI-kb-cust.ts` | InstanceCode REST 클라이언트 |
| v2 | `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeDetailsPage-kb-cust.tsx` | InstanceCode 상세 페이지 |
| v2 | `openmetadata-ui/.../generated/entity/data/reportProject_kb_cust.ts` | ReportProject TypeScript 타입 |
| v2 | `openmetadata-ui/.../generated/api/data/createReportProject-kb-cust.ts` | ReportProject 생성 요청 TypeScript 타입 |
| v2 | `openmetadata-ui/.../rest/reportProjectAPI-kb-cust.ts` | ReportProject REST 클라이언트 |
| v2 | `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectDetailsPage-kb-cust.tsx` | ReportProject 상세 페이지 |
| v6 | `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectQueryModal-kb-cust.tsx` | 쿼리 추가/수정 모달 |
| v7 | `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeListPage-kb-cust.tsx` | 코드그룹별 카드 목록 |
| v7 | `openmetadata-ui/.../pages/InstanceCodePage/InstanceCodeGroupDetailsPage-kb-cust.tsx` | 그룹 내 코드 표 뷰 |
| v7 | `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectListPage-kb-cust.tsx` | 연도별 카드 목록 |
| v7 | `openmetadata-ui/.../pages/ReportProjectPage/ReportProjectYearDetailsPage-kb-cust.tsx` | 연도 내 ReportProject 목록 |
| v7 | `openmetadata-ui/.../utils/ReportProjectUtils-kb-cust.ts` | `updatedAt` 기반 연도 추출 유틸 |

## 신규 기능: 테이블 컬럼 메타데이터 확장 라인

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-ui/.../components/common/CustomPropertyTable/InstanceCodePopoverValue-kb-cust.tsx` | 컬럼 목록/커스텀 속성 패널에서 인스턴스명 클릭 시 InstanceCode 상세를 보여주는 팝오버 |

## 신규 기능: 테이블 데이터셋 정보 패널 라인

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-ui/.../components/Database/SchemaTable/DatasetInfoPanel-kb-cust.tsx` | Schema 탭에서 설명과 컬럼 목록 사이에 표시되는 "데이터셋 정보"/"데이터셋 운영 정보" 요약 패널 |
| v1 | `openmetadata-ui/.../components/Database/SchemaTable/ChangeHistoryModal-kb-cust.tsx` | "테이블 변경이력" 조회 클릭 시 뜨는 정렬 가능한 이력 표 모달 |

## 신규 기능: 테이블 인덱스 탭 라인

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-ui/.../pages/TableDetailsPageV1/TableIndexTab-kb-cust.tsx` | Schema 탭과 활동 피드 및 작업 탭 사이의 신규 "테이블 인덱스" 탭 — 인덱스별 컬럼을 rowSpan으로 묶어 표시 |
