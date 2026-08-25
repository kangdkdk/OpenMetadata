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
import { CheckOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorPlaceHolder from '../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import { useGenericContext } from '../../components/Customization/GenericProvider/GenericProvider';
import { Table as TableType } from '../../generated/entity/data/table';

interface TableIndexRecord {
  indexName: string;
  indexType: string;
  isUnique: boolean;
  columnOrder: number;
  columnName: string;
  columnLength: number;
  sortOrder: string;
}

const TableIndexTab = () => {
  const { t } = useTranslation();
  const { data } = useGenericContext<TableType>();

  const records = useMemo<TableIndexRecord[]>(() => {
    const raw = data.extension?.tableIndexesKbCust;
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [data.extension]);

  const rowSpans = useMemo(() => {
    const spans: number[] = [];
    records.forEach((record, index) => {
      const isFirstOfGroup =
        index === 0 || record.indexName !== records[index - 1].indexName;

      if (!isFirstOfGroup) {
        spans.push(0);

        return;
      }

      let groupSize = 1;
      for (let i = index + 1; i < records.length; i++) {
        if (records[i].indexName === record.indexName) {
          groupSize++;
        } else {
          break;
        }
      }
      spans.push(groupSize);
    });

    return spans;
  }, [records]);

  const getGroupedCellProps = (rowIndex?: number) => ({
    rowSpan: rowSpans[rowIndex ?? 0],
  });

  const columns: ColumnsType<TableIndexRecord> = useMemo(
    () => [
      {
        title: t('label.index-name-kb-cust'),
        dataIndex: 'indexName',
        key: 'indexName',
        onCell: (_, index) => getGroupedCellProps(index),
      },
      {
        title: t('label.index-type-kb-cust'),
        dataIndex: 'indexType',
        key: 'indexType',
        onCell: (_, index) => getGroupedCellProps(index),
      },
      {
        title: t('label.index-unique-kb-cust'),
        dataIndex: 'isUnique',
        key: 'isUnique',
        onCell: (_, index) => getGroupedCellProps(index),
        render: (isUnique: boolean) => (isUnique ? <CheckOutlined /> : null),
      },
      {
        title: t('label.index-column-order-kb-cust'),
        dataIndex: 'columnOrder',
        key: 'columnOrder',
      },
      {
        title: t('label.column-name-header-kb-cust'),
        dataIndex: 'columnName',
        key: 'columnName',
      },
      {
        title: t('label.index-column-length-kb-cust'),
        dataIndex: 'columnLength',
        key: 'columnLength',
      },
      {
        title: t('label.index-sort-order-kb-cust'),
        dataIndex: 'sortOrder',
        key: 'sortOrder',
      },
    ],

    [t, rowSpans]
  );

  if (isEmpty(records)) {
    return <ErrorPlaceHolder />;
  }

  return (
    <Table
      className="p-md"
      columns={columns}
      data-testid="table-index-tab-kb-cust"
      dataSource={records}
      pagination={false}
      rowKey={(record, index) => `${record.indexName}-${index}`}
      size="small"
    />
  );
};

export default TableIndexTab;
