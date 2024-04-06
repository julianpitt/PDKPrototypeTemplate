import { StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DataStack } from './data-stack';
import { ApiStack } from '../stacks/api-stack';
import { IdentityStack } from '../stacks/auth-stack';
import { WebsiteStack } from '../stacks/website-stack';

interface AppStageProps extends StackProps {}

export class AppStage extends Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    const { database } = new DataStack(this, 'data-dev', {
      env: props.env,
    });

    const { identity } = new IdentityStack(this, 'identity-dev', {
      env: props.env,
    });
    const { api } = new ApiStack(this, 'api-dev', {
      env: props.env,
      database,
      identity,
    });
    new WebsiteStack(this, 'infra-dev', {
      env: props.env,
      identity,
      typeSafeApi: api,
    });
  }
}
