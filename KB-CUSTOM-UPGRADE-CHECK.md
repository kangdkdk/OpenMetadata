# KB Custom - Upgrade Risk Checklist

`vendor/1.12.8` → 다음 버전으로 올릴 때, 진행 가능 여부(Go/No-Go)를 판단하기 위한
체크리스트입니다. `KB-CUSTOM-MODIFIED.md` / `KB-CUSTOM-NEW.md`에 있는 파일 목록과
대조하며 아래 항목을 순서대로 확인하세요. 단순 merge conflict 여부만 보지 말고
이 파일의 항목을 모두 통과해야 업그레이드를 진행합니다.

## 체크리스트

### 1. 네이밍 충돌 (최우선)

우리가 커스텀으로 추가한 서비스 타입명이 새 버전에서 공식으로 추가/변경되지 않았는지 확인.

- [ ] 새 버전 릴리즈 노트/CHANGELOG에 `Sybase`, `Tibero` 언급이 있는지 검색
- [ ] `openmetadata-spec/.../databaseService.json`의 새 버전 enum 목록에 `Sybase`,
      `Tibero`가 이미 존재하는지 확인 (`git diff vendor/1.12.8 vendor/<신버전> -- openmetadata-spec/src/main/resources/json/schema/entity/services/databaseService.json`)
- 충돌 시: 공식 구현으로 교체하고 우리 커스텀 파일(`*.kb-cust.*`)은 폐기

### 2. 생성 코드 재생성 영향

`KB-CUSTOM-MODIFIED.md`의 generated 파일 14곳은 `sed`로 직접 수정한 것이라
`mvn generate` / `yarn parse-schema` 재실행 시 덮어써질 수 있음.

- [ ] 새 버전에서 `databaseService.json`의 enum 배열 구조(순서, 포맷)가 바뀌었는지 확인
- [ ] 새 버전으로 스키마 재생성 후 generated 파일에 `Sybase`/`Tibero`가 빠졌는지 확인 →
      빠졌다면 `KB-CUSTOM-MODIFIED.md`의 sed 패턴을 새 버전 코드에 맞게 재적용

### 3. Flyway 마이그레이션

기존 DB에 이미 `serviceType='Sybase'` / `'Tibero'` row가 존재하는 상태에서 업그레이드됨.

- [ ] 새 버전의 `bootstrap/sql/migrations/`에 `serviceType` 컬럼을 검증·정규화·백필하는
      마이그레이션이 추가됐는지 확인 (`git log --oneline vendor/1.12.8..vendor/<신버전> -- bootstrap/sql/migrations`)
- [ ] 있다면 스테이징 DB로 먼저 마이그레이션 시도해서 커스텀 enum 값에 대해 실패하지 않는지 확인

### 4. UI 스키마 리졸브 파이프라인 (`parseSchemas.js`)

- [ ] `openmetadata-ui/.../parseSchemas.js`가 새 버전에서 변경됐는지 확인
- [ ] 변경됐다면 `sybaseConnection.kb-cust.json` / `tiberoConnection.kb-cust.json`이
      정상적으로 resolve되어 `src/jsons/connectionSchemas/`에 출력되는지 재확인

### 5. 빌드 툴체인 변경

- [ ] `openmetadata-ui/pom.xml`의 node/yarn 버전, `package.json`의 vite/rollup 버전이
      바뀌었는지 확인
- [ ] 바뀌었다면 `KB-CUSTOM-TEST.md`에 기록된 Windows 이슈(ARM64 rollup, longpath,
      license-header-fix 등)가 재발하는지 재검증

### 6. 파일 단위 충돌 대조

- [ ] `KB-CUSTOM-MODIFIED.md`에 나열된 모든 파일에 대해
      `git diff vendor/1.12.8 vendor/<신버전> -- <파일>` 로 상위 diff 확인
- [ ] 충돌 없는 파일: 그대로 rebase/merge
- [ ] 충돌 파일: 수동 재적용 후 `KB-CUSTOM-MODIFIED.md`에 변경 사유 기록

## 판단 기준 (Go/No-Go)

- 1번(네이밍 충돌)에 걸리면 **No-Go** — 업그레이드 전에 커스텀 커넥터를 먼저 재설계해야 함
- 2~6번은 걸려도 **Go** 가능 — 단, 반영 후 `KB-CUSTOM-TEST.md`에 재검증 결과를 남기고 진행

## 점검 이력

| 날짜 | 대상 버전 | 결과 | 비고 |
|---|---|---|---|
