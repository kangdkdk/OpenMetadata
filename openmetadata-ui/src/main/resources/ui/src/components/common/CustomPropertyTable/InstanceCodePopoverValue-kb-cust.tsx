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
import { Popover, Skeleton, Typography } from 'antd';
import { AxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InstanceCode } from '../../../generated/entity/data/instanceCode-kb-cust';
import { EntityReference } from '../../../generated/entity/type';
import { getInstanceCodeById } from '../../../rest/instanceCodeAPI-kb-cust';
import { getEntityName } from '../../../utils/EntityNameUtils';
import { showErrorToast } from '../../../utils/ToastUtils';

interface InstanceCodePopoverValueProps {
  item: EntityReference;
}

const InstanceCodePopoverValue: FC<InstanceCodePopoverValueProps> = ({
  item,
}) => {
  const { t } = useTranslation();
  const [instanceCode, setInstanceCode] = useState<InstanceCode>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!item.id) {
      setIsLoading(false);

      return;
    }
    setIsLoading(true);
    getInstanceCodeById(item.id)
      .then(setInstanceCode)
      .catch((error) => showErrorToast(error as AxiosError))
      .finally(() => setIsLoading(false));
  }, [item.id]);

  const triggerLabel = instanceCode ? getEntityName(instanceCode) : item.id;

  const popoverContent = isLoading ? (
    <Skeleton active paragraph={{ rows: 2 }} title={false} />
  ) : (
    <div className="d-flex flex-column gap-1" style={{ minWidth: 220 }}>
      <div className="d-flex justify-between">
        <Typography.Text type="secondary">
          {t('label.code-group-kb-cust')}
        </Typography.Text>
        <Typography.Text>{instanceCode?.codeGroupName}</Typography.Text>
      </div>
      <div className="d-flex justify-between">
        <Typography.Text type="secondary">
          {t('label.code-value-kb-cust')}
        </Typography.Text>
        <Typography.Text>{instanceCode?.codeValue}</Typography.Text>
      </div>
      <div className="d-flex justify-between">
        <Typography.Text type="secondary">
          {t('label.code-name-kb-cust')}
        </Typography.Text>
        <Typography.Text>{instanceCode?.codeName}</Typography.Text>
      </div>
      {instanceCode?.description && (
        <div className="d-flex flex-column">
          <Typography.Text type="secondary">
            {t('label.description')}
          </Typography.Text>
          <Typography.Text>{instanceCode.description}</Typography.Text>
        </div>
      )}
    </div>
  );

  return (
    <Popover content={popoverContent} title={triggerLabel} trigger="hover">
      <Typography.Text
        className="cursor-pointer text-primary truncate w-max-full"
        data-testid="instance-code-popover-trigger"
        ellipsis={{ tooltip: false }}>
        {triggerLabel}
      </Typography.Text>
    </Popover>
  );
};

export default InstanceCodePopoverValue;
