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
  Typography,
} from '@openmetadata/ui-core-components';
import { Edit01 } from '@untitledui/icons';
import { AxiosError } from 'axios';
import { compare } from 'fast-json-patch';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboardButton from '../../components/common/CopyToClipboardButton/CopyToClipboardButton';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import RichTextEditorPreviewerV1 from '../../components/common/RichTextEditor/RichTextEditorPreviewerV1';
import SchemaEditor from '../../components/Database/SchemaEditor/SchemaEditor';
import PageHeader from '../../components/PageHeader/PageHeader.component';
import { CSMode } from '../../enums/codemirror.enum';
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

const ReportProjectDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: reportProjectFqn } = useFqn();
  const [reportProject, setReportProject] = useState<ReportProject>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);

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

  const handleQuerySubmit = async (value: ReportQuery) => {
    if (!reportProject) {
      return;
    }
    setIsSaving(true);
    try {
      const jsonPatch = compare(reportProject, {
        ...reportProject,
        queries: [value],
      });
      const updated = await patchReportProject(
        reportProject.id ?? '',
        jsonPatch
      );
      setReportProject(updated);
      showSuccessToast(
        t('message.entity-saved-successfully', {
          entity: t('label.query'),
        })
      );
      setIsQueryModalOpen(false);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !reportProject) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.CUSTOM} />;
  }

  const query = reportProject.queries?.[0];

  return (
    <Box className="tw:gap-4 tw:p-6" direction="col">
      <PageHeader
        data={{
          header: getEntityName(reportProject),
          subHeader: '',
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

      {reportProject.description && (
        <Card className="tw:p-5">
          <Typography className="tw:mb-2" size="text-md" weight="semibold">
            {t('label.description')}
          </Typography>
          <RichTextEditorPreviewerV1 markdown={reportProject.description} />
        </Card>
      )}

      <Card className="tw:p-5">
        <Box align="center" className="tw:mb-3" justify="between">
          <Typography size="text-md" weight="semibold">
            {t('label.query')}
          </Typography>
          {query && (
            <Box className="tw:gap-1">
              <CopyToClipboardButton copyText={query.query} />
              <Button
                color="tertiary"
                data-testid="edit-query-button"
                iconLeading={Edit01}
                size="sm"
                onClick={() => setIsQueryModalOpen(true)}>
                {t('label.edit')}
              </Button>
            </Box>
          )}
        </Box>
        {query ? (
          <SchemaEditor
            className="report-project-query-editor-kb-cust"
            data-testid="query-display"
            mode={{ name: CSMode.SQL }}
            options={{ readOnly: true }}
            showCopyButton={false}
            value={query.query}
          />
        ) : (
          <Box align="center" className="tw:gap-3" direction="col">
            <Typography className="tw:text-tertiary" size="text-sm">
              {t('label.no-entity', { entity: t('label.query') })}
            </Typography>
            <Button
              color="primary"
              data-testid="add-query-button"
              size="sm"
              onClick={() => setIsQueryModalOpen(true)}>
              {t('label.add-entity', { entity: t('label.query') })}
            </Button>
          </Box>
        )}
      </Card>

      <ReportProjectQueryModal
        initialValue={query ?? null}
        isSaving={isSaving}
        open={isQueryModalOpen}
        onCancel={() => setIsQueryModalOpen(false)}
        onSubmit={handleQuerySubmit}
      />
    </Box>
  );
};

export default ReportProjectDetailsPage;
