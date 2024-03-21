import path from "path";
import { UserIdentity } from "@aws/pdk/identity";
import { StaticWebsite } from "@aws/pdk/static-website";
import { Stack, StackProps } from "aws-cdk-lib";
import { GeoRestriction } from "aws-cdk-lib/aws-cloudfront";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { Api } from "TestApi-typescript-infra";

interface WebsiteStackProps extends StackProps {
  identity: UserIdentity;
  typeSafeApi: Api;
}

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props: WebsiteStackProps) {
    super(scope, id, props);

    const crossStackReference = (referenceId: string, value: string) =>
      new StringParameter(this, referenceId, {
        stringValue: value,
      }).stringValue;

    new StaticWebsite(this, "Website", {
      websiteContentPath: path.resolve(__dirname, "../../../website/build"),
      runtimeOptions: {
        jsonPayload: {
          apiUrl: crossStackReference("ApiUrl", props.typeSafeApi.api.urlForPath()),
          region: Stack.of(this).region,
          identityPoolId: crossStackReference("IdentityPoolId", props.identity.identityPool.identityPoolId),
          userPoolId: crossStackReference("UserPoolId", props.identity.userPool.userPoolId),
          userPoolWebClientId: crossStackReference("UserPoolClientId", props.identity.userPoolClient.userPoolClientId),
        },
      },
      distributionProps: {
        geoRestriction: GeoRestriction.allowlist("AU"),
      },
    });
  }
}
