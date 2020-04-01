'use strict'

const awscred = require('awscred')
const { promisify } = require('util')

let initialized = false

let init = async () => {
    if(initialized) {
        return 
    }

		process.env.TEST_ROOT = 'https://t7gknhfvg3.execute-api.us-west-2.amazonaws.com/dev'
    process.env.restaurant_api = 'https://t7gknhfvg3.execute-api.us-west-2.amazonaws.com/dev/restaurants'
    process.env.restaurants_table = 'restaurants'
    process.env.AWS_REGION = 'us-west-2'
    process.env.cognito_user_pool_id = 'us-west-2_lF1vo1LoJ'
    process.env.cognito_client_id = '1ie0lfiaalq5kldk2e3ulvkp6n'
		process.env.cognito_server_client_id = '7lce9m54umg21js99pcclpvmed'

		// loading aws crediential for integration testing
		// remove {profile: 'nadtakan'} if you are using default profile
		const { credentials } = await promisify(awscred.load)({ 'profile': 'nadtakan' })

    process.env.AWS_ACCESS_KEY_ID     = credentials.accessKeyId
  	process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey

		console.log("AWS credential loaded")
		
    initialized = true
}

module.exports = {
	init
}