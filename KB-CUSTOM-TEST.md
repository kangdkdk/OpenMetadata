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
| 7 | 인제스천이 정상 동작하는지 | 인제스천 파이프라인 실행 후 상태가 `Success`인지, 관련 이미지가 빌드됐는지 | 과거 `.kb-cust.` 접미사(점 2개)가 `datamodel-code-generator`를 혼동시켜 인제스천 이미지 빌드가 실패한 적 있음 — 그래서 `-kb-cust`(점 1개) 규칙으로 변경됨. 새 커넥션 스키마 추가 시 최초 1회는 반드시 재검증 |
| 8 | CRUD(및 DB 연결)가 잘 되는지 | POST/PATCH/DELETE 후 GET으로 반영 확인, soft delete 후 목록에서 빠지고 복구 시 재노출되는지 | — |
| 9 | 엔티티 버전 히스토리가 정상 기록되는지 | PATCH 후 `version` 증가, `changeDescription`에 변경 필드가 남는지 | — |
| 10 | 권한 없는 요청이 401/403을 정상 반환하는지 | 토큰 없이/권한 부족 계정으로 동일 API 호출 | — |
| 11 | 서버·워커 로그에 `ERROR`/`Exception`이 없는지 | `docker logs <container> \| grep -iE "error\|exception"` 전체 스캔 (화면상 정상으로 보여도 백그라운드 예외가 조용히 나는 경우가 있음) | — |
| 12 | 다국어 로케일 JSON이 안 깨졌는지 | `python -m json.tool`로 파싱 확인, `yarn lint`의 `jsonc/sort-keys` 통과 | `ko-kr.json` 재통합 시 키 순서/포맷 충돌 |
| 13 | 재기동 후에도 안정적으로 뜨는지 | 서버를 한 번 더 `--force-recreate`로 재시작해서 동일하게 healthy한지 | 마이그레이션 체크섬 누락이 재기동 시에만 드러남 |
| 14 | 배포된 이미지/번들이 실제로 이번 빌드 것인지 | 컨테이너 이미지 ID/타임스탬프가 방금 빌드한 것과 일치하는지, 서빙되는 JS 번들 해시가 로컬 `dist/`와 일치하는지 (`curl`로 받아 직접 비교) | `mvn -pl openmetadata-dist install`이 `.m2`에 남은 구버전 `openmetadata-ui` jar를 재사용해, 소스는 맞는데 배포물만 옛날 버전이 나감 — 브라우저 새로고침으로는 절대 안 잡힘 |

## 검증 기록

새 커스텀 작업을 검증할 때마다 아래에 날짜별 항목을 추가하세요 (append-only, 기존 항목 수정 금지).

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

