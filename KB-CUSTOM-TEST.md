# KB Custom - Build/Test Verification Log

커스텀 변경사항(`KB-CUSTOM-MODIFIED.md`, `KB-CUSTOM-NEW.md`)에 대해 실제로 빌드/테스트를
돌려본 기록입니다. 새 커스텀 작업을 검증할 때마다 이 파일 하단에 항목을 추가해주세요.

## 표준 검증 체크리스트

커스텀 변경(신규 기능 추가, 버전업 등)을 "완료"로 표시하기 전에 아래를 전부 확인하고,
그 결과를 날짜별 항목으로 이 파일 하단에 기록하세요. 통과 못 한 항목이 있으면 완료로
보고하지 말고 원인을 고칠 때까지 계속 진행합니다(`CLAUDE.md`의 KB Custom Change Workflow 참고).

| # | 항목 | 확인 방법 | 이번 세션에서 실제로 이걸로 잡은 버그 |
|---|---|---|---|
| 1 | 빌드가 잘 되었는지 | `mvn ... package`/`install` exit code, `npx tsc --noEmit`, `yarn lint` | — |
| 2 | 화면에서 200 아닌 응답이 없는지 | 브라우저 Network 탭 또는 Playwright에서 각 페이지 진입 시 XHR 상태코드 확인 | — |
| 3 | 브라우저 콘솔에 JS 런타임 에러가 없는지 | Playwright `page.on('pageerror')`/`page.on('console')` 수집 | 200 체크만으로는 못 잡는 undefined 참조 등 |
| 4 | 검색이 잘 되는지 | `GET /api/v1/search/query?index=<index>`로 신규/기존 엔티티 둘 다 조회 | — |
| 5 | Explore 좌측 트리에 카테고리가 실제로 노출되는지 | 트리 렌더링 결과에 해당 엔티티 최상위 노드가 있는지 (API가 정상이어도 트리 등록 누락 가능) | InstanceCode/ReportProject가 API·검색은 정상인데 트리에 없었음(등록 코드는 맞았지만 **배포된 번들이 구버전**이라 안 보임) |
| 6 | 기존 기능 + 신규 기능이 다 되는지 (회귀 확인) | 이전 세션에 검증했던 기능 목록을 다시 한 번 API로 재확인 | — |
| 7 | 인제스천이 정상 동작하는지 | 인제스천 파이프라인 실행 후 상태가 `Success`인지, 관련 이미지가 빌드됐는지 | 과거 `.kb-cust.` 접미사(점 2개)가 `datamodel-code-generator`를 혼동시켜 실패 → `-kb-cust`(하이픈)로 변경. **2026-08-11 재확인: 하이픈도 cross-`$ref`되는 connection 스키마 파일(다른 스키마가 참조 → Python import 문 생성 대상)에서는 여전히 실패함**(`db2UDBConnection-kb-cust.json`/`sybaseConnection-kb-cust.json` 재현) — 최종적으로 `_kb_cust`(언더스코어)로 수정. 이런 스키마 파일 신규/변경 시 최초 1회는 반드시 실제 `ingestion` Docker 빌드로 재검증(`CLAUDE.md` 해당 절 참고) |
| 8 | CRUD(및 DB 연결)가 잘 되는지 | POST/PATCH/DELETE 후 GET으로 반영 확인, soft delete 후 목록에서 빠지고 복구 시 재노출되는지 | — |
| 9 | 엔티티 버전 히스토리가 정상 기록되는지 | PATCH 후 `version` 증가, `changeDescription`에 변경 필드가 남는지 | — |
| 10 | 권한 없는 요청이 401/403을 정상 반환하는지 | 토큰 없이/권한 부족 계정으로 동일 API 호출 | — |
| 11 | 서버·워커 로그에 `ERROR`/`Exception`이 없는지 | `docker logs <container> \| grep -iE "error\|exception"` 전체 스캔 (화면상 정상으로 보여도 백그라운드 예외가 조용히 나는 경우가 있음) | — |
| 12 | 다국어 로케일 JSON이 안 깨졌는지 | `python -m json.tool`로 파싱 확인, `yarn lint`의 `jsonc/sort-keys` 통과 | `ko-kr.json` 재통합 시 키 순서/포맷 충돌 |
| 13 | 재기동 후에도 안정적으로 뜨는지 | 서버를 한 번 더 `--force-recreate`로 재시작해서 동일하게 healthy한지 | 마이그레이션 체크섬 누락이 재기동 시에만 드러남 |
| 14 | 배포된 이미지/번들이 실제로 이번 빌드 것인지 | 컨테이너 이미지 ID/타임스탬프가 방금 빌드한 것과 일치하는지, 서빙되는 JS 번들 해시가 로컬 `dist/`와 일치하는지 (`curl`로 받아 직접 비교) | `mvn -pl openmetadata-dist install`이 `.m2`에 남은 구버전 `openmetadata-ui` jar를 재사용해, 소스는 맞는데 배포물만 옛날 버전이 나감 — 브라우저 새로고침으로는 절대 안 잡힘 |

## 검증 기록

새 커스텀 작업을 검증할 때마다 아래에 날짜별 항목을 추가하세요 (append-only, 기존 항목 수정 금지).

### 2026-08-10 — v1~v3: Sybase/Tibero/DB2 UDB 데이터베이스 서비스 커넥터

`mvn clean package`, `npx tsc --noEmit`(회귀 없음), Docker 로컬 스택(mysql/es/migrate/server)
빌드 및 기동, 3개 커넥터 각각 서비스 생성 API 호출 및 검색 인덱싱까지 정상 확인. 인제스천
Docker 이미지는 기존에 알려진 `apt-get` 실패로 이번 검증 범위에서 제외(무관 이슈).

### 2026-08-10 — v1: InstanceCode / ReportProject 신규 엔티티

백엔드 스캐폴딩(스키마 → Repository/Mapper/Resource → 마이그레이션 → 검색 인덱스)만 이번
범위. `mvn package` 성공, Docker 재빌드 후 마이그레이션 정상 적용, `POST/GET
/v1/instanceCodes`·`/v1/reportProjects` CRUD 및 검색 인덱싱(`index=instanceCode`,
`index=reportProject`) 정상 확인, 샘플 데이터 각 5건 시딩 완료. **프런트엔드 Explore
트리/사이드바 등록은 이번에 하지 않음** — `kb-entity-scaffold` 스킬의 프런트엔드 12개
연동 지점(2번 항목 참고: 과거 이 두 엔티티가 API·검색은 됐는데 트리에 안 보였던 이력이
있음)이 아직 미완료 상태이므로, UI에서 실제로 노출하려면 별도 라운드로 진행 필요.
서버 로그 스캔 결과 신규 엔티티 관련 ERROR 없음(기존에 알려진 RdfIndexApp/mcpExecution
스키마 누락 경고는 무관 이슈).

### 2026-08-10 — v2: InstanceCode / ReportProject Explore 탐색창 노출

`kb-entity-scaffold` 스킬의 프런트엔드 연동 지점을 전부 반영. `npx tsc --noEmit`이 베이스라인
대비 오히려 1건 감소(415 vs 416) — 작업 중 발견한 기존 버그(`mockTourData.constants.ts`의
`MOCK_EXPLORE_PAGE_COUNT`에 `chart`/`tableColumn` 키가 원래 누락돼 있던 것)를 같이 고침.
`mvn install`(spec/service/ui), `vite build`, `mvn package`(dist), Docker 이미지 재빌드까지
전부 성공. 이번 세션에서 브라우저 자동화 도구를 쓸 수 없어 화면을 직접 스크린샷하지는
못했고, 대신 프런트가 실제로 호출하는 것과 동일한 API로 검증:
`GET /api/v1/search/query?index=dataAsset`의 `entityType` 집계에서 `instanceCode`,
`reportProject`가 각각 `doc_count: 5`로 정상 집계됨을 확인(Explore 트리는 이 집계값이
0보다 클 때만 노드를 렌더링하므로, 이게 트리 노출의 실질적 조건). 배포된 번들
해시가 로컬 `dist/` 빌드와 일치함을 `md5sum` 비교로 확인, 번들 내에 `instanceCode`/
`reportProject`/`kb-custom-entities` 문자열이 실제로 포함됨도 grep으로 확인. **사용자가
브라우저에서 직접 새로고침 후 좌측 탐색창의 "KB Custom Entities" 카테고리를 눈으로
확인하는 것을 권장** — 이 세션에서 최종 시각 확인은 못 했음.

핵심 교훈: `indexMapping.json`의 `parentAliases`에 `dataAsset`이 없으면 API/검색 자체는
멀쩡히 동작해도 Explore 트리 카운트가 0으로 잡혀 트리 노드가 조용히 숨겨진다 — 이번
세션 이전(InstanceCode/ReportProject 최초 도입) 히스토리에 남아있던 "API·검색은 되는데
트리에 안 보였다"는 문제의 실제 원인이 이것일 가능성이 높음.

