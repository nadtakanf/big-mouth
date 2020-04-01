'use strict';

const fs = require("fs")
var html
const Mustache = require("mustache")
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const fetch = require("node-fetch")
const aws4 = require("aws4")
const URL = require("url")
const awsRegion = process.env.AWS_REGION
const cognitoUserPoolId = process.env.cognito_user_pool_id
const cognitoClientId = process.env.cognito_client_id
const restaurantApiRoot = process.env.restaurant_api

async function loadHtml() {
  if(!html) {
    html = fs.readFileSync('static/index.html', 'utf-8')
  } 

  return html
}

async function getRestaurants() {
  
  let url = URL.parse(restaurantApiRoot)

  var opts = {
    host: url.hostname, 
    path: url.pathname
  }

  aws4.sign(opts);

  try {
    let headers = {
      "Host" : opts.headers['Host'],
      "X-Amz-Date": opts.headers['X-Amz-Date'],
      "Authorization": opts.headers['Authorization'],
		}
		
		if(opts.headers['X-Amz-Security-Token']) {
			headers["X-Amz-Security-Token"] = opts.headers['X-Amz-Security-Token']
		}

    const response = await fetch(restaurantApiRoot, { method: 'GET', headers: headers })
    const json = await response.json()
    return json
  } catch (error) {
    console.log(`error=>`, error)
  }
}

module.exports.handler = async event => {
  let template = await loadHtml()
	let restaurants = await getRestaurants()
  let dayOfWeek = days[new Date().getDay()]
  let view = {
    dayOfWeek, 
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantApiRoot}/search`
  }

  let html = Mustache.render(template, view);

  const response = {
		statusCode: 200,
		headers: {
      'content-type': 'text/html; charset=UTF-8'
    },
    body: html
	}
	
	return response
};