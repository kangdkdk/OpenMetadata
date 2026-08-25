/*
 *  Copyright 2026 Collate.
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

export interface InstanceCodeOwner {
  username: string;
  type: string;
}

const OWNER_LINE_REGEX = /\*\*담당자\*\*:\s*(.+)/;

/**
 * instance_to_openmetadata.py writes owners into the InstanceCode
 * description as "**담당자**: empId|type, empId|type, ...". Parsing back
 * out the raw username (not a pre-resolved display name) lets the UI look
 * the User up live for a real avatar/name via ProfilePicture/UserPopOverCard.
 */
export const parseInstanceCodeOwners = (
  description?: string
): InstanceCodeOwner[] => {
  if (!description) {
    return [];
  }
  const match = description.match(OWNER_LINE_REGEX);
  if (!match) {
    return [];
  }

  return match[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [username, type] = entry.split('|');

      return { username: username?.trim() ?? entry, type: type?.trim() ?? '' };
    })
    .filter((owner) => Boolean(owner.username));
};

const DEFINITION_LINE_REGEX = /\*\*인스턴스 정의\*\*:\s*(.+)/;
const STANDARD_CLASSIFICATION_LINE_REGEX = /\*\*표준구분\*\*:\s*(.+)/;

/**
 * instance_to_openmetadata.py writes the instance definition and standard
 * classification (from kb_instance.py's 인스턴스정의내용 / 인스턴스표준구분)
 * into the InstanceCode description as labeled lines, alongside the
 * "**담당자**" owner line. Pulling them back out lets the detail page show
 * the real per-instance values instead of static glossary copy.
 */
export const parseInstanceCodeDefinition = (
  description?: string
): string | undefined => description?.match(DEFINITION_LINE_REGEX)?.[1]?.trim();

export const parseInstanceCodeStandardClassification = (
  description?: string
): string | undefined =>
  description?.match(STANDARD_CLASSIFICATION_LINE_REGEX)?.[1]?.trim();
