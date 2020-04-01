# big-mouth

Node module including:
1. serverless framework
2. cheerio
3. lodash
4. chai
5. chance

Install

Import data to Dynamodb
```node node functions/seed-restaurants.js```

fixed issue with "The security token included in the request is invalid." 
run ```export AWS_PROFILE="aws_profile"```

Debugging

Local testing(SAM)
1. install https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html (don't forget to use node 12)
2. install https://github.com/sapessi/serverless-sam 
3. run ```sls sam export -o template.yml --stage dev``` to convert serverless.yml to SAM cloudformation format

SAM invoke
invoke GetIndex api
run ```sam local invoke GetIndex <<< "{}"```

invoke SearchRestaurants api
run ```sam local invoke SearchRestaurants --event examples/search-restaurants.json```

Start SAM local server
run ```sam local start-api```


