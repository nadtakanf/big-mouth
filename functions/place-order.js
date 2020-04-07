'use strict'

const AWS = require('aws-sdk')
const kinesis = new AWS.Kinesis()
const streamName = process.env.order_events_stream
const chance = require('chance').Chance()

module.exports.handler = async(event, context) => {
	console.log(`event => ${JSON.stringify(event)}`)
	let restaurantName = JSON.parse(event.body).restaurantName

	let userEmail = event.requestContext.authorizer.claims.email
	let orderId = chance.guid()
	console.log(`placing order ID [${orderId}] to [${restaurantName}] from user [${userEmail}]`)

	let data = {
		orderId,
		userEmail,
		restaurantName,
		eventType: 'order_placed'
	}

	let putReq = {
		Data: JSON.stringify(data),
		PartitionKey: orderId,
		StreamName: streamName
	}

	await kinesis.putRecord(putReq).promise()
	console.log(`published 'order_placed' event to Kinesis`)

	let response = {
		statusCode: 200,
		body: JSON.stringify({ orderId })
	}

	return response
}
