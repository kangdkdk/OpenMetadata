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
import { Badge, Card, Typography } from '@openmetadata/ui-core-components';
import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NO_DATA_PLACEHOLDER } from '../../../constants/constants';
import { Table as TableType } from '../../../generated/entity/data/table';
import serviceUtilClassBase from '../../../utils/ServiceUtilClassBase';
import ChangeHistoryModal from './ChangeHistoryModal-kb-cust';

interface DatasetInfoPanelProps {
  table: TableType;
}

interface InfoFieldProps {
  label: string;
  children: React.ReactNode;
}

const InfoField: FC<InfoFieldProps> = ({ label, children }) => (
  <div className="tw:flex tw:flex-col tw:gap-1">
    <Typography className="tw:text-tertiary" size="text-xs" weight="medium">
      {label}
    </Typography>
    <div className="tw:text-sm">{children}</div>
  </div>
);

const DatasetInfoPanel: FC<DatasetInfoPanelProps> = ({ table }) => {
  const { t } = useTranslation();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const extension = table.extension ?? {};

  const getValue = (key: string) => {
    const value = extension[key];

    return isEmpty(value) && value !== 0 ? NO_DATA_PLACEHOLDER : value;
  };

  const isQualityCheckPassed = extension.qualityCheckResultKbCust === '통과';

  return (
    <Card className="tw:p-5" data-testid="dataset-info-panel-kb-cust">
      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-2">
        <div className="tw:flex tw:flex-col tw:gap-4">
          <Typography size="text-md" weight="semibold">
            {t('label.dataset-info-kb-cust')}
          </Typography>
          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            <InfoField label={t('label.system-infra-kb-cust')}>
              {getValue('systemInfraKbCust')}
            </InfoField>
            <InfoField label={t('label.platform')}>
              <div className="tw:flex tw:items-center tw:gap-1.5">
                {table.serviceType && (
                  <img
                    alt="platform-icon"
                    className="tw:h-4"
                    src={serviceUtilClassBase.getServiceTypeLogo({
                      serviceType: table.serviceType,
                    })}
                  />
                )}
                <span>{table.serviceType ?? NO_DATA_PLACEHOLDER}</span>
              </div>
            </InfoField>
            <InfoField label={t('label.server-name-kb-cust')}>
              {getValue('serverNameKbCust')}
            </InfoField>
            <InfoField label={t('label.server-code-kb-cust')}>
              {getValue('serverCodeKbCust')}
            </InfoField>
            <InfoField label={t('label.dataset-schema-kb-cust')}>
              {getValue('datasetSchemaKbCust')}
            </InfoField>
            <InfoField label={t('label.mydata-yn-kb-cust')}>
              {getValue('myDataYnKbCust')}
            </InfoField>
            <InfoField label={t('label.external-data-yn-kb-cust')}>
              {getValue('externalDataYnKbCust')}
            </InfoField>
          </div>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-4">
          <Typography size="text-md" weight="semibold">
            {t('label.dataset-operation-info-kb-cust')}
          </Typography>
          <div className="tw:grid tw:grid-cols-2 tw:gap-4">
            <InfoField label={t('label.last-load-date-time-kb-cust')}>
              {getValue('lastLoadDateTimeKbCust')}
            </InfoField>
            <InfoField label={t('label.odate-kb-cust')}>
              {getValue('odateKbCust')}
            </InfoField>
            <InfoField label={t('label.work-cycle-kb-cust')}>
              {getValue('workCycleKbCust')}
            </InfoField>
            <InfoField label={t('label.holiday-case-kb-cust')}>
              {getValue('holidayCaseKbCust')}
            </InfoField>
            <InfoField label={t('label.table-new-date-kb-cust')}>
              {getValue('tableNewDateKbCust')}
            </InfoField>
            <InfoField label={t('label.table-type-kb-cust')}>
              {getValue('tableTypeKbCust')}
            </InfoField>
            <InfoField label={t('label.table-change-history-kb-cust')}>
              <Typography
                className="tw:cursor-pointer tw:text-brand"
                data-testid="change-history-inquiry-link"
                size="text-sm"
                weight="medium"
                onClick={() => setIsHistoryModalOpen(true)}>
                {t('label.inquiry-kb-cust')}
              </Typography>
            </InfoField>
            <InfoField label={t('label.quality-check-result-kb-cust')}>
              {extension.qualityCheckResultKbCust ? (
                <Badge
                  color={isQualityCheckPassed ? 'success' : 'error'}
                  size="sm"
                  type="pill-color">
                  {extension.qualityCheckResultKbCust}
                </Badge>
              ) : (
                NO_DATA_PLACEHOLDER
              )}
            </InfoField>
          </div>
        </div>
      </div>
      {isHistoryModalOpen && (
        <ChangeHistoryModal
          changeHistoryJson={extension.changeHistoryKbCust}
          open={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </Card>
  );
};

export default DatasetInfoPanel;
