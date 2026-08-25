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
import { Button, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NO_DATA } from '../../../constants/constants';
import { InstanceCodeOwner } from '../../../utils/InstanceCodeOwnerUtils-kb-cust';
import UserPopOverCard from '../PopOverCard/UserPopOverCard';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface OwnerAvatarGroupProps {
  owners: InstanceCodeOwner[];
  maxVisible?: number;
  avatarWidth?: number;
}

const OwnerAvatarGroup = ({
  owners,
  maxVisible = 6,
  avatarWidth = 28,
}: OwnerAvatarGroupProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  if (owners.length === 0) {
    return <Typography.Text type="secondary">{NO_DATA}</Typography.Text>;
  }

  const visibleOwners = showAll ? owners : owners.slice(0, maxVisible);
  const remaining = owners.length - visibleOwners.length;

  return (
    <div className="d-flex items-center flex-wrap" style={{ gap: 6 }}>
      {visibleOwners.map((owner) => (
        <UserPopOverCard key={owner.username} userName={owner.username}>
          <ProfilePicture name={owner.username} width={String(avatarWidth)} />
        </UserPopOverCard>
      ))}
      {remaining > 0 && (
        <Button
          className="p-0"
          data-testid="owner-avatar-group-show-more"
          size="small"
          type="link"
          onClick={() => setShowAll(true)}>
          {t('label.more')}
        </Button>
      )}
      {showAll && owners.length > maxVisible && (
        <Button
          className="p-0"
          data-testid="owner-avatar-group-show-less"
          size="small"
          type="link"
          onClick={() => setShowAll(false)}>
          {t('label.show-less')}
        </Button>
      )}
    </div>
  );
};

export default OwnerAvatarGroup;
