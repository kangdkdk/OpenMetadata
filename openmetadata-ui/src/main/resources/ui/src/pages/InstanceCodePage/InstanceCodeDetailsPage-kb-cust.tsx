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
import { Badge, Box, Card, Typography } from '@openmetadata/ui-core-components';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import PageHeader from '../../components/PageHeader/PageHeader.component';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { InstanceCode } from '../../generated/entity/data/instanceCode-kb-cust';
import { useFqn } from '../../hooks/useFqn';
import { getInstanceCodeByFqn } from '../../rest/instanceCodeAPI-kb-cust';
import { getEntityName } from '../../utils/EntityNameUtils';
import { showErrorToast } from '../../utils/ToastUtils';

const InstanceCodeDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: instanceCodeFqn } = useFqn();
  const [instanceCode, setInstanceCode] = useState<InstanceCode>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchInstanceCode = async () => {
      setIsLoading(true);
      try {
        const data = await getInstanceCodeByFqn(instanceCodeFqn);
        setInstanceCode(data);
      } catch (error) {
        setIsError(true);
        showErrorToast(error as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };

    if (instanceCodeFqn) {
      fetchInstanceCode();
    }
  }, [instanceCodeFqn]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !instanceCode) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.CUSTOM} />;
  }

  const fields: { label: string; value: React.ReactNode }[] = [
    { label: t('label.code-group-kb-cust'), value: instanceCode.codeGroup },
    {
      label: t('label.code-group-name-kb-cust'),
      value: instanceCode.codeGroupName,
    },
    { label: t('label.code-value-kb-cust'), value: instanceCode.codeValue },
    { label: t('label.code-name-kb-cust'), value: instanceCode.codeName },
    { label: t('label.sort-order-kb-cust'), value: instanceCode.sortOrder },
    {
      label: t('label.registered-date-kb-cust'),
      value: instanceCode.registeredDate,
    },
    {
      label: t('label.active'),
      value: (
        <Badge
          color={instanceCode.active ? 'success' : 'gray'}
          size="sm"
          type="pill-color">
          {instanceCode.active ? t('label.yes') : t('label.no')}
        </Badge>
      ),
    },
  ];

  return (
    <Box className="tw:gap-4 tw:p-6 tw:max-w-2xl" direction="col">
      <PageHeader
        data={{
          header: getEntityName(instanceCode),
          subHeader: instanceCode.description ?? '',
        }}
      />

      <Card className="tw:p-5">
        <div className="tw:grid tw:grid-cols-2 tw:gap-4">
          {fields.map((field) => (
            <div key={field.label}>
              <Typography
                className="tw:text-tertiary tw:mb-1"
                size="text-xs"
                weight="medium">
                {field.label}
              </Typography>
              <Typography size="text-sm">{field.value}</Typography>
            </div>
          ))}
        </div>
      </Card>
    </Box>
  );
};

export default InstanceCodeDetailsPage;
