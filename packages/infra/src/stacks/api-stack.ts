import { UserIdentity } from '@aws/pdk/identity';
import { Authorizers, Integrations } from '@aws/pdk/type-safe-api';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { AccountPrincipal, AnyPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  AddListFunction,
  AddTaskFunction,
  Api,
  GetAllListsFunction,
  GetAllTasksFunction,
} from 'TestApi-typescript-infra';

interface ApiStackProps extends StackProps {
  identity: UserIdentity;
  database: ITable;
}

export class ApiStack extends Stack {
  api: Api;
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const getAllListsFn = new GetAllListsFunction(this, 'getAllListsFn', {
      environment: {
        TABLE_NAME: props.database.tableName,
      },
    });
    props.database.grantReadData(getAllListsFn);

    const addListFn = new AddListFunction(this, 'addListFn', {
      environment: {
        TABLE_NAME: props.database.tableName,
      },
    });
    props.database.grantWriteData(addListFn);

    const getAllTasksFn = new GetAllTasksFunction(this, 'getAllTasksFn', {
      environment: {
        TABLE_NAME: props.database.tableName,
      },
    });
    props.database.grantReadData(getAllListsFn);

    const addTaskFn = new AddTaskFunction(this, 'addTaskFn', {
      environment: {
        TABLE_NAME: props.database.tableName,
      },
    });
    props.database.grantWriteData(addTaskFn);

    const api = new Api(this, id, {
      defaultAuthorizer: Authorizers.iam(),
      corsOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      integrations: {
        getAllLists: { integration: Integrations.lambda(getAllListsFn) },
        addTask: { integration: Integrations.lambda(addTaskFn) },
        addList: { integration: Integrations.lambda(addListFn) },
        getAllTasks: { integration: Integrations.lambda(getAllTasksFn) },
      },
      policy: new PolicyDocument({
        statements: [
          // Here we grant any AWS credentials from the account that the prototype is deployed in to call the api.
          // Machine to machine fine-grained access can be defined here using more specific principals (eg roles or
          // users) and resources (ie which api paths may be invoked by which principal) if required.
          // If doing so, the cognito identity pool authenticated role must still be granted access for cognito users to
          // still be granted access to the API.
          new PolicyStatement({
            effect: Effect.ALLOW,
            principals: [new AccountPrincipal(Stack.of(this).account)],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*'],
          }),
          // Open up OPTIONS to allow browsers to make unauthenticated preflight requests
          new PolicyStatement({
            effect: Effect.ALLOW,
            principals: [new AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*/OPTIONS/*'],
          }),
        ],
      }),
    });

    // Grant authenticated users access to invoke the api
    props?.identity.identityPool.authenticatedRole.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['execute-api:Invoke'],
        resources: [api.api.arnForExecuteApi('*', '/*', '*')],
      }),
    );

    this.api = api;
  }
}
