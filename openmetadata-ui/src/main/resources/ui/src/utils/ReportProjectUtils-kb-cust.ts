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
  unknownLabel: string
): string => {
  return year === UNKNOWN_REPORT_PROJECT_YEAR ? unknownLabel : year;
};
