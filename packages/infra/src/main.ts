import { CdkGraph, FilterPreset, Filters } from "@aws/pdk/cdk-graph";
import { CdkGraphDiagramPlugin } from "@aws/pdk/cdk-graph-plugin-diagram";
import { CdkGraphThreatComposerPlugin } from "@aws/pdk/cdk-graph-plugin-threat-composer";
import { AwsPrototypingChecks, PDKNag } from "@aws/pdk/pdk-nag";
import { PDKPipeline } from "@aws/pdk/pipeline";
import { AppStage } from "./stacks/app-stage";
import { PipelineStack } from "./stacks/pipeline-stack";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

/* eslint-disable @typescript-eslint/no-floating-promises */
(async () => {
  const app = PDKNag.app({
    nagPacks: [new AwsPrototypingChecks()],
  });

  const branchPrefix = PDKPipeline.getBranchPrefix({ node: app.node });

  const pipelineStack = new PipelineStack(app, "Pipeline", { env: devEnv });

  const devStage = new AppStage(app, branchPrefix + "Dev", {
    env: devEnv,
  });

  new AppStage(app, branchPrefix + "Sandbox", {
    env: devEnv,
  });

  pipelineStack.pipeline.addStage(devStage);

  const graph = new CdkGraph(app, {
    plugins: [
      new CdkGraphDiagramPlugin({
        defaults: {
          filterPlan: {
            preset: FilterPreset.COMPACT,
            filters: [{ store: Filters.pruneCustomResources() }],
          },
        },
      }),
      new CdkGraphThreatComposerPlugin(),
    ],
  });

  app.synth();
  await graph.report();
})();
