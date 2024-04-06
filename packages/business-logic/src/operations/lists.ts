import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as dataLayer from '@prototype-demo/data-layer';
import { omit } from '../utils';

export async function getAllLists(dynamodbClient: DynamoDBDocumentClient, tableName: string) {
  const result = await dataLayer.getAllLists(dynamodbClient, tableName);

  return result.map((r) => omit(r, ['PK', 'SK', 'entity']));
}

export type AddListInput = Pick<dataLayer.List, 'title' | 'createdById' | 'createdByName'>;

export async function addList(dynamodbClient: DynamoDBDocumentClient, tableName: string, input: AddListInput) {
  const result = await dataLayer.addList(dynamodbClient, tableName, {
    title: input.title,
    createdById: input.createdById,
    createdByName: input.createdByName,
  });

  return result;
}
