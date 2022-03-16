'use strict';

// SDK
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDBテーブル名
const tname = "todos"
const tname2 = "todos2userdata"


/////////////////////////////////////////////////
// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
// LINEプッシュ通知先（いまは固定宛先ですが、、ボット登録者全員の宛先を自動登録する必要あり、、）
// --> ブロードキャスト送信で対応予定！
const USER_ID = "xxxxxxxxxxxxxxxxxxxxxx"

// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
const ACCESS_TOKEN = "yyyyyyyyyyyyyyyyyyyy"
/////////////////////////////////////////////////


/////////////////////////////////////////////////
// LINE SDK
const line = require('@line/bot-sdk');
const client = new line.Client({
    // channelAccessToken: process.env.ACCESS_TOKEN
    channelAccessToken: ACCESS_TOKEN
});
/////////////////////////////////////////////////


// Lambdaスタート
module.exports = (event, callback) => {

  //////////////////////////////////////////////////////////
  // DynamoDBをスキャン！
  // LINE会話応答系
  //////////////////////////////////////////////////////////
  var data = ""
  var data_now = ""

  const params = {
    TableName: tname,
    // Limit : 1,
    // ScanIndexForward:false,
    // FilterExpression: 'body2 = :vall',
    // ExpressionAttributeValues: { ':vall': 'A宅' }

    ExpressionAttributeNames:{
    '#n': 'body2'
    },
    ExpressionAttributeValues:{
        ':nation': 'A宅'
    },
    FilterExpression: '#n = :nation'
  };

  //////////////////////////////////////////////////////////
  // 受け取り状況をスキャン！
  //////////////////////////////////////////////////////////
  // dynamoDb.scan(params, (error, data) => {
  //   console.log("dynamo_scan1");
  //   // if (err) console.log(JSON.stringify(err, null, 2))
  //   // else console.log(JSON.stringify(data, null, 2))
  //
  //   console.log("dynamo_scan1: " + data)
  //   console.log(JSON.stringify(data, null, 2))
  //
  //   // if (data.Items != []) {
  //   if (data.Count != 0) {
  //     data_now = data.Items[0].body + "(" + data.Items[0].id + ")"
  //
  //   } else {
  //     data_now = "情報なし！"
  //
  //   }
  //
  //   console.log("data_now: " + data_now)
  //
  // });

  //////////////////////////////////////////////////////////
  dynamoDb.scan(params, (error, data) => {
    console.log("dynamo_scan1: " + data)
    console.log(JSON.stringify(data, null, 2))

    data.Items.sort(function(a, b) {
      if (b.id > a.id) {
          return 1;
      } else {
          return -1;
      }
    })


    // if (data.Items != []) {
    if (data.Count != 0) {
      data_now = data.Items[0].body + "(" + data.Items[0].id + ")"

    } else {
      data_now = "情報なし！"

    }

    console.log("data_now: " + data_now)

  });
  //////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////
  // LINE UserIDの取得、、
  //////////////////////////////////////////////////////////
  setTimeout(
    function () {
      // console.log("event: " + event)
      // console.log(JSON.stringify(event));
      // console.log("callback: " + callback)
      // console.log(JSON.stringify(callback));

      //////////////////////////////////////////////////////////
      // リクエストデータの確認
      //////////////////////////////////////////////////////////
      const req = JSON.parse(event.body);

      // console.log("req: " + req)
      // console.log(JSON.stringify(req));
      //
      // console.log("type: " + req.events[0].type)
      // console.log("message-type: " + req.events[0].message.type)
      // console.log("text: " + req.events[0].message.text)
      // console.log("userId: " + req.events[0].source.userId)
      // console.log("replyToken: " + req.events[0].replyToken)


      //////////////////////////////////////////////////////////
      // LINEリプライトークンを取得
      //////////////////////////////////////////////////////////
      const replyToken = req.events[0].replyToken;
      console.log("replyToken: " + replyToken)

      //////////////////////////////////////////////////////////
      // ★★dynamo-ID付与
      const idid = String(new Date().getTime())
      console.log("nowko" + idid)
      //////////////////////////////////////////////////////////


      //////////////////////////////////////////////////////////
      // ユーザーIDの取得
      //////////////////////////////////////////////////////////
      console.log("userid" + req.events[0].source.userId)
      let userdata = {"id": idid, "userid": req.events[0].source.userId, "req": req}

      const params = {
        TableName: tname2,
        Item: userdata
      };
      console.log("dyanam_params: " + params);
      console.log(JSON.stringify(params));

      // ユーザーIDの格納！（遅延発生するみたい、、）
      dynamoDb.put(params, (error, data) => {
        console.log("ユーザーデータの格納ー: " + data);
        if (error) {
          cconsole.log("ユーザーデータの格納失敗！");
        }
      });
      //////////////////////////////////////////////////////////
// "body": "{\"id\":\"\",\"body\":\"受取待ち\",\"body2\":\"A宅\",\"updatedAt\":\"2022-2-18_14-27-6\"}",



      //////////////////////////////////////////////////////////
      // ■ボタン#1: 置き配ステータス
      //////////////////////////////////////////////////////////
      if (req.events[0].message.text == "ステータス") {

        const message = "▲置き配ボックス"
                        + "\n--" + "バッテリー: 80%"
                        + "\n--" + "Wi-Fi: " + "G-Kobe"
                        + "\n--" + "Bluetooth: " + "ON"
                        + "\n--" + "ネットワーク: " + "オンライン"
                        + "\n--" + "バージョン: " + "ver 0.01"
                        + "\n--" + "★ステータス: " + data_now

        const postMessage = {
                  type:'text',
                  text: message,
              }
        console.log("LINEメッセージ応答: " + postMessage)

        ///////////////////////////////////////////
        // ★LINEメッセージ応答
        client.replyMessage(replyToken, postMessage).then((data) => {
          console.log("replyToken22-status: " + data)
          // callback(null, event);
        }).catch((err) => {
          console.log("だめでし-status");
          // callback(err, "NG");
        });
        ///////////////////////////////////////////
        // client.pushMessage(USER_ID, postMessage);



      //////////////////////////////////////////////////////////
      // ■ボタン#2: 受け取り状況
      //////////////////////////////////////////////////////////
      } else if (req.events[0].message.text == "受け取り状況") {

        // LINEリプライ！！
        // const message = "受け取り状況は以下になります！\n" + JSON.stringify(data, null, 2)
        const message = "受け取り状況は以下になります！\n--> " + data_now
        const postMessage = {
                  type:'text',
                  text: message,
              }
        console.log("受け取り状況: " + postMessage)

        ///////////////////////////////////////////
        // ★LINEメッセージ応答
        client.replyMessage(replyToken, postMessage).then((data) => {
          console.log("replyToken22: " + data)
          // callback(null, event);
        }).catch((err) => {
          console.log("だめでし");
          // callback(err, "NG");
        });
        ///////////////////////////////////////////
        // client.pushMessage(USER_ID, postMessage);



      //////////////////////////////////////////////////////////
      // ■ボタン#3: 受け取り状況
      //////////////////////////////////////////////////////////
      } else {
        const message = "現在対応できるのは、以下キーワード入力になります\n"
                        + "「ステータス」\n"
                        + "「受け取り状況」"

        const postMessage = {
                  type:'text',
                  text: message,
              }
        console.log("キーワード入力: " + postMessage)

        ///////////////////////////////////////////
        // ★LINEメッセージ応答
        client.replyMessage(replyToken, postMessage).then((data) => {
          console.log("replyToken22-else: " + data)
          // callback(null, event);
        }).catch((err) => {
          console.log("だめでし-else");
          // callback(err, "NG");
        });
        ///////////////////////////////////////////
        // client.pushMessage(USER_ID, postMessage);

      }

      //////////////////////////////////////////////////////////
      // return callback(error, "200 OK")
        setTimeout(
          function () {
                return callback(null, "200 OK")
            },
          "3000"
        )
      //////////////////////////////////////////////////////////


    }, "1500"

  );

  // return callback(error, "200 OK")
  //////////////////////////////////////////////////////////
  // // DynamoDBいるのかな、、
  // const params2 = {
  //   TableName: tname
  // };
  //
  // return dynamoDb.scan(params2, (error, data) => {
  //   setTimeout(
  //     function () {
  //           if (error) {
  //             callback(error);
  //           }
  //           callback(error, data.Items);
  //       },
  //     "3000"
  //   );
  // });

};
