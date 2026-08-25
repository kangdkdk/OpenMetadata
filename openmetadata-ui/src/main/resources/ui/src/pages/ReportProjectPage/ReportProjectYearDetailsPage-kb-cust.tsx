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
import { Card, Typography } from '@openmetadata/ui-core-components';
import { AxiosError } from 'axios';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '../../components/common/atoms/navigation/useBreadcrumbs';
import EntityListingTable from '../../components/common/EntityListingTable/EntityListingTable.component';
import { ColumnDef } from '../../components/common/EntityListingTable/EntityListingTable.interface';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import { NO_DATA } from '../../constants/constants';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { EntityType } from '../../enums/entity.enum';
import { ReportProject } from '../../generated/entity/data/reportProject-kb-cust';
import { useFqn } from '../../hooks/useFqn';
import { getReportProjects } from '../../rest/reportProjectAPI-kb-cust';
import { getEntityDetailsPath } from '../../utils/RouterUtils';
import {
  getReportProjectYear,
  getReportProjectYearLabel,
} from '../../utils/ReportProjectUtils-kb-cust';
import { showErrorToast } from '../../utils/ToastUtils';

const ReportProjectYearDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fqn: year } = useFqn();

  const [reportProjects, setReportProjects] = useState<ReportProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReportProjects({ limit: 100 });
      setReportProjects(
        response.data.filter(
          (report) => getReportProjectYear(report) === year
        )
      );
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchReportProjects();
  }, [fetchReportProjects]);

  const { breadcrumbs } = useBreadcrumbs({
    items: [
      { name: t('label.report-project-plural-kb-cust'), url: '/reportProjects' },
      {
        name: getReportProjectYearLabel(year, t('label.unknown')),
        url: '',
        isActive: true,
      },
    ],
  });

  const columns: ColumnDef[] = useMemo(
    () => [
      { id: 'name', label: t('label.name') },
      { id: 'displayName', label: t('label.display-name') },
      { id: 'type', label: t('label.type') },
    ],
    [t]
  );

  const renderCell = useCallback(
    (entity: ReportProject, columnId: string): ReactNode => {
      switch (columnId) {
        case 'name':
          return (
            <Typography size="text-sm" weight="medium">
              {entity.name}
            </Typography>
          );
        case 'displayName':
          return (
            <Typography size="text-sm">
              {entity.displayName || NO_DATA}
            </Typography>
          );
        case 'type':
          return <Typography size="text-sm">{entity.type}</Typography>;
        default:
          return null;
      }
    },
    []
  );

  const handleEntityClick = useCallback(
    (entity: ReportProject) => {
      navigate(
        getEntityDetailsPath(
          EntityType.REPORT_PROJECT,
          entity.fullyQualifiedName ?? entity.name
        )
      );
    },
    [navigate]
  );

  const content = useMemo(() => {
    if (!loading && reportProjects.length === 0) {
      return (
        <ErrorPlaceHolder
          className="tw:border-none"
          heading={t('message.no-data-message', {
            entity: t('label.report-project-plural-kb-cust'),
          })}
          type={ERROR_PLACEHOLDER_TYPE.NO_DATA}
        />
      );
    }

    return (
      <EntityListingTable
        ariaLabel={t('label.report-project-plural-kb-cust')}
        columns={columns}
        entities={reportProjects}
        loading={loading}
        renderCell={renderCell}
        selectedEntities={[]}
        onEntityClick={handleEntityClick}
        onSelect={() => {}}
        onSelectAll={() => {}}
      />
    );
  }, [loading, reportProjects, columns, renderCell, handleEntityClick, t]);

  return (
    <div className="tw:p-6 tw:flex tw:flex-col tw:gap-4">
      {breadcrumbs}
      <Card variant="elevated">{content}</Card>
    </div>
  );
};

export default ReportProjectYearDetailsPage;
