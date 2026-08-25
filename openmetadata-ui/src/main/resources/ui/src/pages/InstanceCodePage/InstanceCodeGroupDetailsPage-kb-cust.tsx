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
import {
  Badge,
  Box,
  Button,
  Card,
  Table,
  Typography,
} from '@openmetadata/ui-core-components';
import { Copy01 } from '@untitledui/icons';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbs } from '../../components/common/atoms/navigation/useBreadcrumbs';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import { NO_DATA } from '../../constants/constants';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { InstanceCode } from '../../generated/entity/data/instanceCode-kb-cust';
import { useClipboard } from '../../hooks/useClipBoard';
import { useFqn } from '../../hooks/useFqn';
import { getInstanceCodes } from '../../rest/instanceCodeAPI-kb-cust';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';

const InstanceCodeGroupDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: codeGroup } = useFqn();

  const [instanceCodes, setInstanceCodes] = useState<InstanceCode[]>([]);
  const [loading, setLoading] = useState(true);

  const { onCopyToClipBoard } = useClipboard('');

  const fetchInstanceCodes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInstanceCodes({ limit: 200 });
      setInstanceCodes(
        response.data
          .filter((instanceCode) => instanceCode.codeGroup === codeGroup)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [codeGroup]);

  useEffect(() => {
    fetchInstanceCodes();
  }, [fetchInstanceCodes]);

  const codeGroupName = useMemo(
    () => instanceCodes[0]?.codeGroupName,
    [instanceCodes]
  );

  const { breadcrumbs } = useBreadcrumbs({
    items: [
      {
        name: t('label.instance-code-plural-kb-cust'),
        url: '/instanceCodes',
      },
      {
        name: codeGroupName ? `${codeGroup} | ${codeGroupName}` : codeGroup,
        url: '',
        isActive: true,
      },
    ],
  });

  const handleCopyTable = useCallback(() => {
    const header = [
      t('label.code-value-kb-cust'),
      t('label.code-name-kb-cust'),
      t('label.registered-date-kb-cust'),
    ].join('\t');
    const rows = instanceCodes.map((instanceCode) =>
      [
        instanceCode.codeValue,
        instanceCode.codeName ?? '',
        instanceCode.registeredDate ?? '',
      ].join('\t')
    );
    onCopyToClipBoard([header, ...rows].join('\n'));
    showSuccessToast(t('message.copied-to-clipboard'));
  }, [instanceCodes, onCopyToClipBoard, t]);

  const content = useMemo(() => {
    if (loading) {
      return <Loader />;
    }

    if (instanceCodes.length === 0) {
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
      <>
        <Box
          align="center"
          className="tw:px-6 tw:py-4 tw:border-b tw:border-secondary"
          justify="between">
          <Typography size="text-md" weight="semibold">
            {t('label.detail-plural')}
          </Typography>
          <Button
            color="secondary"
            iconLeading={Copy01}
            size="sm"
            onClick={handleCopyTable}>
            {t('label.copy-table')}
          </Button>
        </Box>
        <Table aria-label={t('label.instance-code-plural-kb-cust')} size="md">
          <Table.Header
            columns={[
              { id: 'codeValue', label: t('label.code-value-kb-cust') },
              { id: 'codeName', label: t('label.code-name-kb-cust') },
              {
                id: 'registeredDate',
                label: t('label.registered-date-kb-cust'),
              },
            ]}>
            {(col) => <Table.Head id={col.id} key={col.id} label={col.label} />}
          </Table.Header>
          <Table.Body items={instanceCodes}>
            {(instanceCode) => (
              <Table.Row
                columns={[
                  { id: 'codeValue' },
                  { id: 'codeName' },
                  { id: 'registeredDate' },
                ]}
                id={instanceCode.id ?? instanceCode.name}
                key={instanceCode.id}>
                {(col) => (
                  <Table.Cell key={col.id}>
                    {col.id === 'codeValue' && (
                      <Typography size="text-sm" weight="medium">
                        {instanceCode.codeValue}
                      </Typography>
                    )}
                    {col.id === 'codeName' && (
                      <Typography size="text-sm">
                        {instanceCode.codeName || NO_DATA}
                      </Typography>
                    )}
                    {col.id === 'registeredDate' && (
                      <Typography
                        className="tw:text-secondary tw:font-mono"
                        size="text-sm">
                        {instanceCode.registeredDate || NO_DATA}
                      </Typography>
                    )}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </>
    );
  }, [loading, instanceCodes, handleCopyTable, t]);

  return (
    <Box className="tw:p-6" direction="col" gap={5}>
      {breadcrumbs}
      <Card style={{ padding: 24 }} variant="elevated">
        <Box direction="col" gap={2}>
          <Box align="center" direction="row" gap={3}>
            <Typography size="text-xl" weight="semibold">
              {codeGroup}
            </Typography>
            {codeGroupName && (
              <Badge color="brand" size="md">
                {codeGroupName}
              </Badge>
            )}
          </Box>
        </Box>
      </Card>
      <Card variant="elevated">{content}</Card>
    </Box>
  );
};

export default InstanceCodeGroupDetailsPage;
