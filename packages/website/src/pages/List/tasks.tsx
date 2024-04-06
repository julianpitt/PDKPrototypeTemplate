import { Alert, Container, ContentLayout, Header, SpaceBetween, Spinner } from '@cloudscape-design/components';
import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAllLists, useGetAllTasks } from 'TestApi-typescript-react-query-hooks';

import { AppLayoutContext } from '../../layouts/App';

const List: React.FC = () => {
  let { listId } = useParams();

  const { data: listData, isLoading: isLoadingLists } = useGetAllLists();
  const { data, isLoading, isError, error } = useGetAllTasks({ listId: listId ?? '' }, { enabled: listId !== undefined });
  const listItems = listData?.lists || [];
  const taskItems = data?.tasks || [];

  if (!listId) {
    throw new Error('No list id passed in');
  }

  const list = listItems.find(l => l.id === listId);

  if (!list) {
    throw new Error("Invalid list");
  }

  const entries = useMemo(
    () => data?.tasks.map((t) => ({ taskId: t.id, createdAt: t.createdAt, title: t.title, description: t.description, createdBy: t.createdByName })) ?? [],
    [taskItems],
  );

  const { setAppLayoutProps } = useContext(AppLayoutContext);

  setAppLayoutProps({
    contentType: 'default',
  });

  if (isLoadingLists) {
    return <Spinner />
  }

  return (
    <ContentLayout header={<Header variant="h1">{list.title}</Header>}>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Tasks</Header>} variant="default">
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <Alert type="error">
              An error has occured: ({error?.response?.status}) {error?.message}
            </Alert>
          ) : (
            entries.map(e => e.title)
          )}
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default List;
