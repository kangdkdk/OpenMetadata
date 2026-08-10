# KB Custom - New Files Manifest

공식 코드베이스에 없던 완전히 새로운 파일(신규 생성) 목록입니다. 기존 파일 수정 이력은
`KB-CUSTOM-MODIFIED.md` 참고.

**신규 파일 명명 규칙**: 확장자 앞에 `-kb-cust` 접미사를 붙입니다 (예: `foo-kb-cust.ts`,
`sybaseConnection-kb-cust.json`) — 하이픈 + 점 하나, 공식 파일과 시각적으로 구분하기 위함.
과거엔 `.kb-cust.`(점 2개) 규칙을 썼으나, 커넥션 스키마 JSON에서 `datamodel-code-generator`가
그 형태를 잘못 파싱해 인제스천 이미지 빌드를 깨뜨리는 문제가 있어 `-kb-cust`로 변경했습니다.

**Java 예외**: public 클래스명은 파일명과 정확히 일치해야 하고 Java 식별자에는 하이픈도 점도
쓸 수 없어 `-kb-cust`를 그대로 쓸 수 없습니다. 대신 구두점 없는 CamelCase 접미사를 붙입니다 —
`FooKbCust.java` (클래스명 `FooKbCust`). 이름만으로는 하이픈 버전보다 눈에 덜 띄니 반드시 이
파일에 기록해서 추적하세요.

| 버전 | 파일 | 기능 |
|---|---|---|
| v1 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/sybaseConnection-kb-cust.json` | Sybase 커넥터 - 연결 스키마 |
| v1 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/sybaseConnection-kb-cust.ts` | 위 스키마의 TypeScript 타입 |
| v1 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-sybase-kb-cust.png` | Sybase 정사각형 공식 로고 |
| v2 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/tiberoConnection-kb-cust.json` | Tibero 커넥터 - 연결 스키마 |
| v2 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/tiberoConnection-kb-cust.ts` | 위 스키마의 TypeScript 타입 |
| v2 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-tibero-kb-cust.png` | Tibero 정사각형 공식 로고 |
| v3 | `openmetadata-spec/src/main/resources/json/schema/entity/services/connections/database/db2UDBConnection-kb-cust.json` | DB2 UDB 커넥터 - 연결 스키마 |
| v3 | `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/database/db2UDBConnection-kb-cust.ts` | 위 스키마의 TypeScript 타입 |
| v3 | `openmetadata-ui/src/main/resources/ui/src/assets/img/service-icon-db2udb-kb-cust.png` | DB2 UDB 정사각형 공식 로고 |
