'use strict'

const awscred = require('../../lib/awscred')
const { promisify } = require('util')

let initialized = false

let init = async () => {
    if(initialized) {
        return 
    }

		process.env.TEST_ROOT = 'https://c9tauultd4.execute-api.us-west-2.amazonaws.com/dev/'
    process.env.restaurant_api = 'https://c9tauultd4.execute-api.us-west-2.amazonaws.com/dev/restaurants'
    process.env.restaurants_table = 'restaurants'
    process.env.AWS_REGION = 'us-west-2'
    process.env.cognito_user_pool_id = 'us-west-2_TaSvtUFkj'
    process.env.cognito_client_id = '6rrhsck4d1mk2l6l00rd9f4cqg'
		process.env.cognito_server_client_id = '1f44sgjjnihguirrkrh20mul3p'

		// loading aws crediential for integration testing
		// remove {profile: 'nadtakan'} if you are using default profile
		// const { credentials } = await promisify(awscred.load)({ 'profile': 'nadtakan' })
		const { credentials } = await promisify(awscred.load)()

    process.env.AWS_ACCESS_KEY_ID     = credentials.accessKeyId
		process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey
		
		if(credentials.sessionToken){
			process.env.AWS_SESSION_TOKEN = credentials.sessionToken
		}

		console.log("AWS credential loaded")
		
    initialized = true
}

module.exports = {
	init
}