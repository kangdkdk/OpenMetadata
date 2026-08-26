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
import { NO_DATA } from '../../constants/constants';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { InstanceCode } from '../../generated/entity/data/instanceCode-kb-cust';
import { getInstanceCodes } from '../../rest/instanceCodeAPI-kb-cust';
import { parseInstanceCodeOwners } from '../../utils/InstanceCodeOwnerUtils-kb-cust';
import { getInstanceCodeGroupPath } from '../../utils/RouterUtils';
import { showErrorToast } from '../../utils/ToastUtils';

const sortInstanceCodes = (instanceCodes: InstanceCode[]) =>
  [...instanceCodes].sort((a, b) => {
    const groupCompare = a.codeGroup.localeCompare(b.codeGroup);

    return groupCompare !== 0
      ? groupCompare
      : (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

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

  const sortedInstanceCodes = useMemo(
    () => sortInstanceCodes(instanceCodes),
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
    count: sortedInstanceCodes.length,
    loading,
  });

  const handleRowClick = useCallback(
    (instanceCode: InstanceCode) => {
      navigate(getInstanceCodeGroupPath(instanceCode.codeGroup));
    },
    [navigate]
  );

  const columns: ColumnDef[] = useMemo(
    () => [
      { id: 'codeGroup', label: t('label.instance-code-name-kb-cust') },
      { id: 'codeValue', label: t('label.business-instance-code-kb-cust') },
      { id: 'codeName', label: t('label.business-instance-content-kb-cust') },
      { id: 'owners', label: t('label.owner-kb-cust') },
    ],
    [t]
  );

  const renderCell = useCallback(
    (instanceCode: InstanceCode, columnId: string): ReactNode => {
      switch (columnId) {
        case 'codeGroup':
          return (
            <Typography size="text-sm" weight="medium">
              {instanceCode.codeGroupName || instanceCode.codeGroup}
              <span className="tw:text-tertiary tw:font-mono tw:font-normal">
                {' '}
                ({instanceCode.codeGroup})
              </span>
            </Typography>
          );
        case 'codeValue':
          return (
            <Typography className="tw:font-mono" size="text-sm">
              {instanceCode.codeValue}
            </Typography>
          );
        case 'codeName':
          return (
            <Typography size="text-sm">
              {instanceCode.codeName || instanceCode.displayName || NO_DATA}
            </Typography>
          );
        case 'owners':
          return (
            <OwnerAvatarGroup
              owners={parseInstanceCodeOwners(instanceCode.description)}
            />
          );
        default:
          return null;
      }
    },
    []
  );

  const content = useMemo(() => {
    if (!loading && sortedInstanceCodes.length === 0) {
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
        entities={sortedInstanceCodes}
        loading={loading}
        renderCell={renderCell}
        selectedEntities={[]}
        onEntityClick={handleRowClick}
        onSelect={() => {}}
        onSelectAll={() => {}}
      />
    );
  }, [loading, sortedInstanceCodes, columns, renderCell, handleRowClick, t]);

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
