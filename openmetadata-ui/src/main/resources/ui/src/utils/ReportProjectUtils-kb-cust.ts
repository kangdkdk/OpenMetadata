/*
 *  Copyright 2025 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { ReportProject } from '../generated/entity/data/reportProject_kb_cust';
import { InstanceCodeOwner } from './InstanceCodeOwnerUtils-kb-cust';

export const UNKNOWN_REPORT_PROJECT_YEAR = 'unknown';

/**
 * ReportProject has no dedicated "year" field, so the year used to group
 * entries in the list/tree UI is derived from `updatedAt` (falls back to a
 * single "Unknown" bucket when the timestamp is missing).
 */
export const getReportProjectYear = (
  reportProject: Pick<ReportProject, 'updatedAt'>
): string => {
  if (!reportProject.updatedAt) {
    return UNKNOWN_REPORT_PROJECT_YEAR;
  }

  return String(new Date(reportProject.updatedAt).getFullYear());
};

export const getReportProjectYearLabel = (
  year: string,
  unknownLabel: string,
  yearSuffix = ''
): string => {
  return year === UNKNOWN_REPORT_PROJECT_YEAR ? unknownLabel : `${year}${yearSuffix}`;
};

/**
 * ReportProject's itOwnerEmployeeKbCust is a plain string field (unlike
 * InstanceCode, which packs "empId|type" pairs into its description) - it
 * holds the raw employee id(s), comma-separated when there's more than
 * one. Wrapping it in the same InstanceCodeOwner shape lets the detail/list
 * pages reuse OwnerAvatarGroup's real User avatar + popover rendering.
 */
export const parseReportProjectOwners = (
  reportProject: Pick<ReportProject, 'itOwnerEmployeeKbCust'>
): InstanceCodeOwner[] => {
  const raw = reportProject.itOwnerEmployeeKbCust;
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((username) => username.trim())
    .filter(Boolean)
    .map((username) => ({ username, type: '' }));
};

const TABLE_REFERENCE_REGEX = /\b(?:FROM|JOIN)\s+([`"[\]A-Za-z0-9_.]+)/gi;

/**
 * ReportProject queries have no structured link to the tables they read
 * (unlike InstanceCode, which is linked via a real column extension field),
 * so related tables are inferred by lightly parsing FROM/JOIN clauses out
 * of the saved SQL text. This is a heuristic, not a SQL parser - it won't
 * catch every dialect's quoting/CTE/subquery edge cases, but covers the
 * common `FROM schema.table` / `JOIN table alias` shapes well enough to
 * surface likely matches for the caller to cross-reference against real
 * Table entities by name.
 */
export const parseTableNamesFromQuery = (query?: string): string[] => {
  if (!query) {
    return [];
  }

  const names = new Set<string>();
  const regex = new RegExp(TABLE_REFERENCE_REGEX);
  let match: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(query)) !== null) {
    const raw = match[1].replace(/["`[\]]/g, '');
    const tableName = raw.split('.').pop();
    if (tableName) {
      names.add(tableName.toLowerCase());
    }
  }

  return Array.from(names);
};
