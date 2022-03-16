'use strict';

// AWS系
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDBテーブル名
const tname = "todos"


module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  data.id = event.pathParameters.id;

  const params = {
    TableName: tname,
    Item: data
  };

  return dynamoDb.put(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });
};
