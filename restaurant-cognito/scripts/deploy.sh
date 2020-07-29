#!/bin/bash

# set bash to stop if error happen
set -e

profile="nadtakan"
service="big-mouth-cognito-restaurant-user"
stage=$1
region="us-west-2"

sls deploy --stage $stage --profile nadtakan

# Grab export (good for handling multiple stacks)
COGNITO_USER_POOL_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_CLIENT_WEB_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolClientWebId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_CLIENT_SERVER_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolClientServerId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_REGION=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:CognitoRegion\`].Value" --no-paginate --output text --region $region --profile $profile)

# create ssm keys cognito and web id
aws ssm --profile nadtakan put-parameter \
    --name "$service-$region-user-pool-id" \
    --type "String" \
    --value "${COGNITO_USER_POOL_ID}" \
    --overwrite 
	
# aws ssm get-parameter --name big-mouth-cognito-restaurant-user-dev-user-pool-id