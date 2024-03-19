import { UserIdentity } from "@aws/pdk/identity";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { TestApi } from "../constructs/apis/testapi";

interface ApiStackProps extends StackProps {
  identity: UserIdentity;
}

export class ApiStack extends Stack {
  api: TestApi;
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const testapi = new TestApi(this, "TestApi", {
      userIdentity: props.identity,
    });

    this.api = testapi;
  }
}