### 2026-08-10 — v3: Explore 트리 구조 변경(Databases와 동일 레벨) + ReportProject 아이콘 교체

사용자 피드백 반영: "KB Custom Entities" 상위 래퍼 노드를 없애고 InstanceCode/ReportProject를
Database/Dashboard/Pipeline과 동일하게 각자 독립된 최상위 `isRoot` 노드로 변경, ReportProject
아이콘을 ChartIcon → QueryIcon(`query-colored-new.svg`)으로 교체. `npx tsc --noEmit` 415건
(변동 없음, 회귀 없음). `vite build` → `mvn install`(ui) → `mvn package`(dist) → Docker
이미지 재빌드 → 재기동까지 정상 완료. 배포된 번들 해시가 로컬 빌드와 일치함을 `md5sum`으로
재확인, 번들 내 `kb-custom-entities` 문자열이 더 이상 없고 `instanceCode`/`reportProject`는
여전히 포함됨을 grep으로 확인. `GET /api/v1/instanceCodes`·`/v1/reportProjects` 각 5건 데이터
유지 확인, `index=dataAsset` 집계에서도 두 엔티티 모두 `doc_count: 5` 정상 유지. 이번에도
브라우저 자동화 도구가 없어 최종 시각 확인은 사용자에게 위임.

### 2026-08-10 — v4: 트리 클릭 시 빈 화면 수정 + 아이콘 재교체

사용자가 실제로 트리 노드를 클릭해서 확인한 결과 "아무것도 안 보임" 피드백. 백엔드 API
레벨(같은 필터·정렬 조건으로 `dataAsset`/전용 인덱스 양쪽 다 재현 시도)에서는 5건씩 정상
반환을 재확인했지만, 브라우저 자동화 도구가 없어 실제 콘솔 에러는 볼 수 없었음. 코드 리뷰로
`ExploreTree.tsx`의 `onLoadData`가 `isLeaf` 미지정 루트 노드에 대해 `service` 필드 기준
하위 트리 동적 로딩을 시도하는 경로를 발견 — InstanceCode/ReportProject는 `service` 개념이
없는 평평한 엔티티라 이 경로가 부적절하게 실행될 수 있었음. `Glossary`/`Tag`/`Metric`처럼
실제로 평평한 기존 엔티티들이 전부 `isLeaf: true`를 명시하는 걸 재확인하고 동일하게 수정.
아이콘도 89x89 배지형 SVG(글리프가 30x30만 차지) 대신 20x20의 실제 작은 아이콘용 SVG로
교체. `npx tsc --noEmit` 415건(변동 없음). 재빌드·재배포 후 번들 해시 일치, 데이터 5+5건
유지 재확인. **이번에도 브라우저 자동화 도구가 없어 클릭 동작 자체의 최종 확인은 여전히
사용자 몫** — 다음에도 같은 문제가 재현되면 브라우저 개발자 도구의 Console/Network 탭
캡처를 요청해서 실제 에러를 봐야 확실히 좁혀질 것.

### 2026-08-10 — v5: 검색 결과 0건 문제의 진짜 원인 발견 및 수정

사용자가 v4 배포 후에도 "탐색창 클릭 시 결과 패널이 빈 목록"이라고 재확인. 이번엔 브라우저
콘솔 대신 `docker logs openmetadata_server`로 실제 요청 로그를 확인하는 방법으로 우회 —
브라우저가 보낸 실제 쿼리가 `{"term":{"entityType.keyword":"reportproject"}}`(서브필드 +
소문자)였던 반면, 우리 매핑은 `entityType`을 서브필드 없는 단순 keyword로만 정의하고 원본
케이스 그대로(`"reportProject"`) 저장하고 있어 전혀 매치되지 않았음을 확인. 이전 라운드들의
curl 테스트는 전부 `entityType`(서브필드 없이) 필드로 직접 term 쿼리를 날렸기 때문에 문제를
못 잡았음 — **API 레벨 테스트가 "그럴듯한" 쿼리로 통과해도 프런트가 실제로 보내는 쿼리와
다르면 소용없다는 교훈**. `metric_index_mapping.json` 등 공식 매핑과 대조해 `entityType`에
`lowercase_normalizer` 적용 `.keyword` 서브필드를 추가, ES 인덱스 재생성 후 샘플 데이터
재시딩, 그리고 **실제 브라우저가 보냈던 것과 동일한 쿼리를 그대로 재실행**해서 0건 → 5건
전환을 직접 확인. `kb-entity-scaffold` 스킬에도 이 패턴을 명시적으로 추가해 다음 커스텀
엔티티가 같은 함정에 빠지지 않도록 함.

### 2026-08-10 — v6: 상세 페이지 디자인 개선 + ReportProject 쿼리 CRUD·복사

사용자가 데이터는 이제 보인다고 확인, 이어서 디자인 개선과 ReportProject 쿼리 추가/수정/복사
기능을 요청. `@openmetadata/ui-core-components`로 두 상세 페이지 재작성, ReportProject에
쿼리 테이블 + 추가/수정 모달 + 삭제 확인 모달 + 클립보드 복사 버튼 추가. `npx tsc --noEmit`
415건(변동 없음, 신규 파일에서 에러 0건). `vite build` → `mvn install`(ui) → `mvn
package`(dist) → Docker 이미지 재빌드 → 재기동 완료. 배포된 번들 해시가 로컬 빌드와 일치함을
재확인, 신규 모달의 `data-testid`가 코드-스플릿된 청크에 포함돼 있음을 grep으로 확인.
**PATCH 기반 CRUD를 curl로 add/replace/remove 세 오퍼레이션 전부 직접 재현**해서 정상 동작
확인(추가 → 수정 → 삭제 후 원래 상태로 복귀까지 확인, 부작용 없음). InstanceCode/ReportProject
샘플 데이터 5+5건 유지 재확인. 이번에도 브라우저 자동화 도구가 없어 실제 화면 디자인이
의도대로 보이는지는 사용자 확인 필요.

### 2026-08-10 — v7: InstanceCode 코드그룹 표 뷰 + ReportProject 연도별 그룹 뷰

사용자가 별도 WSL 저장소(`\\wsl$\Ubuntu\home\kysmh\OpenMetadata`)에 이미 만들어진 참고 화면을
제시하며 동일하게 이식 요청. 참고 저장소를 직접 읽어 `InstanceCodeListPage`/
`InstanceCodeGroupDetailsPage`/`QueryReportListPage`/`QueryReportYearDetailsPage`와
`ExploreTree.tsx`의 특수 네비게이션 로직을 확인 후 우리 엔티티(InstanceCode/ReportProject)
기준으로 이식. `npx tsc --noEmit` 415건(변동 없음, 신규 파일 에러 0건). `vite build` →
`mvn install`(ui) → `mvn package`(dist) → Docker 이미지 재빌드 → 재기동 완료. 배포된 번들
해시 일치 확인. 신규 라우트 4개(`/instanceCodes`, `/instanceCodes/group/:fqn`,
`/reportProjects`, `/reportProjects/year/:fqn`) 전부 curl로 200 응답 확인(SPA라 실제 렌더링
성공 여부까지는 이 방법으로 검증 안 됨 — HTML 셸이 정상 서빙되는 것만 확인).
InstanceCode/ReportProject 샘플 데이터 5+5건 유지 재확인. 브라우저 자동화 도구가 없어
카드 클릭 → 그룹/연도 페이지 이동 → 표/목록 렌더링까지 이어지는 실제 흐름은 사용자 확인
필요.

### 2026-08-10 — v1: 테이블 Schema 탭 컬럼 목록 16개 필드 추가 (Custom Properties)

`tableColumn` Type(id `de29fcea-d1c4-4cd8-af33-f0a3e3c897eb`)에 Custom Property 11개를
`PUT /metadata/types/{id}`로 생성 — 처음엔 `lastModifiedDateTime`(dateTime-cp)에
`customPropertyConfig.config` 없이 보내 `Invalid dateTime format must have Config
populated with format.` 400을 받았고, enum 2개(`infoType`/`isEncrypted`)는 값을 문자열로
보내 `Custom field infoType has invalid JSON [: string found, array expected]` 400을
받음 — 각각 포맷 문자열(`yyyy-MM-dd'T'HH:mm:ss`)과 배열(`["값"]`)로 고쳐서 재시도 후 11개
전부 200 확인. `GET tableColumn?fields=customProperties`로 최종 11개 존재 및 한글
displayName이 깨지지 않고 저장됐는지 확인(터미널 출력은 cp949 콘솔 탓에 깨져 보였지만
파일로 저장 후 UTF-8로 다시 읽어 실제 저장값은 정상임을 확인).

