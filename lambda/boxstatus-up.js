'use strict';

// AWS系
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDBテーブル名
const tname = "boxstatus"

const data = {
  // "id": "0001",
  // "バッテリー": "80%",
  // "Wi-Fi": "G-Kobe",
  // "ネットワーク": "オンライン",
  // "バージョン": "v0.0.1",
  "id": "0001",
  "battery": "80%",
  "wifi": "G-Kobe",
  "bluetooth": "ON",
  "network": "オンライン",
  "version": "v0.0.1",
}

module.exports = (event, callback) => {
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
