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
import { Box, Card, Typography } from '@openmetadata/ui-core-components';
import { AxiosError } from 'axios';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '../../components/common/atoms/navigation/useBreadcrumbs';
import { usePageHeader } from '../../components/common/atoms/navigation/usePageHeader';
import { useTitleAndCount } from '../../components/common/atoms/navigation/useTitleAndCount';
import EntityListingTable from '../../components/common/EntityListingTable/EntityListingTable.component';
import { ColumnDef } from '../../components/common/EntityListingTable/EntityListingTable.interface';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import OwnerAvatarGroup from '../../components/common/OwnerAvatarGroup/OwnerAvatarGroup-kb-cust';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { InstanceCode } from '../../generated/entity/data/instanceCode-kb-cust';
import { getInstanceCodes } from '../../rest/instanceCodeAPI-kb-cust';
import { parseInstanceCodeOwners } from '../../utils/InstanceCodeOwnerUtils-kb-cust';
import { getInstanceCodeGroupPath } from '../../utils/RouterUtils';
import { showErrorToast } from '../../utils/ToastUtils';

interface InstanceCodeGroupRow {
  id: string;
  name: string;
  codeGroup: string;
  codeGroupName?: string;
  description?: string;
}

const buildInstanceCodeGroups = (
  instanceCodes: InstanceCode[]
): InstanceCodeGroupRow[] => {
  const codesByGroup = new Map<string, InstanceCode[]>();
  instanceCodes.forEach((instanceCode) => {
    const codes = codesByGroup.get(instanceCode.codeGroup) ?? [];
    codes.push(instanceCode);
    codesByGroup.set(instanceCode.codeGroup, codes);
  });

  return Array.from(codesByGroup.entries())
    .map(([codeGroup, codes]) => {
      const representative = [...codes].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      )[0];

      return {
        id: codeGroup,
        name: representative.codeGroupName || codeGroup,
        codeGroup,
        codeGroupName: representative.codeGroupName,
        description: representative.description,
      };
    })
    .sort((a, b) => a.codeGroup.localeCompare(b.codeGroup));
};

const InstanceCodeListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [instanceCodes, setInstanceCodes] = useState<InstanceCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstanceCodes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInstanceCodes({ limit: 200 });
      setInstanceCodes(response.data);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstanceCodes();
  }, [fetchInstanceCodes]);

  const instanceCodeGroups = useMemo(
    () => buildInstanceCodeGroups(instanceCodes),
    [instanceCodes]
  );

  const { breadcrumbs } = useBreadcrumbs({
    items: [
      {
        name: t('label.instance-code-plural-kb-cust'),
        url: '',
        isActive: true,
      },
    ],
  });

  const { pageHeader } = usePageHeader({
    titleKey: 'label.instance-code-plural-kb-cust',
    descriptionMessageKey: 'message.instance-code-description-kb-cust',
  });

  const { titleAndCount } = useTitleAndCount({
    titleKey: 'label.instance-code-plural-kb-cust',
    count: instanceCodeGroups.length,
    loading,
  });

  const handleRowClick = useCallback(
    (group: InstanceCodeGroupRow) => {
      navigate(getInstanceCodeGroupPath(group.codeGroup));
    },
    [navigate]
  );

  const columns: ColumnDef[] = useMemo(
    () => [
      { id: 'codeGroupName', label: t('label.instance-code-group-name-kb-cust') },
      { id: 'codeGroupId', label: t('label.instance-code-group-id-kb-cust') },
      { id: 'owners', label: t('label.owner-kb-cust') },
    ],
    [t]
  );

  const renderCell = useCallback(
    (group: InstanceCodeGroupRow, columnId: string): ReactNode => {
      switch (columnId) {
        case 'codeGroupName':
          return (
            <Typography size="text-sm" weight="medium">
              {group.codeGroupName || group.codeGroup}
            </Typography>
          );
        case 'codeGroupId':
          return (
            <Typography className="tw:font-mono" size="text-sm">
              {group.codeGroup}
            </Typography>
          );
        case 'owners':
          return (
            <OwnerAvatarGroup
              owners={parseInstanceCodeOwners(group.description)}
            />
          );
        default:
          return null;
      }
    },
    []
  );

  const content = useMemo(() => {
    if (!loading && instanceCodeGroups.length === 0) {
      return (
        <ErrorPlaceHolder
          className="tw:border-none"
          heading={t('message.no-data-message', {
            entity: t('label.instance-code-plural-kb-cust'),
          })}
          type={ERROR_PLACEHOLDER_TYPE.NO_DATA}
        />
      );
    }

    return (
      <EntityListingTable
        ariaLabel={t('label.instance-code-plural-kb-cust')}
        columns={columns}
        disableSelection={true}
        entities={instanceCodeGroups}
        loading={loading}
        renderCell={renderCell}
        selectedEntities={[]}
        onEntityClick={handleRowClick}
        onSelect={() => {}}
        onSelectAll={() => {}}
      />
    );
  }, [loading, instanceCodeGroups, columns, renderCell, handleRowClick, t]);

  return (
    <Box className="tw:p-6" direction="col" gap={4}>
      {breadcrumbs}
      {pageHeader}
      <Card style={{ marginBottom: 20 }} variant="elevated">
        <Box
          className="tw:px-6 tw:py-4 tw:border-b tw:border-secondary"
          direction="row"
          gap={5}>
          {titleAndCount}
        </Box>
        {content}
      </Card>
    </Box>
  );
};

export default InstanceCodeListPage;
