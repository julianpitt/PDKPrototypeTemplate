import {
  addTaskHandler,
  AddTaskChainedHandlerFunction,
  INTERCEPTORS,
  Response,
  LoggingInterceptor,
} from 'TestApi-typescript-runtime';

/**
 * Type-safe handler for the AddTask operation
 */
export const addTask: AddTaskChainedHandlerFunction = async (request) => {
  LoggingInterceptor.getLogger(request).info('Start AddTask Operation');

  // TODO: Implement AddTask Operation. `input` contains the request input.
  const { input } = request;

  return Response.internalFailure({
    message: 'Not Implemented!',
  });
};

/**
 * Entry point for the AWS Lambda handler for the AddTask operation.
 * The addTaskHandler method wraps the type-safe handler and manages marshalling inputs and outputs
 */
export const handler = addTaskHandler(...INTERCEPTORS, addTask);