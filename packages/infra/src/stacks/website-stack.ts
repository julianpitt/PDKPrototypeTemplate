import { UserIdentity } from "@aws/pdk/identity";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { TestApi } from "../constructs/apis/testapi";
import { Website } from "../constructs/websites/website";

interface WebsiteStackProps extends StackProps {
  identity: UserIdentity;
  testapi: TestApi;
}

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);
    new Website(this, "Website", {
      userIdentity: props.identity,
      testapi: props.testapi,
    });
  }
}
