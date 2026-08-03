# KB Custom - Modified Files Log

기존 공식 파일 중 커스텀 목적으로 수정한 파일 목록입니다. 신규로 만든 파일은
`KB-CUSTOM-NEW.md` 참고. 버전(`v1`, `v2`, ...)은 `vendor/1.12.8` 기준으로 커스텀 작업이
추가될 때마다 하나씩 올라가며, 각 버전은 `custom/1.12.8-vN-<작업명>` 브랜치에 대응합니다.

## 버전 이력

| 버전 | 브랜치 | 내용 |
|---|---|---|
| v1 | `custom/1.12.8-v1-sybase-add` | Sybase 데이터베이스 서비스 커넥터 추가 |

## v1 — Sybase 데이터베이스 서비스 커넥터 추가

| 파일 | 기능 |
|---|---|
| `openmetadata-spec/src/main/resources/json/schema/entity/services/databaseService.json` | Sybase 데이터베이스 서비스 커넥터 - 서비스 타입 등록 |
| `openmetadata-ui/src/main/resources/ui/src/generated/api/automations/createWorkflow.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/api/services/createDatabaseService.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/api/services/ingestionPipelines/createIngestionPipeline.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/automations/testServiceConnection.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/automations/workflow.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/data/database.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/data/databaseSchema.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/data/storedProcedure.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/data/table.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/connections/serviceConnection.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/databaseService.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/entity/services/ingestionPipelines/ingestionPipeline.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/metadataIngestion/testSuitePipeline.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/generated/metadataIngestion/workflow.ts` | Sybase 데이터베이스 서비스 커넥터 |
| `openmetadata-ui/src/main/resources/ui/src/utils/DatabaseServiceUtils.tsx` | Sybase 데이터베이스 서비스 커넥터 - 스키마 매핑 |
| `openmetadata-ui/src/main/resources/ui/src/utils/DatabaseServiceUtils.test.tsx` | Sybase 데이터베이스 서비스 커넥터 - 단위 테스트 |
| `openmetadata-ui/src/main/resources/ui/src/utils/EntityUtils.interface.ts` | Sybase 데이터베이스 서비스 커넥터 - UI 표시 라벨 |
| `openmetadata-ui/src/main/resources/ui/src/utils/ServiceUtilClassBase.ts` | Sybase 데이터베이스 서비스 커넥터 - 아이콘 매핑 |
| `openmetadata-ui/src/main/resources/ui/src/utils/ServiceUtils.tsx` | Sybase 데이터베이스 서비스 커넥터 - Test Connection 제외 처리 |
| `openmetadata-ui/src/main/resources/ui/package.json` | license-header-fix 스크립트 Windows(cmd.exe) 호환 수정 (커넥터 기능과 무관, 커밋 훅 통과를 위한 사전 정리) |
