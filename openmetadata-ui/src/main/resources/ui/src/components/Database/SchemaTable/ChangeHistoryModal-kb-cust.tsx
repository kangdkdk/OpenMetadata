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
  Dialog,
  Modal,
  ModalOverlay,
  Table,
  Typography,
} from '@openmetadata/ui-core-components';
import { isEmpty } from 'lodash';
import { FC, useMemo, useState } from 'react';
import { SortDescriptor } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import ErrorPlaceHolder from '../../common/ErrorWithPlaceholder/ErrorPlaceHolder';

interface ChangeHistoryRecord {
  changeDate: string;
  changeType: string;
  changeTarget: string;
  targetColumn: string;
  changeDetail: string;
}

interface ChangeHistoryModalProps {
  open: boolean;
  changeHistoryJson?: string;
  onClose: () => void;
}

const ChangeHistoryModal: FC<ChangeHistoryModalProps> = ({
  open,
  changeHistoryJson,
  onClose,
}) => {
  const { t } = useTranslation();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'changeDate',
    direction: 'descending',
  });

  const records = useMemo<ChangeHistoryRecord[]>(() => {
    if (!changeHistoryJson) {
      return [];
    }
    try {
      const parsed = JSON.parse(changeHistoryJson);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [changeHistoryJson]);

  const sortedRecords = useMemo(() => {
    const sorted = [...records].sort((a, b) => {
      const columnKey = sortDescriptor.column as keyof ChangeHistoryRecord;
      const valueA = String(a[columnKey] ?? '');
      const valueB = String(b[columnKey] ?? '');
      const comparison = valueA.localeCompare(valueB);

      return sortDescriptor.direction === 'descending'
        ? -comparison
        : comparison;
    });

    return sorted;
  }, [records, sortDescriptor]);

  const columns = [
    { id: 'changeDate', label: t('label.change-date-kb-cust') },
    { id: 'changeType', label: t('label.change-type-kb-cust') },
    { id: 'changeTarget', label: t('label.change-target-kb-cust') },
    { id: 'targetColumn', label: t('label.target-column-kb-cust') },
    { id: 'changeDetail', label: t('label.change-detail-kb-cust') },
  ];

  return (
    <ModalOverlay
      isDismissable
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Modal>
        <Dialog
          showCloseButton
          data-testid="change-history-modal-kb-cust"
          title={t('label.table-change-history-kb-cust')}
          width={1100}
          onClose={onClose}>
          <Dialog.Content>
            {isEmpty(sortedRecords) ? (
              <ErrorPlaceHolder />
            ) : (
              <Table
                aria-label={t('label.table-change-history-kb-cust')}
                data-testid="change-history-table"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}>
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Head
                      allowsSorting
                      id={column.id}
                      key={column.id}
                      label={column.label}
                    />
                  )}
                </Table.Header>
                <Table.Body items={sortedRecords}>
                  {(record) => (
                    <Table.Row
                      id={`${record.changeDate}-${record.targetColumn}-${record.changeType}`}>
                      <Table.Cell>{record.changeDate}</Table.Cell>
                      <Table.Cell>{record.changeType}</Table.Cell>
                      <Table.Cell>{record.changeTarget}</Table.Cell>
                      <Table.Cell>{record.targetColumn}</Table.Cell>
                      <Table.Cell>
                        <Typography size="text-sm">
                          {record.changeDetail}
                        </Typography>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            )}
          </Dialog.Content>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default ChangeHistoryModal;
