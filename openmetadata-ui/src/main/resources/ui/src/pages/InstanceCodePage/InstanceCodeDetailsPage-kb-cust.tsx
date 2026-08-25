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
import { Navigate } from 'react-router-dom';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../components/common/Loader/Loader';
import { ERROR_PLACEHOLDER_TYPE } from '../../enums/common.enum';
import { useFqn } from '../../hooks/useFqn';
import { getInstanceCodeByFqn } from '../../rest/instanceCodeAPI-kb-cust';
import { getInstanceCodeGroupPath } from '../../utils/RouterUtils';
import { showErrorToast } from '../../utils/ToastUtils';

/**
 * Individual InstanceCode entities are rows within a code group. There is no
 * standalone single-code view — visiting a code's own URL (e.g. from Explore
 * search results) redirects to its group's table page.
 */
const InstanceCodeDetailsPage = () => {
  const { fqn: instanceCodeFqn } = useFqn();
  const [codeGroup, setCodeGroup] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchInstanceCode = async () => {
      setIsLoading(true);
      try {
        const data = await getInstanceCodeByFqn(instanceCodeFqn);
        setCodeGroup(data.codeGroup);
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

  if (isError || !codeGroup) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.CUSTOM} />;
  }

  return <Navigate replace to={getInstanceCodeGroupPath(codeGroup)} />;
};

export default InstanceCodeDetailsPage;
