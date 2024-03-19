import { UserIdentity } from "@aws/pdk/identity";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { TestApi } from "../constructs/apis/testapi";
import { Website } from "../constructs/websites/website";

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userIdentity = new UserIdentity(this, `${id}UserIdentity`);
    const testapi = new TestApi(this, "TestApi", {
      userIdentity,
    });
    new Website(this, "Website", { userIdentity, testapi });
  }
}
