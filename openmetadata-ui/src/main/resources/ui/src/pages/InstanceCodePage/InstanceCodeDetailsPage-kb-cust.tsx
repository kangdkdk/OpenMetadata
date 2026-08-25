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
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
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

  const fields: [string, string][] = [
    [t('label.name'), getEntityName(instanceCode)],
    ['Code Group', instanceCode.codeGroup ?? '-'],
    ['Code Group Name', instanceCode.codeGroupName ?? '-'],
    ['Code Value', instanceCode.codeValue ?? '-'],
    ['Code Name', instanceCode.codeName ?? '-'],
    ['Sort Order', String(instanceCode.sortOrder ?? '-')],
    ['Registered Date', instanceCode.registeredDate ?? '-'],
    ['Active', instanceCode.active ? 'Y' : 'N'],
  ];

  return (
    <div className="tw:p-6 tw:max-w-2xl">
      <h1 className="tw:text-lg tw:font-semibold tw:mb-4">
        {getEntityName(instanceCode)}
      </h1>
      <table className="tw:w-full tw:border tw:border-gray-200 tw:text-sm">
        <tbody>
          {fields.map(([label, value]) => (
            <tr className="tw:border-b tw:border-gray-100" key={label}>
              <td className="tw:p-2 tw:font-medium tw:w-48 tw:bg-gray-50">
                {label}
              </td>
              <td className="tw:p-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstanceCodeDetailsPage;
