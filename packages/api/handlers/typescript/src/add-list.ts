import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as businessLogic from '@prototype-demo/business-logic';
import {
  addListHandler,
  AddListChainedHandlerFunction,
  INTERCEPTORS,
  Response,
  LoggingInterceptor,
} from 'TestApi-typescript-runtime';

const dynamoDBClient = new DynamoDBClient();
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

/**
 * Type-safe handler for the AddList operation
 */
export const addList: AddListChainedHandlerFunction = async (request) => {
  LoggingInterceptor.getLogger(request).info('Start AddList Operation');

  const TABLE_NAME = process.env.TABLE_NAME;
  if (!TABLE_NAME) {
    throw new Error('TABLE_NAME env is not set');
  }

  const { input } = request;
  const { title } = input.body;

  // const list = businessLogic.addList(dynamoDBDocClient, TABLE_NAME, { title });

  return Response.internalFailure({
    message: 'Not Implemented!',
  });
};

/**
 * Entry point for the AWS Lambda handler for the AddList operation.
 * The addListHandler method wraps the type-safe handler and manages marshalling inputs and outputs
 */
export const handler = addListHandler(...INTERCEPTORS, addList);
