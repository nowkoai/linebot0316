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

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      callback(error);
    }
    callback(error, data.Item);
  });
};
