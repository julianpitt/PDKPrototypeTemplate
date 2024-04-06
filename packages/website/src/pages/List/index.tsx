import { useCollection } from '@cloudscape-design/collection-hooks';
import { Button, Header, Table, TextContent } from '@cloudscape-design/components';
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllLists } from 'TestApi-typescript-react-query-hooks';
import { COLUMN_DEFINITIONS, DEFAULT_PREFERENCES, listTableAriaLabels } from './index.table.definitions';
import TableEmpty from '../../components/Table/Empty';
import { renderAriaLive } from '../../components/Table/i18n-strings';

import NoMatchingRecords from '../../components/Table/NoMatchingRecords';
import { AppLayoutContext } from '../../layouts/App';

const Home: React.FC = () => {
  const { data, isLoading } = useGetAllLists();

  const listItems = data?.lists || [];

  const entries = useMemo(
    () => data?.lists.map((l) => ({ listId: l.id, createdAt: l.createdAt, title: l.title })) ?? [],
    [listItems],
  );

  const { setAppLayoutProps } = useContext(AppLayoutContext);
  const navigate = useNavigate();

  setAppLayoutProps({
    contentType: 'table',
  });

  const { items, actions, collectionProps } = useCollection(entries, {
    filtering: {
      empty: (
        <TableEmpty title="No Lists" description="No list's were found">
          <Button onClick={() => navigate('/create')}>Create List</Button>
        </TableEmpty>
      ),
      noMatch: <NoMatchingRecords onClearFilter={() => actions.setFiltering('')} />,
    },
    sorting: { defaultState: { sortingColumn: COLUMN_DEFINITIONS[0] } },
    selection: {},
  });

  return (
    <Table
      {...collectionProps}
      columnDefinitions={COLUMN_DEFINITIONS}
      columnDisplay={DEFAULT_PREFERENCES.columnDisplay}
      items={items}
      selectionType="single"
      ariaLabels={listTableAriaLabels}
      renderAriaLive={renderAriaLive}
      variant="full-page"
      stickyHeader={true}
      wrapLines={DEFAULT_PREFERENCES.wrapLines}
      stripedRows={DEFAULT_PREFERENCES.stripedRows}
      contentDensity={DEFAULT_PREFERENCES.contentDensity}
      loading={isLoading}
      stickyColumns={DEFAULT_PREFERENCES.stickyColumns}
      header={
        <Header
          actions={
            <Button data-testid="header-btn-create" variant="primary" onClick={() => navigate('/create')}>
              Create List
            </Button>
          }>
          <TextContent>
            <h1>Lists</h1>
          </TextContent>
        </Header>
      }
    />
  );
};

export default Home;
