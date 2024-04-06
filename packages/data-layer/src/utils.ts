import { DynamoDBDocumentClient, QueryCommandInput, paginateQuery } from '@aws-sdk/lib-dynamodb';

export async function getAllQuery<T>(client: DynamoDBDocumentClient, queryInput: QueryCommandInput): Promise<T[]> {
  const paginator = paginateQuery(
    {
      client,
      pageSize: 25,
    },
    queryInput,
  );

  const items: T[] = [];

  for await (const page of paginator) {
    items.push(...((page.Items ?? []) as T[]));
  }

  return items;
}
