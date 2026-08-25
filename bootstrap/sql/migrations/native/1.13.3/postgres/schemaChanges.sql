-- KB custom: InstanceCode / ReportProject entities
CREATE TABLE IF NOT EXISTS instance_code_entity (
  id VARCHAR(36) GENERATED ALWAYS AS (json ->> 'id') STORED NOT NULL,
  name VARCHAR(256) GENERATED ALWAYS AS (json ->> 'name') STORED NOT NULL,
  nameHash VARCHAR(256) NOT NULL,
  json JSONB NOT NULL,
  updatedAt BIGINT GENERATED ALWAYS AS ((json ->> 'updatedAt')::bigint) STORED NOT NULL,
  updatedBy VARCHAR(256) GENERATED ALWAYS AS (json ->> 'updatedBy') STORED NOT NULL,
  deleted BOOLEAN GENERATED ALWAYS AS ((json ->> 'deleted')::boolean) STORED,
  PRIMARY KEY (id),
  UNIQUE (nameHash)
);
CREATE INDEX IF NOT EXISTS instance_code_name_index ON instance_code_entity USING btree (name);

CREATE TABLE IF NOT EXISTS report_project_entity (
  id VARCHAR(36) GENERATED ALWAYS AS (json ->> 'id') STORED NOT NULL,
  name VARCHAR(256) GENERATED ALWAYS AS (json ->> 'name') STORED NOT NULL,
  nameHash VARCHAR(256) NOT NULL,
  json JSONB NOT NULL,
  updatedAt BIGINT GENERATED ALWAYS AS ((json ->> 'updatedAt')::bigint) STORED NOT NULL,
  updatedBy VARCHAR(256) GENERATED ALWAYS AS (json ->> 'updatedBy') STORED NOT NULL,
  deleted BOOLEAN GENERATED ALWAYS AS ((json ->> 'deleted')::boolean) STORED,
  PRIMARY KEY (id),
  UNIQUE (nameHash)
);
CREATE INDEX IF NOT EXISTS report_project_name_index ON report_project_entity USING btree (name);
