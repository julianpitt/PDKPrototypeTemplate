import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getAllLists as blGetAllLists } from '@prototype-demo/business-logic';
import {
  getAllListsHandler,
  GetAllListsChainedHandlerFunction,
  INTERCEPTORS,
  Response,
  LoggingInterceptor,
} from 'TestApi-typescript-runtime';

const dynamoDBClient = new DynamoDBClient();
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const getAllLists: GetAllListsChainedHandlerFunction = async (request) => {
  LoggingInterceptor.getLogger(request).info('Start GetAllLists Operation');

  const TABLE_NAME = process.env.TABLE_NAME;
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME env is not set');
  }

  const lists = await blGetAllLists(dynamoDBDocClient, TABLE_NAME);

  return Response.success({
    lists,
  });
};

/**
 * Entry point for the AWS Lambda handler for the GetAllLists operation.
 * The getAllListsHandler method wraps the type-safe handler and manages marshalling inputs and outputs
 */
export const handler = getAllListsHandler(...INTERCEPTORS, getAllLists);
