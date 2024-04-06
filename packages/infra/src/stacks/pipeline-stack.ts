import { PDKPipeline } from '@aws/pdk/pipeline';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface PipelineStackProps extends StackProps {}

export class PipelineStack extends Stack {
  pipeline: PDKPipeline;
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const pipelineStack = new PDKPipeline(this, 'ApplicationPipeline', {
      primarySynthDirectory: 'packages/infra/cdk.out',
      repositoryName: 'testProject',
      branchNamePrefixes: PDKPipeline.ALL_BRANCHES,
    });
    this.pipeline = pipelineStack;
  }
}
