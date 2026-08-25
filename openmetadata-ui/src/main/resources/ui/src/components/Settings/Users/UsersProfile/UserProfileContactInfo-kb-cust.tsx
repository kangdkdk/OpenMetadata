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
import { PhoneOutlined, SolutionOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { NO_DATA_PLACEHOLDER } from '../../../../constants/constants';

interface UserProfileContactInfoProps {
  phone?: string;
  duty?: string;
}

const UserProfileContactInfo = ({
  phone,
  duty,
}: UserProfileContactInfoProps) => {
  const { t } = useTranslation();

  if (!phone && !duty) {
    return null;
  }

  return (
    <div className="d-flex flex-col w-full gap-4 p-[20px] user-profile-card">
      {phone && (
        <div className="d-flex items-center gap-2">
          <PhoneOutlined />
          <Typography.Text className="text-sm">{phone}</Typography.Text>
        </div>
      )}
      <div>
        <div className="d-flex items-center gap-2">
          <SolutionOutlined />
          <Typography.Text className="text-sm font-medium">
            {t('label.duty-kb-cust')}
          </Typography.Text>
        </div>
        <Typography.Text className="text-sm text-grey-muted p-l-lg">
          {duty || NO_DATA_PLACEHOLDER}
        </Typography.Text>
      </div>
    </div>
  );
};

export default UserProfileContactInfo;
