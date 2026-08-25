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
import {
  Button,
  Dialog,
  Input,
  Modal,
  ModalOverlay,
  TextArea,
  Typography,
} from '@openmetadata/ui-core-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportQuery } from '../../generated/entity/data/reportProject_kb_cust';

export interface ReportProjectQuerySubmitValue {
  displayName: string;
  description: string;
  query: ReportQuery;
}

interface ReportProjectQueryModalProps {
  open: boolean;
  initialDisplayName: string;
  initialDescription: string;
  initialQuery: ReportQuery | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (value: ReportProjectQuerySubmitValue) => void;
}

const ReportProjectQueryModal = ({
  open,
  initialDisplayName,
  initialDescription,
  initialQuery,
  isSaving,
  onCancel,
  onSubmit,
}: ReportProjectQueryModalProps) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setDisplayName(initialDisplayName);
      setDescription(initialDescription);
      setQuery(initialQuery?.query ?? '');
    }
  }, [open, initialDisplayName, initialDescription, initialQuery]);

  const isSubmitDisabled = !displayName.trim() || !query.trim();

  return (
    <ModalOverlay
      isDismissable={!isSaving}
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && !isSaving && onCancel()}>
      <Modal>
        <Dialog
          showCloseButton
          data-testid="report-project-query-modal"
          title={
            initialQuery
              ? t('label.edit-entity', { entity: t('label.query') })
              : t('label.add-entity', { entity: t('label.query') })
          }
          width={520}
          onClose={onCancel}>
          <Dialog.Content>
            <div className="tw:flex tw:flex-col tw:gap-4">
              <div className="tw:flex tw:flex-col tw:gap-1.5">
                <Typography size="text-sm" weight="medium">
                  {t('label.report-project-name-kb-cust')}
                </Typography>
                <Input
                  aria-label={t('label.report-project-name-kb-cust')}
                  data-testid="report-project-display-name-input"
                  isDisabled={isSaving}
                  placeholder={t('label.report-project-name-kb-cust')}
                  value={displayName}
                  onChange={setDisplayName}
                />
              </div>
              <div className="tw:flex tw:flex-col tw:gap-1.5">
                <Typography size="text-sm" weight="medium">
                  {t('label.description')}
                </Typography>
                <TextArea
                  aria-label={t('label.description')}
                  data-testid="report-project-description-input"
                  isDisabled={isSaving}
                  rows={3}
                  value={description}
                  onChange={setDescription}
                />
              </div>
              <div className="tw:flex tw:flex-col tw:gap-1.5">
                <Typography size="text-sm" weight="medium">
                  {t('label.query')}
                </Typography>
                <TextArea
                  aria-label={t('label.query')}
                  data-testid="query-text-input"
                  isDisabled={isSaving}
                  rows={6}
                  value={query}
                  onChange={setQuery}
                />
              </div>
            </div>
          </Dialog.Content>
          <Dialog.Footer>
            <div className="tw:col-span-2 tw:flex tw:justify-end tw:gap-3">
              <Button
                color="tertiary"
                isDisabled={isSaving}
                size="sm"
                onPress={onCancel}>
                {t('label.cancel')}
              </Button>
              <Button
                color="primary"
                isDisabled={isSubmitDisabled}
                isLoading={isSaving}
                size="sm"
                onPress={() =>
                  onSubmit({
                    displayName: displayName.trim(),
                    description: description.trim(),
                    query: { query },
                  })
                }>
                {t('label.save')}
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default ReportProjectQueryModal;
