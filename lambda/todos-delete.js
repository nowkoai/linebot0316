'use strict';

// SDK
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDBテーブル名
const tname = "todos"


module.exports = (event, callback) => {
  const params = {
    TableName: tname,
    Key: {
      id: event.pathParameters.id
    }
  };
  console.log("params");

  return dynamoDb.delete(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, params.Key);
  });
};
