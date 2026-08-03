# KB Custom - Build/Test Verification Log

커스텀 변경사항(`KB-CUSTOM-MODIFIED.md`, `KB-CUSTOM-NEW.md`)에 대해 실제로 빌드/테스트를
돌려본 기록입니다. 새 커스텀 작업을 검증할 때마다 이 파일 하단에 항목을 추가해주세요.

## 2026-08-02 — v1: Sybase 데이터베이스 서비스 커넥터

| 항목 | 명령 | 결과 |
|---|---|---|
| 백엔드 스키마 빌드 | `mvn -pl openmetadata-spec -am clean install -DskipTests` | ✅ 성공 |
| 백엔드 서비스 빌드 | `mvn -pl openmetadata-service -am clean install -DskipTests` | ✅ 성공 |
| UI 스키마 resolve | `yarn parse-schema` | ✅ 성공 |
| UI 타입 체크 | `npx tsc --noEmit -p .` | ✅ 우리 파일 에러 0건 (기존 무관 에러 992건은 별개) |
| UI 유닛 테스트 | `npx jest src/utils/DatabaseServiceUtils.test.tsx` | ✅ 12/12 PASS (Sybase 케이스 포함) |
| Docker 로컬 기동 (`openmetadata-server`, mysql, elasticsearch) | `docker/run_local_docker.sh -m ui -d mysql` | ✅ 성공, 전부 healthy |
| DB 초기화 후 Sybase 샘플 데이터 생성 (Service → Database → Schema → Table) | `POST /api/v1/services/databaseServices` 등 | ✅ 전 단계 생성 성공 |
| 샘플 데이터 영속성 확인 | `GET` 재조회 | ✅ `serviceType: Sybase`, connection config, 컬럼 3개 그대로 저장 확인 |
| Elasticsearch 검색 색인 확인 | `GET /api/v1/search/query?q=kb_cust_customers` | ✅ 1건 히트, service/serviceType 정상 표시 |

## 2026-08-03 — v2: Tibero 데이터베이스 서비스 커넥터

| 항목 | 명령 | 결과 |
|---|---|---|
| 백엔드 스키마 빌드 | `mvn -pl openmetadata-spec -am clean install -DskipTests` | ✅ 성공 (`TiberoConnection.java` 생성 확인) |
| 백엔드 서비스 빌드 | `mvn -pl openmetadata-service -am clean install -DskipTests` | ✅ 성공 |
| UI 스키마 resolve | `parseSchemas.js` | ✅ `tiberoConnection.kb-cust.json` 정상 resolve |
| UI 유닛 테스트 | `npx jest src/utils/DatabaseServiceUtils.test.tsx` | ✅ 13/13 PASS (Tibero 케이스 포함) |
| Docker 로컬 기동 (backend-only, `openmetadata-server`/mysql/elasticsearch) | `docker/run_local_docker.sh -m no-ui -d mysql -i false` | ✅ 성공, 전부 healthy |
| 실서버 swagger 스키마에 Tibero 등록 확인 | `GET /swagger.json` | ✅ `DatabaseServiceType` enum에 `Tibero` 포함 |
| Tibero 샘플 데이터 생성 (Service → Database → Schema → Table) | `POST /api/v1/services/databaseServices` 등 | ✅ 전 단계 생성 성공, `password` 필드 마스킹·`scheme` 기본값(`tibero+pyodbc`) 정상 |
| 샘플 데이터 영속성 확인 | `GET` 재조회 | ✅ `serviceType: Tibero`, 컬럼 3개 그대로 저장 확인 |
| Elasticsearch 검색 색인 확인 | `GET /api/v1/search/query?q=kb_cust_orders` | ✅ 1건 히트, service/serviceType 정상 표시 |

- 이번엔 UI 프로덕션 빌드 없이 `-m no-ui`(backend-only) 모드로 검증함 — Sybase 때 겪은
  Windows ARM64 rollup/node-gyp 이슈를 피하고 API 레벨 검증만으로 충분하다고 판단.
- 테스트 시작 시 MySQL 컨테이너가 이전 세션 중단 여파로 InnoDB 크래시 상태였음(Tibero 코드와
  무관). `docker/development/docker-volume` 삭제 후 재기동으로 해결.

## 2026-08-03 — v1/v2: UI 포함 전체 빌드 + Sybase/Tibero 화면 검증

이전 검증은 `-m no-ui`(backend-only)로만 진행되어 UI 코드 경로(연결 편집 폼, 서비스 카드,
Add Service 마법사 등)가 실제로 한 번도 렌더링 검증되지 않았음. UI를 포함해 다시 빌드하고
Playwright로 실제 브라우저 렌더링까지 확인함.

| 항목 | 명령 | 결과 |
|---|---|---|
| UI 프로덕션 빌드 | `npx vite build` (openmetadata-ui/src/main/resources/ui) | ✅ 성공 |
| 전체 Maven 패키징 (UI 포함) | `mvn -DskipTests clean package -rf :openmetadata-ui` | ✅ BUILD SUCCESS |
| Docker 재기동 (UI 포함) | `docker/run_local_docker.sh -m ui -d mysql -s true -r false` | ✅ 전 컨테이너 healthy |
| UI 루트 응답 확인 | `curl -o /dev/null -w '%{http_code}' http://localhost:8585/` | ✅ 200 (기존 500 `Missing required resource: /assets/index.html` 해결) |
| Sybase/Tibero 서비스+DB+Schema+Table 샘플 데이터 생성 | REST API | ✅ 전 단계 생성 성공 |
| Playwright로 Tibero 서비스 개요/데이터베이스/스키마/테이블/연결/연결편집 화면 진입 | headless Chromium | ✅ 전 화면 정상 렌더링, `pageerror` 없음 |
| Playwright로 Add Service 마법사에서 Sybase/Tibero 검색 | headless Chromium | ✅ 둘 다 카드로 정상 노출 |

- **결론**: 사용자가 보고한 "Tibero 화면 진입 시 오류"는 이전 세션이 `-m no-ui`로 기동된
  상태(UI 정적 자산 자체가 없어 모든 화면이 500)에서 발생한 것으로 확인됨. UI를 포함해
  재빌드한 이후에는 개요/DB/스키마/테이블/연결/연결편집 화면 모두 오류 없이 정상 동작함.
- **DB 데이터 유지 이슈**: `docker/run_local_docker.sh`는 `-r`(DB 볼륨 초기화) 옵션의
  기본값이 `true`라서, `-r`을 명시하지 않고 재기동하면 매번 MySQL 데이터가 삭제됨
  (`docker/development/docker-volume/` 삭제). 기존 데이터를 유지하려면 반드시
  `-r false`를 붙여서 실행해야 함. 이 스크립트는 공식 파일이라 기본값은 변경하지 않음 —
  향후 로컬 재기동 시 `-r false`를 항상 명시할 것.

## Windows 로컬 환경에서 재현할 때 필요한 사전 준비

이 저장소를 Windows에서 처음 셋업하면 아래 3가지 환경 이슈를 만날 수 있습니다.
Sybase 코드와는 무관한, 이 저장소의 Windows 개발 환경 이슈입니다.

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
