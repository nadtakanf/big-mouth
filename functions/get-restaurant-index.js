"use strict";

const fs = require("fs");
let html;
const Mustache = require("mustache");
const days = ["Sunday", "Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday",
  "Saturday"];
const aws4 = require("../lib/aws4");

const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.cognito_restaurant_user_pool_id;
const cognitoClientId = process.env.cognito_restaurant_client_id;

async function loadHtml() {
  if (!html) {
    html = fs.readFileSync("restaurant-static/index.html", "utf-8");
  }

  return html;
}

module.exports.handler = async () => {
  await aws4.init();

  const template = await loadHtml();
  const dayOfWeek = days[new Date().getDay()];
  const view = {
    dayOfWeek,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId
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
