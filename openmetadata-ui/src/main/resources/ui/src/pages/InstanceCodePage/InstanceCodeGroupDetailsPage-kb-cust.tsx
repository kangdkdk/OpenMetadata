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
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../components/common/atoms/navigation/useBreadcrumbs';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import OwnerAvatarGroup from '../../components/common/OwnerAvatarGroup/OwnerAvatarGroup-kb-cust';
import { NO_DATA } from '../../constants/constants';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { EntityType } from '../../enums/entity.enum';
import { InstanceCode } from '../../generated/entity/data/instanceCode-kb-cust';
import {
  Column,
  Table as TableEntity,
} from '../../generated/entity/data/table';
import { EntityReference } from '../../generated/entity/type';
import { useClipboard } from '../../hooks/useClipBoard';
import { useFqn } from '../../hooks/useFqn';
import { getInstanceCodes } from '../../rest/instanceCodeAPI-kb-cust';
import { getTableList } from '../../rest/tableAPI';
import entityUtilClassBase from '../../utils/EntityUtilClassBase';
import {
  parseInstanceCodeDefinition,
  parseInstanceCodeOwners,
  parseInstanceCodeStandardClassification,
} from '../../utils/InstanceCodeOwnerUtils-kb-cust';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';

interface RelatedTableMatch {
  table: TableEntity;
  columnName: string;
}

const InstanceCodeGroupDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: codeGroup } = useFqn();

  const [instanceCodes, setInstanceCodes] = useState<InstanceCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedTables, setRelatedTables] = useState<RelatedTableMatch[]>([]);
  const [relatedTablesLoading, setRelatedTablesLoading] = useState(true);

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

  useEffect(() => {
    const fetchRelatedTables = async () => {
      if (instanceCodes.length === 0) {
        setRelatedTables([]);
        setRelatedTablesLoading(false);

        return;
      }
      setRelatedTablesLoading(true);
      try {
        const instanceCodeIds = new Set(
          instanceCodes.map((instanceCode) => instanceCode.id)
        );
        const response = await getTableList({
          fields: 'columns,extension',
          limit: 200,
        });
        const matches: RelatedTableMatch[] = [];
        response.data.forEach((table) => {
          (table.columns ?? []).forEach((column: Column) => {
            const linkedInstanceCode = column.extension?.instanceCodeName as
              | EntityReference
              | undefined;
            if (
              linkedInstanceCode?.id &&
              instanceCodeIds.has(linkedInstanceCode.id)
            ) {
              matches.push({ table, columnName: column.name });
            }
          });
        });
        setRelatedTables(matches);
      } catch (error) {
        showErrorToast(error as AxiosError);
      } finally {
        setRelatedTablesLoading(false);
      }
    };

    fetchRelatedTables();
  }, [instanceCodes]);

  const codeGroupName = useMemo(
    () => instanceCodes[0]?.codeGroupName,
    [instanceCodes]
  );

  const ownersByType = useMemo(() => {
    const owners = parseInstanceCodeOwners(instanceCodes[0]?.description);
    const grouped = new Map<string, typeof owners>();
    owners.forEach((owner) => {
      const key = owner.type || t('label.owner-kb-cust');
      grouped.set(key, [...(grouped.get(key) ?? []), owner]);
    });

    return Array.from(grouped.entries());
  }, [instanceCodes, t]);

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
      t('label.business-instance-code-kb-cust'),
      t('label.business-instance-content-kb-cust'),
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
            {t('label.instance-code-plural-kb-cust')}
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
              {
                id: 'codeValue',
                label: t('label.business-instance-code-kb-cust'),
              },
              {
                id: 'codeName',
                label: t('label.business-instance-content-kb-cust'),
              },
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

  const infoBox = useMemo(() => {
    const description = instanceCodes[0]?.description;
    const definition = parseInstanceCodeDefinition(description);
    const standardClassification =
      parseInstanceCodeStandardClassification(description);

    const items = [
      {
        term: t('label.instance-identifier-kb-cust'),
        value: codeGroup,
      },
      {
        term: t('label.instance-definition-kb-cust'),
        value: definition || NO_DATA,
      },
      {
        term: t('label.standard-classification-kb-cust'),
        value: standardClassification || NO_DATA,
      },
    ];

    return (
      <Card style={{ padding: 20 }} variant="elevated">
        <Box direction="col" gap={3}>
          {items.map((item) => (
            <Box direction="row" gap={3} key={item.term}>
              <Typography
                className="tw:w-36 tw:shrink-0"
                size="text-sm"
                weight="semibold">
                {item.term}
              </Typography>
              <Typography className="tw:text-tertiary" size="text-sm">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    );
  }, [instanceCodes, codeGroup, t]);

  const relatedTablesPanel = useMemo(
    () => (
      <Card style={{ padding: 20 }} variant="elevated">
        <Typography className="tw:mb-3" size="text-md" weight="semibold">
          {t('label.related-table-plural-kb-cust')}
        </Typography>
        {relatedTablesLoading ? (
          <Loader size="small" />
        ) : relatedTables.length === 0 ? (
          <Typography className="tw:text-tertiary" size="text-sm">
            {t('message.no-data-message', {
              entity: t('label.related-table-plural-kb-cust'),
            })}
          </Typography>
        ) : (
          <Box direction="col" gap={4}>
            {relatedTables.map((match) => (
              <Link
                className="no-underline"
                key={`${match.table.id}-${match.columnName}`}
                to={entityUtilClassBase.getEntityLink(
                  EntityType.TABLE,
                  match.table.fullyQualifiedName ?? ''
                )}>
                <Typography
                  className="tw:text-brand"
                  size="text-sm"
                  weight="medium">
                  {match.table.displayName || match.table.name}
                </Typography>
                <Typography className="tw:text-tertiary" size="text-xs">
                  {match.columnName}
                </Typography>
              </Link>
            ))}
          </Box>
        )}
      </Card>
    ),
    [relatedTables, relatedTablesLoading, t]
  );

  const ownersPanel = useMemo(
    () => (
      <Card style={{ padding: 20 }} variant="elevated">
        <Typography className="tw:mb-3" size="text-md" weight="semibold">
          {t('label.owner-kb-cust')}
        </Typography>
        {ownersByType.length === 0 ? (
          <Typography className="tw:text-tertiary" size="text-sm">
            {t('message.no-data-message', {
              entity: t('label.owner-kb-cust'),
            })}
          </Typography>
        ) : (
          <Box direction="col" gap={4}>
            {ownersByType.map(([type, owners]) => (
              <Box direction="col" gap={2} key={type}>
                <Typography
                  className="tw:text-tertiary"
                  size="text-xs"
                  weight="semibold">
                  {type}
                </Typography>
                <OwnerAvatarGroup owners={owners} />
              </Box>
            ))}
          </Box>
        )}
      </Card>
    ),
    [ownersByType, t]
  );

  return (
    <Box className="tw:p-6" direction="col" gap={5}>
      {breadcrumbs}
      <Card style={{ padding: 24 }} variant="elevated">
        <Box direction="col" gap={2}>
          <Box align="center" direction="row" gap={3}>
            <Typography size="text-xl" weight="semibold">
              {codeGroupName || codeGroup}
            </Typography>
            <Badge color="brand" size="md">
              {codeGroup}
            </Badge>
          </Box>
        </Box>
      </Card>
      {infoBox}
      <div className="tw:grid tw:grid-cols-1 tw:gap-5 tw:lg:grid-cols-3">
        <div className="tw:lg:col-span-2">
          <Card variant="elevated">{content}</Card>
        </div>
        <Box direction="col" gap={5}>
          {relatedTablesPanel}
          {ownersPanel}
        </Box>
      </div>
    </Box>
  );
};

export default InstanceCodeGroupDetailsPage;
