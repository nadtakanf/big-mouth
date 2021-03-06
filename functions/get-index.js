"use strict";

const fs = require("fs");
let html;
const Mustache = require("mustache");
const days = ["Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"];
const fetch = require("node-fetch");
const aws4 = require("../lib/aws4");
const URL = require("url");

const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;
const restaurantApiRoot = process.env.restaurant_api;
const ordersApiRoot = process.env.orders_api;

async function loadHtml() {
  if (!html) {
    html = fs.readFileSync("static/index.html", "utf-8");
  }

  return html;
}

async function getRestaurants() {
  const url = URL.parse(restaurantApiRoot);

  const opts = {
    host: url.hostname,
    path: url.pathname
  };

  // if(!process.env.AWS_ACCESS_KEY_ID) {
  // const { credentials } = await promisify(awscred.load)()

  // process.env.AWS_ACCESS_KEY_ID     = credentials.accessKeyId
  // process.env.AWS_SECRET_ACCESS_KEY = credentials.secretAccessKey

  // if(credentials.sessionToken){
  // 	process.env.AWS_SESSION_TOKEN = credentials.sessionToken
  // }
  // }

  aws4.sign(opts);

  try {
    const headers = {
      "Host": opts.headers["Host"],
      "X-Amz-Date": opts.headers["X-Amz-Date"],
      "Authorization": opts.headers["Authorization"]
    };

    if (opts.headers["X-Amz-Security-Token"]) {
      headers["X-Amz-Security-Token"] = opts.headers["X-Amz-Security-Token"];
    }

    const response = await fetch(
        restaurantApiRoot,
        {method: "GET", headers: headers});

    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error=>", error);
  }
}

module.exports.handler = async () => {
  await aws4.init();

  const template = await loadHtml();
  const restaurants = await getRestaurants();
  const dayOfWeek = days[new Date().getDay()];
  const view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantApiRoot}/search`,
    placeOrderUrl: `${ordersApiRoot}`
  };

  const html = Mustache.render(template, view);

  const response = {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=UTF-8"
    },
    body: html
  };

  return response;
};
