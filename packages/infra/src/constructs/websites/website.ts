import { UserIdentity } from "@aws/pdk/identity";
import { StaticWebsite } from "@aws/pdk/static-website";
import { Stack } from "aws-cdk-lib";
import { GeoRestriction } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";
import { TestApi } from "../apis/testapi";

/**
 * Website construct props
 */
export interface WebsiteProps {
  /**
   * Instance of an API to configure the website to integrate with
   */
  readonly testapi: TestApi;

  /**
   * Instance of the UserIdentity.
   */
  readonly userIdentity: UserIdentity;
}

/**
 * Construct to deploy a Static Website
 */
export class Website extends Construct {
  constructor(scope: Construct, id: string, props?: WebsiteProps) {
    super(scope, id);

    new StaticWebsite(this, id, {
      websiteContentPath: "../website/build",
      runtimeOptions: {
        jsonPayload: {
          region: Stack.of(this).region,
          identityPoolId: props?.userIdentity.identityPool.identityPoolId,
          userPoolId: props?.userIdentity.userPool?.userPoolId,
          userPoolWebClientId:
            props?.userIdentity.userPoolClient?.userPoolClientId,
          typeSafeApis: { TestApi: props?.testapi.api.api.urlForPath() },
        },
      },
      distributionProps: {
        geoRestriction: GeoRestriction.allowlist(
          "AU",
          "ID",
          "IN",
          "JP",
          "KR",
          "SG",
          "US",
        ),
      },
    });
  }
}