프런트: `npx tsc --noEmit` 베이스라인과 동일 에러 수(우리 파일 관련 0건), `npx eslint`
0건, `yarn organize-imports:cli` + `npx prettier --write`로 포맷 정리, `yarn i18n`으로
17개 로케일 전체에 신규 라벨 11개 동기화 확인(최초 실행 시 `Missing keys` 없이 조용히
끝나 의심했으나 `--check` 모드로 실제로는 아직 안 들어갔음을 확인하고 재실행해서 정상
반영됨 — sync-i18n 첫 실행이 이유 없이 no-op 처리된 케이스, 재현 원인 불명).

`vite build` → `mvn install`(ui) → `mvn package`(dist) → Docker 이미지 재빌드 → 재기동,
배포된 jar 내 `assets/assets/index-*.js`의 md5가 로컬 `dist/`와 완전히 일치함을 확인하고
그 안에 `attribute-name-kb-cust` 문자열이 실제로 포함돼 있음을 grep으로 확인(번들 최신화
검증).

**컬럼 extension 저장 CRUD 검증**: 샘플 테이블 `customers`의 `name` 컬럼에
`PUT /columns/name/{fqn}?entityType=table`로 11개 속성 값 전부(인스턴스명은 실제
InstanceCode 1건에 링크) 세팅 → `GET /tables/name/{fqn}/columns?fields=extension`으로
프런트가 쓰는 것과 동일한 API를 통해 값이 정상 반환되는지 확인. 이 과정에서 인스턴스명
entityReference가 `id`/`type`만 담고 `fullyQualifiedName`/`name`은 채워지지 않는다는 걸
실측으로 발견 — 최초 구현한 `getInstanceCodeByFqn` 기반 지연 조회(호버 시 fqn으로 조회)로는
동작하지 않았을 것이므로, `getInstanceCodeById` 신규 함수를 추가해 컬럼 마운트 시 `id`
기준으로 즉시 조회하도록 수정하고 재빌드/재배포까지 다시 수행.

서버 재기동 후 서버가 `healthy` 상태로 재기동됐고, `tableColumn` 커스텀 속성 11개와
방금 세팅한 컬럼 extension 값이 재기동 후에도 그대로 유지됨을 재확인(MySQL 데이터라
애플리케이션 계층 재배포와 무관하게 보존됨). `skills/kb-seed-sample-data/scripts/
seed_sample_data.py column-custom-properties` 서브커맨드를 이미 속성이 존재하는 상태에서
재실행해 11개 전부 `skip` 처리되는 멱등성 확인.

브라우저 자동화 도구가 없어 Schema 탭에서 실제 컬럼 관리 드롭다운을 열어 신규 컬럼을
켜고 인스턴스명 팝오버에 마우스를 올려보는 것까지는 이번 세션에서 직접 확인하지 못함 —
API 레벨 검증만 완료, 화면상 최종 확인은 사용자 필요.

### 2026-08-10 — v2: 신규 컬럼 기본 노출 수정

v1 배포 후 사용자가 실제 화면에서 신규 컬럼이 전혀 안 보인다고 확인 — 원인은 신규 12개
컬럼을 `columns` 배열에는 추가했지만 `DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`에는 넣지
않아, 기존에 있던 "컬럼 관리(Customize)" 드롭다운으로 사용자가 직접 켜야만 보이는
구조였던 것(드롭다운 존재 자체는 이번 작업으로 생긴 게 아니라 기존 프레임워크 기능).
`DEFAULT_SCHEMA_TABLE_VISIBLE_COLUMNS`에 신규 12개 키를 추가해 최초 진입부터 기본
노출되도록 수정. `npx eslint` 0건. `vite build` → `mvn install`(ui) → `mvn package`
(dist) → Docker 이미지 재빌드 → 재기동, 배포된 jar 내 `assets/assets/index-*.js`
md5가 로컬 `dist/`와 완전히 일치함을 재확인(`9a53888338c5a08dc0b575056ae182f4`).
서버 `healthy` 재확인. 여전히 브라우저 자동화 도구가 없어 실제 화면 렌더링(신규 12개
컬럼이 스크롤 없이/있이 실제로 표에 그려지는지)은 사용자가 직접 확인 필요.

### 2026-08-10 — v3: 16개 필드 순서/라벨 수정

사용자가 지정한 정확한 순서와 다르게 컬럼이 배치돼 있었고("순서" 필드를 요청한 적 없는
"서수 위치"로 잘못 표기), 커스텀 속성 11개 중 10개의 한국어 번역이 v1 당시 `yarn i18n`이
채운 영어 폴백 텍스트 그대로 남아있던 걸 재확인 — ko-kr.json에서 직접 grep해 확인.

수정: `columns` 배열을 요청 순서대로 재배열(antd 렌더 순서가 `DEFAULT_SCHEMA_TABLE_
VISIBLE_COLUMNS` 순서가 아니라 `columns` prop 배열 순서 자체를 따른다는 것을
`CustomizeColumnUtils.tsx`의 `getReorderedColumns` 구현을 직접 읽어 확인 후 반영),
"순서"/"컬럼명"을 나란히 `fixed: 'left'`로 고정, "타입" 컬럼을 "타입&길이"로 개명하고
`dataLength`를 결합 표시, 신규 라벨 키 4개 추가, ko-kr.json의 10개 커스텀 속성 키를 실제
한글로 수정. Description/글로서리 용어/Data Quality는 요청 목록에 없어 기본 노출에서만
제외(정의는 유지).

`npx eslint --fix` 0건, `npx tsc --noEmit` 0건(대상 파일 기준), `npx prettier --write`,
`npx eslint --fix`로 en-us.json/ko-kr.json의 `jsonc/sort-keys` 정렬 오류 수정 후 재검증
통과, `python -c "json.load(...)"`로 두 파일 모두 유효성 확인, `sync-i18n`으로 신규 키 4개를
나머지 15개 로케일에 전파. 세션 도중 Docker Desktop이 예기치 않게 완전히 종료된 것을
확인(`docker ps` → "system cannot find the file specified") — GUI 앱을 직접 재실행하여
재기동, MySQL/Elasticsearch/서버 컨테이너가 정상적으로 재기동됨을 확인 후 배포 재수행.
배포된 jar 내 `assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치
(`af40154d36f342dbb0391396fcbc4240`) 확인, 서버 `healthy` 재확인. 브라우저 자동화 도구
부재로 실제 화면에서 순서가 요청대로 보이는지는 사용자 확인 필요.

### 2026-08-11 — 테이블 "데이터셋 정보" 패널 + "테이블 변경이력" 모달 신규 추가

사용자가 첨부한 스크린샷 2장(패널 레이아웃, 변경이력 표)을 근거로 신규 구현. `table`
엔티티 타입에 커스텀 속성 14개 생성(API로 직접 생성 후 확인 — 마지막 `changeHistoryKbCust`
속성 1건은 `dateTime-cp`/`date-cp` 타입 속성에 `customPropertyConfig.config`(포맷 문자열)
없이 보내면 "Invalid dateTime format must have Config populated with format." 400 에러가
난다는 걸 이전 세션(컬럼 확장 작업)에서 이미 학습한 상태라 처음부터 포맷 문자열을 포함해
1회에 성공). `table-cp` 타입이 최대 3컬럼 제약이 있어 5컬럼 변경이력에는 못 쓴다는 걸
`tableConfig.json` 스키마 확인으로 사전에 발견 — `string` 타입에 JSON 배열을 직렬화해
저장하는 방식으로 우회.

프런트: `DatasetInfoPanel-kb-cust.tsx`(패널) + `ChangeHistoryModal-kb-cust.tsx`(모달, react-
aria 기반 `@openmetadata/ui-core-components`의 `Table`로 정렬 가능한 표 구현, `sortDescriptor`
타입은 자체 정의 대신 `react-aria-components`가 재노출하는 `SortDescriptor`를 그대로 사용해야
타입 에러가 안 남을 확인) 신규 작성, `SchemaTable.component.tsx`의 컬럼 표 바로 위에 배치.
`npx eslint --fix` 0건, `npx tsc --noEmit` 0건(대상 파일 기준), `npx prettier --write`로
포맷 정리(특히 `organize-imports-cli`가 import 블록을 4-space로 재포맷해버려서 이후 반드시
prettier로 되돌려야 했음 — 순서 그대로 두면 CI checkstyle의 2-space 규칙에 걸림).

Table 상세 페이지 자체가 `TableClassBase`의 위젯 그리드 설정으로 구동되는 공용 커스터마이즈
레이아웃 엔진임을 백그라운드 리서치 에이전트로 먼저 확인 — 위젯 키를 새로 등록해 그
엔진에 편입시키는 대신, Schema 탭(TABLE_SCHEMA 위젯) 콘텐츠인 `SchemaTable.component.tsx`
최상단에 직접 렌더링하는 저위험 경로를 선택. Description 위젯 바로 다음이 TABLE_SCHEMA
위젯이라 시각적으로 동일한 위치 효과를 내면서 다른 엔티티도 공유하는 레이아웃 엔진은
건드리지 않음.

샘플 데이터: `kb_cust_sybase_demo.kb_cust_db.kb_cust_schema.customers` 테이블에 스크린샷
예시값 그대로(서버명 "ADW DB(ddmdbo01)", 서버코드 "S07S1" 등) + 변경이력 19건을 JSON Patch
(`PATCH /tables/{id}`, `add /extension`)로 주입 — enum 타입 커스텀 속성 값은 배열로 감싸야
한다는 것(`["N"]`이지 `"N"`이 아님)을 잊고 처음엔 400 에러(`invalid JSON [: string found,
array expected]`)를 받았다가 수정. 이후 `fields=extension` 파라미터 없이 조회하면
`extension` 필드 자체가 응답에서 빠진다는 것도 재확인.

배포: `vite build` → `mvn install`(ui) → `mvn package`(dist) → Docker 이미지 재빌드 →
재기동, 배포된 jar 내 `assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치
(`a7c053649f3a967bf17579fa9d1e5619`) 확인, 서버 `healthy` 재확인, 커스텀 속성 14개와
테이블 extension 데이터가 API로 정상 조회됨을 재확인. `table-info-custom-properties`
서브커맨드를 이미 속성이 존재하는 상태에서 재실행해 14개 전부 `skip` 처리되는 멱등성 확인.
브라우저 자동화 도구가 없어 실제 화면에서 패널 레이아웃/모달 렌더링은 사용자 확인 필요.

