#!/bin/bash

# set bash to stop if error happen
set -e

file_path="../cognito-temp.yml"
profile="nadtakan"
service="big-mouth-cognito"
stage=$1
region="us-west-2"

sls deploy --stage $stage --profile nadtakan

# check if file exists
if [ -f $file_path ]
then
    echo "File exists"
    rm $file_path
fi

# Grab export (good for handling multiple stacks)
COGNITO_USER_POOL_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_CLIENT_WEB_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolClientWebId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_CLIENT_SERVER_ID=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:UserPoolClientServerId\`].Value" --no-paginate --output text --region $region --profile $profile)
COGNITO_REGION=$(aws cloudformation list-exports --query "Exports[?Name==\`$service:$stage:CognitoRegion\`].Value" --no-paginate --output text --region $region --profile $profile)

# Create the temp file
cat > $file_path <<EOL
COGNITO_USER_POOL_ID: ${COGNITO_USER_POOL_ID}
COGNITO_CLIENT_WEB_ID: ${COGNITO_CLIENT_WEB_ID}
COGNITO_CLIENT_SERVER_ID: ${COGNITO_CLIENT_SERVER_ID}
COGNITO_REGION: ${COGNITO_REGION}
EOL