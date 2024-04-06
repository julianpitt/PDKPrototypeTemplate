import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as dataLayer from '@prototype-demo/data-layer';
import { omit } from '../utils';

export async function getAllTasksForList(dynamodbClient: DynamoDBDocumentClient, tableName: string, listId: string) {
  const result = await dataLayer.getAllTasksForList(dynamodbClient, tableName, listId);

  return result.map((r) => omit(r, ['PK', 'SK', 'entity']));
}

export type AddTaskInput = Pick<dataLayer.Task, 'title' | 'createdById' | 'listId' | 'description' | 'createdByName'>;

export async function addTask(dynamodbClient: DynamoDBDocumentClient, tableName: string, input: AddTaskInput) {
  const result = await dataLayer.addTask(dynamodbClient, tableName, {
    createdById: input.createdById,
    createdByName: input.createdByName,
    title: input.title,
    listId: input.listId,
    description: input.description,
  });

  return result;
}
