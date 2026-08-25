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
import { ReportQuery } from '../../generated/entity/data/reportProject-kb-cust';

interface ReportProjectQueryModalProps {
  open: boolean;
  initialValue: ReportQuery | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (value: ReportQuery) => void;
}

const ReportProjectQueryModal = ({
  open,
  initialValue,
  isSaving,
  onCancel,
  onSubmit,
}: ReportProjectQueryModalProps) => {
  const { t } = useTranslation();
  const [service, setService] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setService(initialValue?.service ?? '');
      setQuery(initialValue?.query ?? '');
    }
  }, [open, initialValue]);

  const isSubmitDisabled = !service.trim() || !query.trim();

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
            initialValue
              ? t('label.edit-entity', { entity: t('label.query') })
              : t('label.add-entity', { entity: t('label.query') })
          }
          width={520}
          onClose={onCancel}>
          <Dialog.Content>
            <div className="tw:flex tw:flex-col tw:gap-4">
              <div className="tw:flex tw:flex-col tw:gap-1.5">
                <Typography size="text-sm" weight="medium">
                  {t('label.service')}
                </Typography>
                <Input
                  aria-label={t('label.service')}
                  data-testid="query-service-input"
                  isDisabled={isSaving}
                  placeholder={t('label.service')}
                  value={service}
                  onChange={setService}
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
                onPress={() => onSubmit({ service: service.trim(), query })}>
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
