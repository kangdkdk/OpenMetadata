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
import {
  ApartmentOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

interface TeamContactInfoProps {
  address?: string;
  faxNumber?: string;
  branchCode?: string;
  contactNumber?: string;
}

const TeamContactInfo = ({
  address,
  faxNumber,
  branchCode,
  contactNumber,
}: TeamContactInfoProps) => {
  const { t } = useTranslation();

  const items = [
    { icon: <EnvironmentOutlined />, label: t('label.address'), value: address },
    {
      icon: <PrinterOutlined />,
      label: t('label.fax-number-kb-cust'),
      value: faxNumber,
    },
    {
      icon: <ApartmentOutlined />,
      label: t('label.branch-code-kb-cust'),
      value: branchCode,
    },
    {
      icon: <PhoneOutlined />,
      label: t('label.contact-number-kb-cust'),
      value: contactNumber,
    },
  ].filter((item) => item.value);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="m-t-md">
      <div className="d-flex flex-col gap-3">
        {items.map((item) => (
          <div className="d-flex items-center gap-2" key={item.label}>
            {item.icon}
            <Typography.Text className="text-sm font-medium">
              {item.label}
            </Typography.Text>
            <Typography.Text className="text-sm text-grey-muted">
              {item.value}
            </Typography.Text>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TeamContactInfo;
