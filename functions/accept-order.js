"use strict"

const AWS = require("aws-sdk")
const kinesis = new AWS.Kinesis()
const streamName = process.env.order_events_stream

module.exports.handler = async(event) => {
	let body = JSON.parse(event.body)
	let restaurantName = body.restaurantName
	let orderId = body.orderId
	let userEmail = body.userEmail

	console.log(`restaurant [${restaurantName}] accepted order ID [${orderId}] from user [${userEmail}]`)

	try {
		let data = {
			orderId,
			userEmail,
			restaurantName,
			eventType: "order_accepted"
		}
	
		let kinesisReq = {
			Data: JSON.stringify(data), // the SDK would base64 encode this for us
			PartitionKey: orderId,
			StreamName: streamName
		}

		await kinesis.putRecord(kinesisReq).promise()
		console.log("published 'order_placed' event to Kinesis");
	
		let response = {
			statusCode: 200,
			body: JSON.stringify({ orderId })
		}
	
		return response
	} catch (e) {
		console.log(e)
	}
	
}