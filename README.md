# LINEBot & AWS環境構築（S3/APIGateway/Lambda/DynamoDB）

- Line developersへログイン
https://developers.line.biz/ja/

- AWSへログイン
https://aws.amazon.com/jp/console/

## Lineボットの作成（参考URL）
https://cloud5.jp/aws-lambda_line-api/

## Cloud9の作成（参考URL）
https://zenn.dev/arahabica/books/d4373bd4401d6c/viewer/75a879

## Cloud9の環境確認
```
$ node -v

$ aws --version

$ sls --version
```

## Cloud9上で以下コマンド実行
```
$ git clone https://github.com/nowkoai/linebot0316.git

$ cd linebot0316

$ npm install

$ sls deploy
```

## Cloud9上でファイル編集#1
sls deploy 実行後に、Line Messaging APIで作成したのキーを以下に入力

```javascript:linebot0316/lambda/todo-create.js
// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
// LINEプッシュ通知先（いまは固定宛先ですが、、ボット登録者全員の宛先を自動登録する必要あり、、）
// --> ブロードキャスト送信で対応予定！
const USER_ID = "xxxxxxxxxxxxxxxxxxxx"

// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
const ACCESS_TOKEN = "yyyyyyyyyyyyyyyyyyyy"

// ★LINE開発コンソールを確認）ACCESS_SECRETを記述して、再度デプロイ（sls deploy）
const SECRET = "ZZZZZZZZZZZZZZZZZZZZZZZZ"
```

```javascript:linebot0316/lambda/todo-line-res.js
// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
// LINEプッシュ通知先（いまは固定宛先ですが、、ボット登録者全員の宛先を自動登録する必要あり、、）
// --> ブロードキャスト送信で対応予定！
const USER_ID = "xxxxxxxxxxxxxxxxxxxxxx"

// ★LINE開発コンソールを確認）ACCESS_TOKENを記述して、再度デプロイ（sls deploy）
const ACCESS_TOKEN = "yyyyyyyyyyyyyyyyyyyy"
```


## Cloud9上でファイル編集#2
S3バケットの公開index.htmlのURLを確認して、以下に入力

```javascript:linebot0316/static/index.js
// ★AWSコンソールを確認）API GatewayのURLを記述して、再度デプロイ（sls deploy）
const apiurl = "https://1cqmawpakl.execute-api.us-east-1.amazonaws.com/dev/todos"
```

## Cloud9上で、sls deployの再デプロイ
```
$ sls deploy
```

S3バケットの公開index.htmlのURLにアクセスして動作確認