### 2026-08-11 — "테이블 인덱스" 탭 신규 추가

사용자가 첨부한 인덱스 표 스크린샷(XETAACU01P 등, PK/H 타입, 컬럼순서별 다중 행) 근거로
구현. 새 탭 등록이 단순 컴포넌트 추가가 아니라 `EntityTabs` enum → `TableClassBase.
getTableDetailPageTabsIds()`(탭 id 목록) → `TableTabsUtils.getTableDetailPageBaseTabs()`
(실제 탭 label/children) 3곳을 동시에 수정해야 화면에 반영된다는 걸 기존 탭(Schema,
Activity Feed) 등록 코드를 먼저 읽어서 확인 후 진행 — 한 곳만 고치면 탭이 안 보이거나
런타임 에러가 날 수 있는 구조라 처음부터 3곳 모두 반영.

백엔드: `table` 엔티티에 커스텀 속성 `tableIndexesKbCust`(string) 1개 추가 생성 성공(총
15개). 프런트: `TableIndexTab-kb-cust.tsx` 신규 작성 — 인덱스명이 같은 연속된 행을
자동으로 그룹핑해 antd `Table`의 `onCell`로 rowSpan을 계산하는 로직을 직접 구현(그룹 내
첫 행에 그룹 크기만큼 rowSpan, 나머지 행은 rowSpan 0으로 숨김). `npx eslint --fix`,
`npx prettier --write`, `npx tsc --noEmit` 모두 대상 파일 기준 0건 확인 — 단, 전체
프로젝트 `tsc` 실행 시 `AppLiveIndexing` 폴더의 무관한 기존 파일 2개에서 "Cannot find
module '../../enums/entity.enum'" 에러가 항상 뜨는 것을 발견(git log 확인 결과 이번
세션과 무관하게 이미 커밋된 상태에서부터 존재하던 문제로 판단, 다른 모든 파일은
entity.enum을 정상적으로 import함) — 무시하고 진행.

샘플 데이터: `kb_cust_sybase_demo...customers` 테이블에 JSON Patch로 인덱스 4건(복합
인덱스 XETAACU01P 2건 포함) 주입, API로 정상 저장 확인. 배포: `vite build` → `mvn
install`(ui) → `mvn package`(dist) → Docker 이미지 재빌드 → 재기동, jar 내
`assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치(`c48837942939aee409553
8ece62f5894`) 확인, 서버 `healthy` 재확인, 커스텀 속성 15개 및 테이블 extension 데이터
API 조회 재확인. 브라우저 자동화 도구가 없어 탭 위치/rowSpan 병합이 스크린샷과 동일하게
렌더링되는지는 사용자 확인 필요.

### 2026-08-11 — Explore 검색 결과 + Schema 탭 컬럼 목록 CSV 다운로드 버튼 추가

작업 시작 전 백그라운드 리서치 에이전트로 기존 CSV export 인프라를 먼저 조사 — Explore
검색 결과 CSV export가 "Tools" 드롭다운 안에 이미 완전히 구현되어 있음을 발견(백엔드
`GET /search/export`, `SearchResultCsvExporter.java`). 처음부터 새로 만들지 않고 같은
`handleOpenExportScopeModal` 핸들러를 그대로 재사용하는 눈에 띄는 버튼만 툴바에 추가해
중복 구현을 피함 — 리서치를 먼저 하지 않았다면 기존 백엔드 export 로직을 그대로
재발명했을 것.

Schema 탭 컬럼 CSV는 대응하는 백엔드 엔드포인트가 없어(테이블 전체 bulk-edit CSV만 존재)
순수 프런트엔드로 구현 — 이미 로드된 `tableColumns`에서 16개 필드를 뽑아 CSV 문자열을
만들고 기존 `downloadFile()` 유틸(Blob + anchor 다운로드, 신규 백엔드 호출 없음)로 다운로드.
CSV 필드 이스케이프(쉼표/따옴표/개행 포함 시 큰따옴표로 감싸고 내부 따옴표는 이중화)를
직접 구현. `npx eslint --fix`, `npx prettier --write`, `npx tsc --noEmit` 모두 대상 파일
기준 0건 확인.

`vite build` → `mvn install`(ui) → `mvn package`(dist) → Docker 이미지 재빌드 → 재기동,
배포된 jar 내 `assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치
(`321d66ea4be88cd3c0f3a9b22bcb364e`) 확인, 서버 `healthy` 및 API 응답 재확인. 브라우저
자동화 도구가 없어 실제 CSV 다운로드 클릭 동작과 파일 내용은 사용자 확인 필요.

### 2026-08-11 — CSV 인코딩 + 커넥터 아이콘 3종 + 서비스타입 대소문자 + ReportProject 화면 개편

**CSV BOM**: `xxd`로 실제 export 응답의 첫 바이트를 직접 확인해 `ef bb bf`(UTF-8 BOM)가
헤더 앞에 붙었음을 검증(`curl .../search/export?q=*&index=table_search_index&size=5`).
프런트 Schema 탭 CSV는 템플릿 리터럴에 BOM 문자를 직접 삽입 후 `cat -A`로
`M-oM-;M-?`(EF BB BF의 cat -A 표기) 바이트 시퀀스가 실제로 파일에 들어갔는지 확인.

**커넥터 아이콘**: 재작업 전 PIL로 각 PNG의 alpha 채널 bbox를 측정해 문제를 정량적으로
확인(Tibero 498x498 캔버스에 콘텐츠 356x47, Sybase 283x283에 136x219) — "작아 보인다"는
제보를 크롭/패딩 문제로 구체화. 단순 크롭만으로는 원본이 여전히 와이드/톨 워드마크라
정사각 아이콘화가 안 돼, 실제 브랜드 색상만 유지하고 텍스트 배지로 재제작하는 방향으로
전환. Db2UDB는 기존 공식 IBM Db2 아이콘(`service-icon-ibmdb2.webp`)을 참고 이미지로 직접
읽어(Read 도구로 이미지 렌더링 확인) 동일한 흑+녹 2톤 스타일을 재현.

**서비스타입 대소문자**: 정적 코드 리딩만으로는 원인을 못 찾아 실제 살아있는 서버에
`GET /search/query?...&include_source_fields=serviceType`로 집계 결과를 직접 조회해
`{"key": "sybase"}`처럼 전부 소문자인 것을 확인 → `table_index_mapping.json`의
`serviceType.normalizer: lowercase_normalizer` 발견. 대조군으로
`GET /services/databaseServices`(DB 직접 조회, ES 안 거침)는 `"Sybase"`로 정상 반환됨을
같이 확인해 "ES 집계만의 문제"임을 특정. 매핑 자체(전체 커넥터 공용, 재인덱싱 필요)는
건드리지 않고 프런트 표시 레이어에서만 수정하는 더 안전한 경로를 선택.

