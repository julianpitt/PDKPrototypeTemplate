import { TableProps } from '@cloudscape-design/components';

export const renderAriaLive: TableProps['renderAriaLive'] = ({ firstIndex, lastIndex, totalItemsCount }) =>
  `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`;

export const getHeaderCounterText = (
  items: ReadonlyArray<unknown>,
  selectedItems: ReadonlyArray<unknown> | undefined,
) => {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items.length})` : `(${items.length})`;
};

export const getHeaderCounterServerSideText = (totalCount: number, selectedCount: number | undefined) => {
  return selectedCount && selectedCount > 0 ? `(${selectedCount}/${totalCount}+)` : `(${totalCount}+)`;
};

export const getTextFilterCounterServerSideText = (items = [], pagesCount: number, pageSize: number) => {
  const count = pagesCount > 1 ? `${pageSize * (pagesCount - 1)}+` : items.length + '';
  return count === '1' ? `1 match` : `${count} matches`;
};

export const getTextFilterCounterText = (count: number) => `${count} ${count === 1 ? 'match' : 'matches'}`;
