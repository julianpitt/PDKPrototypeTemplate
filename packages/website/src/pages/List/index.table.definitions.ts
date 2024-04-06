import { ColumnDefinition } from '@aws-northstar/ui';
import { TableProps } from '@cloudscape-design/components';

export function createTableSortLabelFn(
  column: TableProps.ColumnDefinition<unknown>,
): TableProps.ColumnDefinition<unknown>['ariaLabel'] {
  if (!column.sortingField && !column.sortingComparator && !column.ariaLabel) {
    return;
  }
  return ({ sorted, descending }) => {
    return `${column.header}, ${sorted ? `sorted ${descending ? 'descending' : 'ascending'}` : 'not sorted'}.`;
  };
}

export const baseTableAriaLabels: TableProps.AriaLabels<unknown> = {
  allItemsSelectionLabel: () => 'select all',
};

export interface ListInstance {
  listId: string;
  title: string;
  createdAt: string;
}

export const listTableAriaLabels: TableProps.AriaLabels<ListInstance> = {
  ...baseTableAriaLabels,
  itemSelectionLabel: (_, row) => `select ${row.listId}`,
  selectionGroupLabel: 'List selection',
};

const rawColumns: ColumnDefinition<ListInstance>[] = [
  {
    id: 'listId',
    sortingField: 'listId',
    header: 'List Id',
    cell: (item) => item.listId,
    minWidth: 120,
  },
  {
    id: 'title',
    sortingField: 'title',
    header: 'Title',
    cell: (item) => item.title,
  },
  {
    id: 'createdAt',
    sortingField: 'createdAt',
    header: 'Created at',
    cell: (item) => item.createdAt,
    minWidth: 100,
  },
];

export const COLUMN_DEFINITIONS = rawColumns.map((column) => ({
  ...column,
  //ariaLabel: createTableSortLabelFn(column),
}));

//const CONTENT_DISPLAY_OPTIONS = rawColumns.map((column) => ({ id: column.id, label: column.header }));

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Lists' },
  { value: 30, label: '30 Lists' },
  { value: 50, label: '50 Lists' },
];

export const DEFAULT_PREFERENCES: Omit<TableProps<any> & { pageSize: number }, 'items' | 'columnDefinitions'> = {
  pageSize: 30,
  //columnDisplay: CONTENT_DISPLAY_OPTIONS.map((column) => ({ id: column.id, visible: true })),
  wrapLines: false,
  stripedRows: false,
  contentDensity: 'comfortable',
  stickyColumns: { first: 0, last: 1 },
};
