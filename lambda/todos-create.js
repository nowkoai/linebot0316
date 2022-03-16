'use strict';

// SDK
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDBテーブル名
const tname = "todos"


/////////////////////////////////////////////////
// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
// LINEプッシュ通知先（いまは固定宛先ですが、、ボット登録者全員の宛先を自動登録する必要あり、、）
// --> ブロードキャスト送信で対応予定！
const USER_ID = "xxxxxxxxxxxxxxxxxxxx"

// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
const ACCESS_TOKEN = "yyyyyyyyyyyyyyyyyyyy"

// ★LINE開発コンソールを確認）ACCESS_SECRETを記述して、再度デプロイ（sls deploy）
const SECRET = "ZZZZZZZZZZZZZZZZZZZZZZZZ"

/////////////////////////////////////////////////
const line = require('@line/bot-sdk');
const client = new line.Client({
  // channelAccessToken: process.env.ACCESS_TOKEN
  channelAccessToken: ACCESS_TOKEN,
  channelSecret: SECRET
});
/////////////////////////////////////////////////

// Lambdaスタート
module.exports = (event, callback) => {
  console.log("event: " + event)
  console.log(JSON.stringify(event));

  const data = JSON.parse(event.body);
  console.log("data: " + data)
  console.log(JSON.stringify(data));
  console.log("data: " + data.body2)

  //////////////////////////////////////////////////////////
  // LINEプッシュ通知ね！
  //////////////////////////////////////////////////////////
  // {
  //     "id": "",
  //     "body": "受取待ち",
  //     "body2": "A宅",
  //     "updatedAt": "2022-2-18_0-11-2"
  // }
  //
  // client.pushMessage(process.env.USER_ID, postMessage);

  //////////////////////////////////////////////////////////////
  // ★受取待ち
  //////////////////////////////////////////////////////////////
  if (data.body == "受取待ち") {

    // ■A宅の場合
    if (data.body2 == "A宅") {
      const message = "★荷物が届きました！" + "\n--" + data.body2  + "\n--" + data.body   + "\n--" + data.updatedAt + "\n--(" + data.id + ")"

      const postMessage = {
                type:'text',
                text: message,
            }

      // ★LINEプッシュ通知
      console.log("A宅-受取待ち/LINEプッシュ通知あり: " + postMessage)
      client.pushMessage(USER_ID, postMessage)
      // client.broadcast(postMessage)


    // ■B宅の場合
    } else {
      const message = "※別宅に通知！（受取待ち）" + "\n--" + data.body2  + "\n--" + data.body   + "\n--" + data.updatedAt + "\n--(" + data.id + ")"

      const postMessage = {
                type:'text',
                text: message,
            }

      // ★LINEプッシュ通知
      // console.log("B宅-受取待ち/LINEプッシュ通知なし！: " + postMessage)
      client.pushMessage(USER_ID, postMessage);
      // client.broadcast(postMessage)

    }
    ////////////////////////////////////////////////////


  } else {

    //////////////////////////////////////////////////////////////
    // ★受け取り済
    //////////////////////////////////////////////////////////////

    // ■A宅の場合
    if (data.body2 == "A宅") {
      const message = "●荷物を受け取りました！" + "\n--" + data.body2  + "\n--" + data.body   + "\n--" + data.updatedAt + "\n--(" + data.id + ")"

      const postMessage = {
                type:'text',
                text: message,
            }

      console.log("A宅-受取完了/LINEプッシュ通知あり: " + postMessage)
      client.pushMessage(USER_ID, postMessage);
      // client.broadcast(postMessage)

    // BA宅の場合
    } else {
      const message = "※別宅に通知！（受取完了）" + "\n--" + data.body2  + "\n--" + data.body   + "\n--" + data.updatedAt + "\n--(" + data.id + ")"

      const postMessage = {
                type:'text',
                text: message,
            }

      console.log("B宅-受取完了/LINEプッシュ通知なし！: " + postMessage)
      client.pushMessage(USER_ID, postMessage);
      // client.broadcast(postMessage)
    }
    ////////////////////////////////////////////////////

  }




  //////////////////////////////////////////////////////////
  // DynamoDBインサート
  //////////////////////////////////////////////////////////

  const params = {
    TableName: tname,
    Item: data
  };
  console.log("dyanam_params: " + params);
  console.log(JSON.stringify(data));

  // //////////////////////////////////////////////////////////
  // // ★★dynamo-ID付与
  // data.id = String(new Date().getTime())
  // console.log("nowko" + data.id)
  // //////////////////////////////////////////////////////////

  // DynamoDBインサート！
  return dynamoDb.put(params, (error, data) => {
    console.log("dynamo_insert");
    if (error) {
      callback(error);
    }
    callback(error, params.Item);
  });

};
