import { UserIdentity } from "@aws/pdk/identity";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class IdentityStack extends Stack {
  identity: UserIdentity;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userIdentity = new UserIdentity(this, `${id}UserIdentity`);
    this.identity = userIdentity;
  }
}
