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
import { AxiosResponse } from 'axios';
import { Operation } from 'fast-json-patch';
import { PagingResponse } from 'Models';
import { ReportProject } from '../generated/entity/data/reportProject-kb-cust';
import { Include } from '../generated/type/include';
import { ListParams } from '../interface/API.interface';
import { getEncodedFqn } from '../utils/StringUtils';
import APIClient from './index';

export const getReportProjects = async (params: ListParams) => {
  const response = await APIClient.get<PagingResponse<ReportProject[]>>(
    `/reportProjects`,
    {
      params: {
        ...params,
      },
    }
  );

  return response.data;
};

export const patchReportProject = async (id: string, data: Operation[]) => {
  const response = await APIClient.patch<
    Operation[],
    AxiosResponse<ReportProject>
  >(`/reportProjects/${id}`, data);

  return response.data;
};

export const getReportProjectByFqn = async (
  fqn: string,
  params?: ListParams
) => {
  const response = await APIClient.get<ReportProject>(
    `/reportProjects/name/${getEncodedFqn(fqn)}`,
    {
      params: {
        ...params,
        include: params?.include ?? Include.All,
      },
    }
  );

  return response.data;
};
