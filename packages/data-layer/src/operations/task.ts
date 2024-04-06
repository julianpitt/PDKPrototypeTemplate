import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { listEntityKey } from './list';
import { DDBBaseItem, DynamoDBKeys } from '../types';
import { getAllQuery } from '../utils';

export type TaskBase = {
  id: string;
  title: string;
  description?: string;
  createdById: string;
  createdByName: string;
  listId: string;
};

export const taskEntityKey = 'TASK';

export type Task = DDBBaseItem<typeof taskEntityKey> & TaskBase;

function getKeys(listId: string, taskId: string): DynamoDBKeys {
  return {
    PK: `${listEntityKey}#${listId}`,
    SK: `${taskEntityKey}#${taskId}`,
  };
}

export async function addTask(
  client: DynamoDBDocumentClient,
  tableName: string,
  attributes: Omit<Task, keyof DDBBaseItem<Task['entity']> | 'id'>,
) {
  const now = new Date().toISOString();
  const id = uuidv4();

  const input: Task = {
    ...getKeys(attributes.listId, id),
    id,
    createdAt: now,
    updatedAt: now,
    entity: taskEntityKey,
    ...attributes,
  };

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: input,
    }),
  );

  return input;
}

export async function getAllTasksForList(client: DynamoDBDocumentClient, tableName: string, listId: string) {
  const keys = getKeys(listId, '');

  const queryInput = {
    TableName: tableName,
    KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    },
    ExpressionAttributeValues: {
      ':PK': keys.PK,
      ':SK': keys.SK,
    },
    ScanIndexForward: true,
  };

  return getAllQuery<Task>(client, queryInput);
}

export async function deleteTask(client: DynamoDBDocumentClient, tableName: string, listId: string, taskId: string) {
  const keys = getKeys(listId, taskId);
  const response = await client.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        PK: keys.PK,
        SK: keys.SK,
      },
    }),
  );

  return response;
}