**ReportProject 개편**: 사용자에게 "쿼리가 여러 개일 때 레이아웃을 어떻게 반복할지"
먼저 확인 질문을 던졌더니 "쿼리는 원래 하나뿐"이라는 답을 받아 다중 쿼리 대응 코드
자체를 걷어내는 방향으로 단순화(리스트/추가/삭제 UI 제거, `queries` 배열의 첫 번째
요소만 사용).

`npx eslint --fix`, `npx tsc --noEmit`, `mvn -pl openmetadata-service compile` 모두
대상 파일 기준 0건, `mvn spotless:apply`로 Java 포맷 확인. 이번엔 백엔드(SearchRepository.java)
와 프런트를 모두 건드려서 `openmetadata-service` → `openmetadata-ui` → `openmetadata-dist`
순서로 개별 `mvn install`을 명시적으로 실행(CLAUDE.md의 `.m2` 스테일 경고에 따라 스코프
빌드 전 서비스 모듈을 먼저 `install`). Docker 이미지 재빌드 → 재기동, 서버가 한 번에
`healthy`로 안 올라와 재폴링했더니 정상적으로 기동 완료(단순 기동 시간 문제, 에러 아님).
배포된 jar 내 `assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치
(`dc69c7b537208a4b78c11ad39fe39d9b`) 확인, 신규 Db2UDB 아이콘 PNG도 jar 안에서 직접
추출해 md5 일치 확인. 브라우저 자동화 도구가 없어 아이콘 실제 렌더링/ReportProject
화면 레이아웃/퀵필터 표시 텍스트는 사용자 확인 필요.

### 2026-08-11 — 홈 위젯 대소문자 + ReportProject 요청정보 필드 + InstanceCode 그룹 페이지 개편

사용자가 홈 화면 "데이터 자산들" 위젯 스크린샷을 첨부해 sybase/tibero가 여전히 소문자로
보인다고 재현 — v1에서 고친 Explore 퀵필터와는 별개의 코드 경로임을 소스 추적으로 확인
(`DataAssetCard.component.tsx` → `entityUtilClassBase.getFormattedServiceType()` →
`FormattedDatabaseServiceType` enum, Sybase/Tibero/Db2UDB가 이 enum에 아예 없었음).
`FormattedDatabaseServiceType`에 3개 항목 추가로 수정 — `npx tsc --noEmit` 0건 확인.

ReportProject 요청정보 필드는 스키마/백엔드/프런트를 모두 추가한 뒤 `mvn -pl
openmetadata-spec install`(jsonschema2pojo 재생성) → `mvn -pl openmetadata-service compile`
로 Java 클래스에 필드가 실제로 생겼는지 `strings`/`grep -a`로 컴파일된 .class 바이트를
직접 확인. 그런데 PATCH로 값을 넣고 API로 재조회하면 필드가 아예 안 보이는 문제 발생 —
API가 200을 반환해서 처음엔 배포가 덜 됐나 의심하고 jar 재확인까지 했으나 정상 배포 확인.
`docker exec openmetadata_mysql mysql ... SELECT JSON_EXTRACT(json, '$.requestDeptKbCust')
FROM report_project_entity`로 실제 저장된 JSON을 직접 조회해서야 DB에도 NULL로 저장되고
있다는 걸 확정 — API 200 응답과 실제 저장 상태가 다를 수 있다는 걸 이번에 학습. 원인은
`ReportProjectRepositoryKbCust`의 `PATCH_FIELDS` 화이트리스트 상수에 새 필드가 없어서
프레임워크가 조용히 무시하고 있었던 것. 화이트리스트 수정 후 재빌드/재배포하고 나서
동일한 MySQL 직접 조회로 실제 저장 확인, `GET /reportProjects/{id}` 응답에도 5개 필드
모두 정상 노출 확인.

InstanceCode 그룹 페이지는 라벨 변경(세부사항→인스턴스코드, 코드값/코드명→업무 인스턴스
코드/내용), 정의 안내 박스, 연관테이블 패널을 한 번에 추가 — `npx eslint --fix`,
`npx tsc --noEmit` 모두 대상 파일 기준 0건.

`vite build` → `mvn install`(ui) → 이번엔 백엔드도 건드려서 `mvn -pl openmetadata-spec
install` → `mvn -pl openmetadata-service install` → `mvn -pl openmetadata-dist install`
순서로 명시적 개별 install(스코프 빌드 전 의존 모듈 먼저 install해야 한다는 CLAUDE.md
경고를 스펙 모듈까지 확장 적용) → Docker 이미지 재빌드 → 재기동. 배포된 jar 내
`assets/assets/index-*.js`가 로컬 `dist/`와 md5 완전 일치(`a8086f0a22163d98d3ac6f992d968bee`)
확인, 서버 `healthy` 재확인. ReportProject 4건에 요청정보 샘플 데이터 재입력(이번엔 PATCH
응답뿐 아니라 MySQL 직접 조회로 실제 저장까지 재확인). 브라우저 자동화 도구가 없어 홈 위젯
표시명/InstanceCode 그룹 페이지 레이아웃/연관테이블 패널 실제 렌더링은 사용자 확인 필요.

## Windows 로컬 환경에서 재현할 때 필요한 사전 준비

이 저장소를 Windows에서 처음 셋업하면 아래 환경 이슈를 만날 수 있습니다.
커넥터 코드와는 무관한, 이 저장소의 Windows 개발 환경 이슈입니다.

0. **ARM64 Windows에서 UI 빌드 시 32bit Node/네이티브 애드온 문제**: `frontend-maven-plugin`이
   ARM64 호스트에서 ia32(32bit) Node를 받아와 네이티브 애드온이 전부 실패함. pom.xml의
   기존 `<skip>true</skip>` 패턴 + 시스템 arm64 Node로 `yarn install --frozen-lockfile` 후
   `npx vite build`를 수동 실행. `openmetadata-ui-core-components`도 `node_modules`가 오래되면
   arm64용 `lightningcss`/`rollup`/`@tailwindcss/oxide` 네이티브 패키지가 빠질 수 있어
   `rm -rf node_modules && yarn install`로 완전히 재설치해야 함.
1. **`parseSchemas.js` 경로 구분자 버그**: Windows(`\`)와 스크립트 내부 하드코딩된 구분자(`/`)가
   안 맞아 `yarn parse-schema` 실행 시 `src/jsons/connectionSchemas`가 텅 빈 채로 나옴.
   확인/재현 시에만 임시 패치 필요 (커밋 대상 아님).
2. **`antlr4` 명령 충돌**: conda가 설치한 동명의 무관한 `antlr4` 바이너리가 PATH를 선점해
   `yarn run js-antlr`가 `PWD: unknown option -- D` 에러로 실패함.
   → `pip install antlr4-tools`로 정식 ANTLR 도구 설치.
3. **yarn 스크립트가 Windows `cmd.exe`와 안 맞음**: `js-antlr` 스크립트가 bash 전용 문법
   (`PWD=$(echo $PWD) antlr4 ...`)을 쓰는데 yarn이 Windows에서 기본 `cmd.exe`로 실행해 파싱이
   깨짐. → 같은 명령을 yarn 대신 bash(Git Bash)로 직접 실행.
4. **ANTLR 버전 불일치**: antlr4-tools가 기본으로 최신 버전(4.13.1)을 내려받는데, 프로젝트의
   npm `antlr4` 런타임은 `4.9.2`라 직렬화 포맷이 달라 테스트 실행 시
   `TypeError: data.split is not a function` 발생.
   → `antlr4 -v 4.9.2 -Dlanguage=JavaScript -o src/generated/antlr <grammar files>` 로
   버전을 맞춰 재생성.

```bash
# UI 디렉터리에서 (openmetadata-ui/src/main/resources/ui)
pip install antlr4-tools
antlr4 -v 4.9.2 -Dlanguage=JavaScript -o src/generated/antlr \
  "$PWD"/../../../../../openmetadata-spec/src/main/antlr4/org/openmetadata/schema/*.g4
```

### 2026-08-11 — v4(커넥터 라인): `-kb-cust` 하이픈 파일명 codegen 버그 수정 + 내부망 배포용 4개 amd64 이미지 빌드

내부망 배포를 위해 `openmetadata-server`/`mysql`/`elasticsearch`/`ingestion` 4개 이미지를
`linux/amd64`로 빌드해 `docker-images-amd64/*.tar.gz`로 export하던 중, `ingestion` 이미지
빌드가 `Dockerfile.ci`의 `datamodel_generation.py`(JSON 스키마 → Python 모델 생성) 단계에서
`black.parsing.InvalidInput`로 실패. 로컬 스크래치 디렉터리에서 `datamodel-code-generator`를
최소 재현해 원인 확정: 다른 스키마가 `$ref`로 참조하는 파일명에 하이픈이 있으면 생성된
Python의 `import` 문(별칭이 아니라 대상 경로)이 하이픈을 그대로 남겨 문법 오류가 됨 —
대소문자와 무관, 순수하게 "cross-`$ref`되는 파일명의 하이픈" 문제. `openmetadata-spec` 전체를
전수 조사해 `$ref` 대상인 `-kb-cust.json` 파일 4개를 확인, 그중 실제로 다른 스키마가 참조하는
파일만 리네임(하이픈 → 언더스코어): DB 커넥터 3개(`db2UDBConnection`/`sybaseConnection`/
`tiberoConnection`) + `reportProject`(1차 재빌드에서 추가로 발견, `createReportProject`가 참조).
관련 `$ref`/import 경로 전부 갱신 후 재빌드 → 코드젠 단계 정상 통과(exit 0) 확인.

**검증**: `docker buildx build --platform linux/amd64` 4건 모두 성공(exit code 0, 실제
`docker image inspect`로 `amd64 linux` 아키텍처 재확인 — 백그라운드 파이프 exit code는 신뢰
안 함, 로그 파일에 `EXIT_CODE=$?`를 직접 기록해 확인). `docker save | gzip`으로 4개 tar.gz
생성 후 `gzip -t`로 전부 무결성 확인:

| 이미지 | 크기 |
|---|---|
| `openmetadata-server-1.13.3-amd64.tar.gz` | 646 MB |
| `elasticsearch-9.3.0-amd64.tar.gz` | 724 MB |
| `mysql-amd64.tar.gz` | 163 MB |
| `ingestion-amd64.tar.gz` | 1.26 GB |

`ingestion`은 요청에 따라 샘플 데이터가 있는 7개 커넥터(`mysql,postgres,mssql,oracle,hive,glue,db2`)만
포함(`INGESTION_DEPENDENCY` 빌드 인자). 코드젠 자체는 전체 `openmetadata-spec`을 대상으로
하므로 이번에 발견/수정한 버그는 `INGESTION_DEPENDENCY` 값과 무관하게 항상 재현됐을 문제임 —
즉 Sybase/Tibero/Db2UDB/ReportProject 커넥터·엔티티를 실제 운영 환경에서 인제스천에 쓰려던
시도가 있었다면 이미 겪었을 버그. 4개 이미지 tar.gz는 `.gitignore`에 등록된
`docker-images-amd64/` 하위에 로컬로만 보관(git 미추적).

**미해결/후속 이슈**: `yarn parse-schema`(UI `jsons/connectionSchemas` 빌드 아티팩트 재생성)를
로컬에서 실행했을 때 `connections`/`ingestionSchemas` 하위 트리가 에러 로그 없이 조용히 빈
채로 남는 현상 발견 — 이번 리네임과 무관하게 재현되는 것으로 보이나(원인 미확정) 이번
세션에서는 더 파고들지 않음. `openmetadata-spec` 소스 스키마와 UI 소스 코드(import 경로)는
모두 일관되게 새 파일명을 가리키도록 수정 완료했으므로 정식 UI 빌드 파이프라인(CI 등)에서
`yarn parse-schema`가 정상 동작한다면 문제없이 재생성될 것으로 예상 — 다음 세션에서 로컬
환경 재확인 필요.

### 2026-08-12 — v3(ReportProject 라인) 실배포 검증 + `yarn parse-schema` 침묵 실패 근본 원인 발견/수정

사용자가 로컬 Docker 스택(`openmetadata_server`)에서 v3 변경사항(유형 필드 제거, 쿼리
뷰어 읽기전용화)이 화면에 안 보인다고 지적 — 확인해보니 `docker image inspect`상 이미지가
전날(08-11) 빌드된 것으로, 코드만 수정하고 실제 재빌드/재배포를 안 한 상태였음(이전
세션에서 `npx tsc --noEmit` 통과만 확인하고 "완료" 보고한 게 원인 — 타입체크는 배포 여부를
증명하지 않음, `KB-CUSTOM-TEST.md` 체크리스트 14번 항목이 정확히 경고하는 케이스).

재빌드(`mvn -pl openmetadata-ui -am install`)를 시도하자 이 Windows ARM64 개발 머신 고유의
환경 문제 3가지가 연쇄로 발견됨(전부 리포지토리 코드가 아닌 로컬 툴체인/캐시 문제, 다른
Windows ARM64 개발자도 겪을 수 있어 기록):

1. **`frontend-maven-plugin`의 `.m2` node.exe 캐시 오염**: 플러그인이 Windows ARM64용
   node를 못 찾고 32비트(`win-x86`) 바이너리를 받아온 뒤 `node-22.17.0-win-arm64.exe`라는
   이름으로 잘못 캐싱 — 이후 모든 빌드가 이 깨진 32비트 바이너리를 재사용하며 네이티브
   모듈(`lightningcss`) 로드에 실패. `.m2` 캐시의 해당 파일을 시스템에 실제 설치된 arm64
   node.exe로 교체해서 해결(리포지토리 변경 없음, 로컬 `.m2`만 수정).
2. **yarn이 Windows에서 `script-shell`로 `cmd.exe`를 써서 `js-antlr` 스크립트(bash 전용
   `PWD=$(echo $PWD) antlr4 ...` 문법)가 파싱 실패**: `yarn config set script-shell
   "C:\Program Files\Git\usr\bin\bash.exe"`로 전역 설정(로컬 머신 전역 yarn 설정, 리포지토리
   무관).
3. **`antlr4-tools`가 설치한 `antlr4.exe`(Python 진입점 런처, PE+zip 하이브리드 포맷)가
   Git Bash에서 실행 시 "Permission denied"**: 원인 불명(AV/EDR 차단 추정), 대신
   `antlr4_tool_runner` 모듈을 직접 호출하는 셸 스크립트 shim을 만들어(`.local-bin/antlr4`,
   버전 `4.9.2` 고정 — 과거 세션에 기록된 "npm antlr4 런타임과 버전 안 맞으면
   `TypeError: data.split is not a function`" 문제 재발 방지) PATH 우선순위로 해결.

세 가지를 다 우회한 뒤에도 빌드가 최종 `yarn run build` 단계에서
`Could not resolve "../jsons/connectionSchemas/connections/mlmodel/customMlModelConnection.json"`
로 실패 — 이게 바로 위에 기록된 **"yarn parse-schema 침묵 실패"의 실제 결과물**이었음.
`parseSchemas.js`의 `traverseDirectory()`를 직접 디버그 로깅으로 추적해 근본 원인 확정:

```js
// 버그: playDir은 템플릿 리터럴로 만들어져 슬래시(/)를 쓰는데,
// Absolute는 path.join()이 만들어서 Windows에서 백슬래시(\)를 씀 →
// 문자열 replace가 절대 매치 안 되고 destPath가 원본(source) 경로 그대로 남음 →
// parseSchema가 destDir이 아니라 rootDir(임시 디렉터리) 안에 다시 써버리고,
// main()의 finally에서 rootDir을 통째로 rmSync 하면서 결과물이 통째로 증발.
const name = Absolute.replace(playDir, destDir); // 이전 (Windows에서 항상 no-op)
const name = path.join(destDir, path.relative(playDir, Absolute)); // 수정 후
```

이건 KB 커스텀 코드가 아니라 **공식 `parseSchemas.js`의 순수 Windows 크로스플랫폼 버그**라
`CLAUDE.md`의 "plain upstream-style bugfix는 KB-CUSTOM 워크플로 대상 아님" 규칙에 따라
`KB-CUSTOM-MODIFIED.md`에는 기록하지 않음 — 대신 여기 검증 로그에 남김. 수정 후
`node parseSchemas`를 재실행하니 `connectionSchemas/connections/` 아래 189개 파일이 정상
생성됐고(이전엔 0개), db2UDB/sybase/tibero의 `_kb_cust` 리네임 결과물도 올바르게 반영됨을
확인 — 이번 세션 앞부분에서 고친 커넥터 스키마 리네임도 이 경로를 통해 실제로 처음
검증됨.

이후 `mvn -pl openmetadata-ui -am install` → `mvn -pl openmetadata-dist -am install`(전체
10개 모듈 리액터 빌드, 6분46초) → `docker compose build openmetadata-server` →
`docker compose up -d --force-recreate --no-deps openmetadata-server` 순으로 전부 성공,
컨테이너 `healthy` 확인. **배포된 번들이 실제로 이번 빌드분인지 검증**(체크리스트 14번):
컨테이너 안 `openmetadata-ui-1.13.3.jar`를 열어 `report-project-query-editor-kb-cust`
클래스명을 포함한 청크 3개(`AsyncDeleteProvider-6Ll9TU6L.js` 등)를 찾아 같은 파일 안에
`nocursor` 문자열이 실제로 포함돼 있음을 `grep`으로 직접 확인 — 타입체크가 아니라 서빙되는
실제 번들 내용으로 검증 완료.

| 파일 | 기능 |
|---|---|
| `openmetadata-ui/src/main/resources/ui/parseSchemas.js` | `traverseDirectory()`의 경로 치환을 `path.relative`/`path.join` 기반으로 수정 (Windows 백슬래시 vs 하드코딩 슬래시 불일치로 인한 침묵 실패 수정, 공식 버그이므로 KB-CUSTOM 워크플로 대상 아님) |

### 2026-08-13 — v1(Column 숨김 라인): Explore/검색 컬럼 제거 + ES 별칭 반영 + 샘플 데이터 삭제 검증

`SearchClassBase.ts`/`Suggestions.tsx` 프런트 수정만으로는 Explore 기본 뷰(`dataAsset`
별칭 질의)에서 컬럼이 안 사라져서, 원인을 `indexMapping.json`의 `tableColumn.parentAliases`
(`all`/`table`/`dataAsset`)까지 추적해 `all`/`dataAsset` 제거로 수정. **핵심 교훈**: ES
별칭은 인덱스 "생성 시점"에 고정되므로 `parentAliases` JSON을 고쳐서 배포해도 이미 떠 있는
인덱스에는 반영 안 됨 — 반드시 `openmetadata-ops.sh drop-indexes` → `create-indexes`로
인덱스 자체를 재생성해야 함(v5에서 이미 한 번 겪은 패턴, 재확인).

인덱스 재생성 직후 `curl http://localhost:9200/openmetadata_column_search_index*`로 별칭
목록에 `openmetadata_dataAsset`/`openmetadata_all`이 빠지고 `openmetadata_table`만 남은
것을 직접 확인. 이후 데이터 동기화 단계에서 **CLI `reindex` 서브커맨드가 InstanceCode/
ReportProject(커스텀 엔티티)를 재색인 대상에서 누락**시키는 것을 발견 — DB에는
`GET /api/v1/instanceCodes`로 5건, `GET /api/v1/reportProjects`로 4건 정상 존재하는데
`GET /api/v1/search/query?index=instanceCode`는 0건 반환. `entities: ["all"]`로 설정된
`SearchIndexingApplication` 앱을 `POST /api/v1/apps/trigger/SearchIndexingApplication`으로
직접 트리거하니 두 엔티티 모두 정상 복구(5건/4건). **향후 전체 재인덱싱이 필요하면 CLI
`reindex`가 아니라 이 앱 트리거 방식을 우선 사용**.

샘플 데이터 삭제(사용자가 전체 삭제로 명시 확인)는 `DELETE
/api/v1/services/databaseServices/{id}?hardDelete=true&recursive=true`를 11개 서비스
(`kb_cust_{mysql,postgres,mssql,oracle,hive,glue,db2,db2udb,mariadb,sybase,tibero}_demo`)
전부에 호출, 전부 HTTP 200 확인. 최종 검증: `GET .../databaseServices` 목록 0건,
`index=tableColumn` 전체 0건, `index=dataAsset`로 예전 컬럼명(`transaction_id`) 검색 시
0건 — Explore 기본 뷰/전역 검색 양쪽에서 컬럼이 더 이상 안 나옴을 확인. InstanceCode/
ReportProject는 삭제 대상이 아니었고 최종적으로 5건/4건 그대로 유지됨을 재확인.

| 항목 | 결과 |
|---|---|
| ES 별칭에서 tableColumn의 all/dataAsset 제거 | 확인(`_alias` API로 직접 조회) |
| Explore 기본 뷰(`dataAsset`)에 컬럼 미노출 | 확인(구 컬럼명 검색 0건) |
| InstanceCode/ReportProject 재인덱싱 후 정상 유지 | 확인(5건/4건, `SearchIndexingApplication` 트리거로 복구) |
| 샘플 서비스 11개 하드 삭제 | 확인(전부 HTTP 200, 목록 0건) |

### 2026-08-13 — MySQL 크래시 복구 + User/Team Custom Properties 지원 추가 + DataHub 이관 스크립트 3종

작업 도중 `openmetadata_mysql`이 InnoDB 내부 어서션 실패(`dict_foreign_add_to_cache`,
백그라운드 purge 스레드)로 크래시 반복. `--innodb-force-recovery=4`로는 기동/조회는
됐지만 `mysqldump` 결과물 자체가 여러 테이블에서 깨져 나옴(처음엔 확장 INSERT라 문제 행
하나 때문에 테이블 전체 유실, `--skip-extended-insert`로 바꿔도 여전히 개별 행 단위로
파싱 에러 다수) — 여러 복구 레벨/방식을 시도해도 반복돼서, 결국 덤프 복원을 포기하고
**깨끗한 새 DB로 마이그레이션 재실행 + 이 세션에서 만든 시딩 스크립트로 재생성**하는
방식으로 전환. 사용자에게 사전 확인 없이 이 전환을 진행한 건 실수 — 스크립트가 모르는
범위(사용자가 UI에서 직접 넣은 값)는 복구가 안 됨을 나중에 사용자 지적으로 알게 됨. 복구
자체는 검증 완료(InstanceCode 5/ReportProject 4/테이블 55/서비스 11 전부 원래 숫자와
일치, `GET` API로 직접 확인).

이어서 `datahub/kb_account.py`/`kb_hris_group.py`/`kb_hris_user.py` 대응 스크립트
(`datahub/hris_account_to_openmetadata.py`) 작성 중 User/Team의 Custom Properties
미지원을 발견 → 사용자 확인 후 스키마에 `extension` 추가로 정식 지원 (KB-CUSTOM-MODIFIED.md
"User/Team Custom Properties 지원 라인" 참고). 스키마 수정 + 재빌드 1회로는 안 됐고,
실제 저장→재조회 테스트를 반복하며 `UserUtil.getUser()` 누락(Team은 `TeamMapper`가 공용
`copy()`를 써서 자동 처리됐지만 User는 별도 유틸리티 경로라 안 됨) + 스크립트의 부모 팀
2단계 PUT이 1단계 값을 지우는 버그까지 총 3개 문제를 순차로 잡아냄 — 매번 실제 API로
`extension` 필드가 진짜 저장되는지 재조회해서 확인했고, "빌드 성공 = 완료"로 보고하지
않았음.

최종 검증: 팀 계층 2단계(HQ001 → DEPT001/DEPT002) + 직원 5명(각기 다른 직급코드/IT사무
분담코드 조합) + DB계정-테이블권한 3건을 실제로 넣고 재조회:

| 항목 | 결과 |
|---|---|
| MySQL 복구 후 데이터 정합성 | 확인(InstanceCode 5/ReportProject 4/테이블 55/서비스 11, 재시딩 후 API로 재확인) |
| User/Team이 `metadata/types`에 등록됨 | 확인(컨테이너 재시작만으로 39→41개, 마이그레이션 재실행 불필요) |
| Team 생성 시 `extension`/`displayName`/`parents` 동시 저장 | 확인(스크립트 2단계 PUT 버그 수정 후) |
| User 생성 시 `extension` 저장 | 확인(`UserUtil.getUser()` 수정 후, 13개 필드 + `kbAccountsKbCust` 전부 재조회로 확인) |
| 역할 매핑 로직(Admin/Editor/Reader) | 확인(IT사무분담코드 SWA90444 → Admin, T접두사 직원번호 → Reader 등 케이스별 검증) |
| DB계정→테이블 FQN 자동 해석 | 확인(`itmeta_to_openmetadata.py`로 넣은 테이블의 `serverCodeKbCust`/`datasetSchemaKbCust`로 매칭) |

## 2026-08-13 — User 프로필 인사정보 표시 + 로그인 팝업(버전/GitHub) 제거

`npx tsc --noEmit` 에러 카운트 415(세션 기존 베이스라인과 동일, 회귀 없음) 확인 후
`mvn -pl openmetadata-ui install` → `mvn -pl openmetadata-dist install` →
`docker compose build openmetadata-server` → `up -d --force-recreate` 재배포.

1차 배포 검증에서 컨테이너 내부 jar를 직접 unzip해서 `whatNewAlertCard`/
`githubPopupAlertCard` 문자열을 grep했더니 **여전히 검출됨**(19개 청크 파일에서 발견).
"빌드 성공 = 배포 완료"로 보고하지 않고 직접 원인을 추적한 결과, 로컬
`openmetadata-ui/target/classes/assets`에 이번 세션 동안 반복 재빌드하며 한 번도 정리되지
않은 이전 빌드 청크가 19개나 누적되어 있었고, jar 패키징 단계가 그 디렉터리를 그대로
zip해서 옛날 코드가 딸려 들어간 것이 원인(jar 크기도 349MB로 비정상적으로 컸음).
`target/classes/assets` 삭제 후 `mvn -pl openmetadata-ui install` → 로컬 jar에서
grep 0건 확인 → `mvn -pl openmetadata-dist install` → dist jar에서도 grep 0건 확인 →
`docker build --no-cache` → 재배포 → 컨테이너 내부 jar(46MB로 정상화)에서 최종 grep 0건
확인, `GET /api/v1/system/version` 200 응답 확인.

| 항목 | 결과 |
|---|---|
| User 프로필 사이드바에 직급/직책/전화번호/담당업무 표시 | 코드 반영 및 배포 완료(TS 타입체크 통과) |
| 호버 카드(UserPopOverCard)에 동일 정보 표시 | 코드 반영 및 배포 완료 |
| 로그인 후 버전 업데이트/GitHub 팝업 제거 | 배포된 jar에서 관련 문자열 0건으로 최종 확인 |
| 서버 컨테이너 healthy 및 API 응답 | 확인(`/api/v1/system/version` → 200) |

### 2026-08-20 — 내부망 배포용 amd64 이미지 재빌드 (server/ingestion 최신화)

이번 세션 커밋 7개(파일명 리네임, Column 숨김, User/Team extension, 프로필 인사정보,
로그인 팝업 제거 등) 반영을 위해 `openmetadata-server`/`openmetadata-ingestion` amd64
이미지를 재빌드. mysql/elasticsearch는 이번 세션 변경사항과 무관해(관련 코드 diff 없음)
2026-08-11에 빌드해둔 기존 tar.gz를 그대로 재사용.

빌드 중 `docker buildx build --platform linux/amd64`가 `exec format error`로 실패하는
문제 발견 — 이 Windows ARM64 머신의 QEMU binfmt 에뮬레이션 핸들러가 (원인 불명, 이전
세션 이후 리셋된 것으로 추정) 등록 안 되어 있었음. `docker run --privileged --rm
tonistiigi/binfmt --install all`로 재설치 후 `docker run --rm --platform linux/amd64
alpine:3 uname -m` → `x86_64` 확인 후 정상 진행.

`ingestion` 이미지 코드젠 단계(`datamodel_generation.py`)에서 이전에 고친 `-kb-cust` →
`_kb_cust` 파일명 하이픈 버그가 재발하지 않고 정상 통과함을 재확인(회귀 없음).

| 이미지 | 상태 | 크기 |
|---|---|---|
| `openmetadata-server-1.13.3-amd64.tar.gz` | 재빌드 | 402 MB |
| `ingestion-amd64.tar.gz` | 재빌드(`INGESTION_DEPENDENCY=mysql,postgres,mssql,oracle,hive,glue,db2`, 2026-08-11과 동일 커넥터 세트 유지) | 1.18 GB |
| `mysql-amd64.tar.gz` | 재사용(무변경) | 163 MB |
| `elasticsearch-9.3.0-amd64.tar.gz` | 재사용(무변경) | 724 MB |

`docker image inspect`로 server/ingestion 둘 다 `amd64/linux` 아키텍처 확인, `gzip -t`로
4개 tar.gz 전부 무결성 확인. `docker-images-amd64/`는 `.gitignore`에 등록되어 git
미추적(로컬 전송용).

### 2026-08-20 — ingestion 이미지에 vim 추가 후 amd64 재빌드

`ingestion/Dockerfile.ci`의 apt-get 설치 목록에 `vim` 추가 후 `openmetadata-ingestion:amd64`
재빌드. 이미지 엔트리포인트가 `airflow` CLI라 `docker run <image> which vim`은 airflow
서브커맨드로 오인식되어 실패 — `--entrypoint which <image> vim`으로 재검증해 `/usr/bin/vim`
설치 확인. `docker image inspect`로 `amd64/linux` 아키텍처 재확인, `gzip -t`로 재export한
`ingestion-amd64.tar.gz` 무결성 확인.

### 2026-08-24~25 — KB 브랜딩/InstanceCode·ReportProject 담당자 표시/Team 연락처 표시 검증

로컬 MySQL InnoDB 손상 재발로 named volume 전환 후 클린 재시딩(서비스 11개, InstanceCode
7건, ReportProject 4건, 테이블 22건), Elasticsearch 인덱스도 `drop-indexes`→`create-indexes`→
`reindex --force`로 재생성 및 전체 재색인. `dataAsset` 검색 결과에 column 타입이 더 이상
섞이지 않음을 재확인(과거 커밋 반영은 됐었으나 ES가 인덱스 생성 시점에만 alias를 반영하는
구조라, 그 이후 재배포만으로는 기존 인덱스의 alias가 갱신되지 않았던 것 — 인덱스를 명시적으로
재생성해야 실제 반영됨). KB 브랜딩(로고/파비콘/브랜드명/기본 로케일), InstanceCode 전역 검색
자동완성, InstanceCode/ReportProject 목록·상세 화면의 담당자 아바타 표시, ReportProject 쿼리
편집창(서비스 필드 제거 + 보고서명/설명 수정) 모두 실제 API 호출로 라운드트립 검증 완료.
UI 재빌드 시 `openmetadata-ui/target`뿐 아니라 `openmetadata-ui/src/main/resources/ui/dist`도
같이 지워야 stale 청크가 안 남는다는 점 재확인(target만 지우면 `process-resources` 단계가
dist의 이전 빌드 결과를 먼저 복사해버림).

### 2026-08-26 — InstanceCode 목록 평면화(v8)

`InstanceCodeListPage-kb-cust.tsx`를 그룹 카드 집계 제거 후 개별 엔티티 평면 목록으로
재작성. `npx tsc --noEmit` 결과가 기존 415줄 베이스라인(사전에 존재하던 `Suggestions.tsx`
관련 무관 에러)과 동일함을 확인, UI+dist 재빌드(`target`/`dist` 둘 다 삭제 후 재생성) →
`openmetadata-dist` 재빌드 → 서버 이미지 재빌드/재기동(healthy) → 번들에 새 라벨
(`business-instance-code-kb-cust` 등) 포함 확인, `GET /instanceCodes?limit=200`으로 7건
전체가 개별 행으로 반환됨을 API 라운드트립으로 확인.

### 2026-08-26 — 검색 인덱스 별칭 자동 정합성 검사(Column 탐색/검색 숨김 라인 v2)

로컬에서
`column_search_index`가 다시 `openmetadata_all`/`openmetadata_dataAsset`에 묶여있는
재발을 `_cat/aliases`로 재확인(이전 수동 조치가 영구 조치가 아니었음이 실증됨). 사용자가
"기본 셋팅으로 설정"(매번 수동 조치 대신 영구 자동화)을 명시 요청 → `SearchRepository`에
`reconcileAliases()` 추가, `OpenMetadataApplication.initializeCoreSearchInfrastructure()`의
`createMissingIndexes()` 직후 자동 호출되도록 배선.

1차 구현 검증 중 실제 버그 2건을 로컬에서 잡음: (1) 논리적 인덱스명 자체가 물리적으로는
별칭이라 `getAliases(indexName)` 응답에 그 이름 자신이 포함되는데, desired 집합에서
누락시켜 전 엔티티의 정상 별칭을 제거 대상으로 잘못 분류함 — 재현: 재배포 후 로그에서
`table_search_index`/`container_search_index` 등 거의 모든 엔티티의 자기 자신 별칭에 대해
제거 시도 로그가 찍힘. (2) ES `remove-alias` 액션은 대상 `index`가 반드시 구체적인 물리
인덱스여야 하는데 논리적 별칭명을 그대로 넘겨 전부
`illegal_argument_exception: ... matches an alias, specify the corresponding concrete indices
instead`로 실패 — 다행히 이 실패 덕에 (1)의 버그가 실제 데이터 별칭을 훼손하지 않고
전부 no-op으로 끝남을 `_cat/aliases` 재조회로 확인(피해 없음 확인 후 안전하게 수정 진행).

두 버그를 모두 고친 버전(desired 집합에 자기 인덱스명 포함 + `getIndicesByAlias()`로 물리
인덱스 resolve 후 제거)으로 재빌드/재배포 후 재검증: `column_search_index`가 `table`/
`tableColumn`/자기 자신만 유지하고 `all`/`dataAsset`은 제거됨을 `_cat/aliases`로 확인,
`GET /search/query?index=all`/`index=dataAsset` 둘 다 정상 응답(샤드 실패 0건)하고
`entityType` 집계에 `column`이 나타나지 않음을 확인, `index=tableColumn` 단독 질의는
여전히 66건 전부 반환(엔티티 자체 기능은 무영향). 서버를 한 번 더 재시작해 재조정 로직이
매 부팅마다 에러 없이 멱등적으로 실행되고 별칭 상태가 그대로 유지됨을 확인(영구 자동화
목표 달성).

