# PDK Starter project

Requirements: [https://aws.github.io/aws-pdk/getting_started/index.html](https://aws.github.io/aws-pdk/getting_started/index.html)

## Getting started

### Install and deploy the backend

First ensure you have AWS credentials exported in your cli or an AWS_PROFILE and AWS_REGION set, then run the following to install and deploy the infrastructure (will take ~30 mins)

```
pnpm install
pnpm projen
pnpm deploy:sandbox
```

### Run frontend locally

Once your application has been deployed, you will now able to run the frontend locally

#### Retrieve your runtime config

```bash
cloudfrontDistributionURL=$(aws cloudformation describe-stacks --stack-name Sandbox-infra-dev --query "Stacks[0].Outputs[?contains(OutputKey, 'WebsiteDistributionDomainName')].OutputValue | [0]" --output text)
if [[ $cloudfrontDistributionURL == *".cloudfront.net"* ]];
then
  curl "https://$cloudfrontDistributionURL/runtime-config.json" > ./packages/website/public/runtime-config.json
else
  echo "Cloudfront distribution not found";
fi
```

#### Run the frontend locally

```bash
pnpm serve
```

### Create a new user

```bash
aws cognito-idp admin-create-user --user-pool-id {your user pool id here} --user-attributes  Name=email,Value={your email address here} Name=email_verified,Value=true --username $(uuidgen) --temporary-password {your temporary password here}
```
