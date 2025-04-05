# Postman Access Token Generator

このスクリプトは、Google Cloud Platform（GCP）のサービスアカウントを用いて、Postman上でJWTを生成し、アクセストークンを取得するための仕組みです。アクセストークンは環境変数としてPostman内に保存され、そのまま認証ヘッダーに利用できます。

## ✅ 機能概要

- サービスアカウントの秘密鍵を使用してJWTを作成
- GoogleのOAuth 2.0トークンエンドポイントへリクエストを送信
- 取得したアクセストークンをPostmanの環境変数に設定

## 🔧 使用手順

1. Postmanの環境変数に以下を追加してください

| 変数名       | 説明                                                   | タイプ   |
|--------------|--------------------------------------------------------|----------|
| privateKey   | サービスアカウントの秘密鍵                             | secret   |
| clientEmail  | サービスアカウントのメールアドレス                     | secret   |
| targetUrl    | スコープとして使用するAPIのURL (例: https://example.asia-northeast1.run.app) | default  |

1. `createAccessToken.js` の内容を **Pre-request Script** に貼り付ける。

2. 取得したアクセストークンは `{{accessToken}}` としてリクエスト内で使用する。

- Postman上でAuthorizationのBearer Tokenを選択して、そのTokenの入力欄に `{{accessToken}}` を入力する

## 📄 ファイル説明

| ファイル名             | 説明                                     |
|------------------------|------------------------------------------|
| `createAccessToken.js` | JWTの生成およびアクセストークンの取得処理を含むPostman用スクリプトです。 |
