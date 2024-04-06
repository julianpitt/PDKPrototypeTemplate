import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as businessLogic from '@prototype-demo/business-logic';
import {
  getAllTasksHandler,
  GetAllTasksChainedHandlerFunction,
  INTERCEPTORS,
  Response,
  LoggingInterceptor,
} from 'TestApi-typescript-runtime';

const dynamoDBClient = new DynamoDBClient();
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

/**
 * Type-safe handler for the GetAllTasks operation
 */
export const getAllTasks: GetAllTasksChainedHandlerFunction = async (request) => {
  LoggingInterceptor.getLogger(request).info('Start GetAllTasks Operation');

  const TABLE_NAME = process.env.TABLE_NAME;
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME env is not set');
  }

  const tasks = await businessLogic.getAllTasksForList(
    dynamoDBDocClient,
    TABLE_NAME,
    request.input.requestParameters.listId,
  );

  return Response.success({
    tasks,
  });
};

/**
 * Entry point for the AWS Lambda handler for the GetAllTasks operation.
 * The getAllTasksHandler method wraps the type-safe handler and manages marshalling inputs and outputs
 */
export const handler = getAllTasksHandler(...INTERCEPTORS, getAllTasks);
