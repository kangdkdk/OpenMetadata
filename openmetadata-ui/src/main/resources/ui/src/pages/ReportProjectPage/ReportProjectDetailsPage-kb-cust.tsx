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
import { ReportProject } from '../../generated/entity/data/reportProject-kb-cust';
import { useFqn } from '../../hooks/useFqn';
import { getReportProjectByFqn } from '../../rest/reportProjectAPI-kb-cust';
import { getEntityName } from '../../utils/EntityNameUtils';
import { showErrorToast } from '../../utils/ToastUtils';

const ReportProjectDetailsPage = () => {
  const { t } = useTranslation();
  const { fqn: reportProjectFqn } = useFqn();
  const [reportProject, setReportProject] = useState<ReportProject>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchReportProject = async () => {
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
    };

    if (reportProjectFqn) {
      fetchReportProject();
    }
  }, [reportProjectFqn]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !reportProject) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.CUSTOM} />;
  }

  return (
    <div className="tw:p-6 tw:max-w-3xl">
      <h1 className="tw:text-lg tw:font-semibold tw:mb-1">
        {getEntityName(reportProject)}
      </h1>
      <p className="tw:text-sm tw:text-gray-500 tw:mb-4">
        {reportProject.description}
      </p>
      <table className="tw:w-full tw:border tw:border-gray-200 tw:text-sm tw:mb-6">
        <tbody>
          <tr className="tw:border-b tw:border-gray-100">
            <td className="tw:p-2 tw:font-medium tw:w-48 tw:bg-gray-50">
              {t('label.name')}
            </td>
            <td className="tw:p-2">{getEntityName(reportProject)}</td>
          </tr>
          <tr className="tw:border-b tw:border-gray-100">
            <td className="tw:p-2 tw:font-medium tw:w-48 tw:bg-gray-50">
              Type
            </td>
            <td className="tw:p-2">{reportProject.type}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="tw:text-base tw:font-semibold tw:mb-2">
        Saved Queries
      </h2>
      <table className="tw:w-full tw:border tw:border-gray-200 tw:text-sm">
        <thead>
          <tr className="tw:bg-gray-50">
            <th className="tw:p-2 tw:text-left tw:border-b tw:border-gray-200">
              Service
            </th>
            <th className="tw:p-2 tw:text-left tw:border-b tw:border-gray-200">
              Query
            </th>
          </tr>
        </thead>
        <tbody>
          {(reportProject.queries ?? []).map((query, index) => (
            <tr
              className="tw:border-b tw:border-gray-100"
              key={`${query.service}-${index}`}>
              <td className="tw:p-2">{query.service}</td>
              <td className="tw:p-2 tw:font-mono">{query.query}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportProjectDetailsPage;
