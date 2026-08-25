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
import { Edit01, Plus, Trash01 } from '@untitledui/icons';
import { AxiosError } from 'axios';
import { compare } from 'fast-json-patch';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboardButton from '../../components/common/CopyToClipboardButton/CopyToClipboardButton';
import { DeleteModal } from '../../components/common/DeleteModal/DeleteModal';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import PageHeader from '../../components/PageHeader/PageHeader.component';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import {
  ReportProject,
  ReportQuery,
} from '../../generated/entity/data/reportProject-kb-cust';
import { useFqn } from '../../hooks/useFqn';
import {
  getReportProjectByFqn,
  patchReportProject,
} from '../../rest/reportProjectAPI-kb-cust';
import { getEntityName } from '../../utils/EntityNameUtils';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';
import ReportProjectQueryModal from './ReportProjectQueryModal-kb-cust';

const QUERY_TABLE_COLUMNS = [
  { id: 'service', name: 'label.service' },
  { id: 'query', name: 'label.query' },
  { id: 'actions', name: 'label.action-plural' },
];

const ReportProjectDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: reportProjectFqn } = useFqn();
  const [reportProject, setReportProject] = useState<ReportProject>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [queryModal, setQueryModal] = useState<{
    open: boolean;
    editIndex: number | null;
  }>({ open: false, editIndex: null });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const fetchReportProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReportProjectByFqn(reportProjectFqn);
      setReportProject(data);
    } catch (error) {
      setIsError(true);
      showErrorToast(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }, [reportProjectFqn]);

  useEffect(() => {
    if (reportProjectFqn) {
      fetchReportProject();
    }
  }, [reportProjectFqn]);

  const saveQueries = async (updatedQueries: ReportQuery[]) => {
    if (!reportProject) {
      return;
    }
    setIsSaving(true);
    try {
      const jsonPatch = compare(reportProject, {
        ...reportProject,
        queries: updatedQueries,
      });
      const updated = await patchReportProject(
        reportProject.id ?? '',
        jsonPatch
      );
      setReportProject(updated);
      showSuccessToast(
        t('message.entity-saved-successfully', {
          entity: t('label.query-plural'),
        })
      );
      setQueryModal({ open: false, editIndex: null });
      setDeleteIndex(null);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuerySubmit = (value: ReportQuery) => {
    const existingQueries = reportProject?.queries ?? [];
    const updatedQueries =
      queryModal.editIndex === null
        ? [...existingQueries, value]
        : existingQueries.map((q, i) =>
            i === queryModal.editIndex ? value : q
          );

    saveQueries(updatedQueries);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex === null) {
      return;
    }
    const updatedQueries = (reportProject?.queries ?? []).filter(
      (_, i) => i !== deleteIndex
    );
    saveQueries(updatedQueries);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !reportProject) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.CUSTOM} />;
  }

  const queries = reportProject.queries ?? [];

  return (
    <Box className="tw:gap-4 tw:p-6" direction="col">
      <PageHeader
        data={{
          header: getEntityName(reportProject),
          subHeader: reportProject.description ?? '',
        }}
      />

      <Card className="tw:p-5">
        <div className="tw:flex tw:items-center tw:gap-6">
          <div>
            <Typography
              className="tw:text-tertiary tw:mb-1"
              size="text-xs"
              weight="medium">
              {t('label.type')}
            </Typography>
            <Badge color="brand" size="sm" type="pill-color">
              {reportProject.type}
            </Badge>
          </div>
        </div>
      </Card>

      <Box align="center" justify="between">
        <Typography size="text-md" weight="semibold">
          {t('label.query-plural')}
        </Typography>
        <Button
          color="primary"
          data-testid="add-query-button"
          iconLeading={Plus}
          size="sm"
          onClick={() => setQueryModal({ open: true, editIndex: null })}>
          {t('label.add-entity', { entity: t('label.query') })}
        </Button>
      </Box>

      <Table aria-label={t('label.query-plural')} data-testid="query-table">
        <Table.Header columns={QUERY_TABLE_COLUMNS}>
          {(col) => (
            <Table.Head id={col.id} key={col.id} label={t(col.name)} />
          )}
        </Table.Header>
        <Table.Body
          items={queries}
          renderEmptyState={() => (
            <Typography className="tw:text-tertiary" size="text-sm">
              {t('label.none')}
            </Typography>
          )}>
          {(record: ReportQuery) => {
            const index = queries.indexOf(record);

            return (
              <Table.Row data-testid={`query-row-${index}`} id={String(index)}>
                <Table.Cell>
                  <Typography size="text-sm" weight="semibold">
                    {record.service}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <Typography className="tw:font-mono" size="text-sm">
                    {record.query}
                  </Typography>
                </Table.Cell>
                <Table.Cell>
                  <Box className="tw:gap-1">
                    <CopyToClipboardButton copyText={record.query} />
                    <Button
                      color="tertiary"
                      data-testid={`edit-query-${index}`}
                      iconLeading={Edit01}
                      size="sm"
                      onClick={() =>
                        setQueryModal({ open: true, editIndex: index })
                      }
                    />
                    <Button
                      color="tertiary-destructive"
                      data-testid={`delete-query-${index}`}
                      iconLeading={Trash01}
                      size="sm"
                      onClick={() => setDeleteIndex(index)}
                    />
                  </Box>
                </Table.Cell>
              </Table.Row>
            );
          }}
        </Table.Body>
      </Table>

      <ReportProjectQueryModal
        initialValue={
          queryModal.editIndex !== null ? queries[queryModal.editIndex] : null
        }
        isSaving={isSaving}
        open={queryModal.open}
        onCancel={() => setQueryModal({ open: false, editIndex: null })}
        onSubmit={handleQuerySubmit}
      />

      <DeleteModal
        entityTitle={t('label.query')}
        isDeleting={isSaving}
        message={t('message.delete-entity-permanently', {
          entityType: t('label.query'),
        })}
        open={deleteIndex !== null}
        onCancel={() => setDeleteIndex(null)}
        onDelete={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ReportProjectDetailsPage;
