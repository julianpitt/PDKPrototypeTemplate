import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { DDBBaseItem, DynamoDBKeys } from '../types';
import { getAllQuery } from '../utils';

export type ListBase = {
  id: string;
  title: string;
  tasks: number;
  createdById: string;
  createdByName: string;
};

export const listEntityKey = 'LIST';

export type List = DDBBaseItem<typeof listEntityKey> & ListBase;

function getKeys(listId: string, createdAt?: string): DynamoDBKeys {
  return {
    PK: `${listEntityKey}#${listId}`,
    SK: `${listEntityKey}#${listId}`,
    GSI1PK: `ENTITY#${listEntityKey}`,
    GSI1SK: createdAt,
  };
}

export async function addList(
  client: DynamoDBDocumentClient,
  tableName: string,
  attributes: Omit<List, keyof DDBBaseItem<typeof listEntityKey> | 'id' | 'tasks'>,
) {
  const now = new Date().toISOString();
  const id = uuidv4();

  const input: List = {
    ...getKeys(id, now),
    id,
    createdAt: now,
    updatedAt: now,
    entity: listEntityKey,
    tasks: 0,
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

export async function getAllLists(client: DynamoDBDocumentClient, tableName: string) {
  const keys = getKeys('');

  const queryInput = {
    TableName: tableName,
    IndexName: 'GSI1',
    KeyConditionExpression: '#GSI1PK = :GSI1PK',
    ExpressionAttributeNames: {
      '#GSI1PK': 'GSI1PK',
    },
    ExpressionAttributeValues: {
      ':GSI1PK': keys.GSI1PK,
    },
    ScanIndexForward: true,
  };

  return getAllQuery<List>(client, queryInput);
}
