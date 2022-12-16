<h1><p align="center"><img src="./ai.svg" alt="AiCore" height="200"><img src="https://github.com/AyumuNekozuki/mashiro/blob/master/mashiro.png?raw=true alt="AiCore" height="200"></p></h1>
<p align="center">An Mashiro for Misskey. <a href="./torisetu.md">About Mashiro</a></p>

## これなに
Misskey用の日本語Botです。
[藍](https://github.com/syuilo/ai)をベースに、各種機能を追加しました。

## オリジナル藍との違い
- 一部ワードが変更されています
- 一部機能をDiscordでも使えるようにしました
- 一部機能を追加しました

## Dockerで動かす
まず適当なディレクトリに `git clone` します。
次にそのディレクトリに `config.json` を作成します。中身は次のようにします:
（MeCabの設定、memoryDirについては触らないでください）
``` json
{
	"host": "https:// + あなたのインスタンスのURL (末尾の / は除く)",
	"i": "藍として動かしたいアカウントのアクセストークン",
	"master": "管理者のユーザー名(オプション)",
	"notingEnabled": "ランダムにノートを投稿する機能を無効にする場合は false を入れる",
	"keywordEnabled": "キーワードを覚える機能 (MeCab が必要) を有効にする場合は true を入れる (無効にする場合は false)",
	"chartEnabled": "チャート機能を無効化する場合は false を入れてください",
	"reversiEnabled": "藍とリバーシで対局できる機能を有効にする場合は true を入れる (無効にする場合は false)",
	"serverMonitoring": "サーバー監視の機能を有効にする場合は true を入れる (無効にする場合は false)",
	"mecab": "/usr/bin/mecab",
	"mecabDic": "/usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd/",
	"memoryDir": "data",
	"discordBotToken": "Discord Bot Token (無効にする場合は '')",
	"discordCurrent": {
		"guild": "自動メッセージの投稿先サーバーID",
		"channel": "自動メッセージの投稿先チャンネルID",
		"owner": "オーナーのユーザーID"
	}
}
```
`docker-compose build` して `docker-compose up` すれば起動できます。
`docker-compose.yml` の `enable_mecab` を `0` にすると、MeCabをインストールしないようにもできます。（メモリが少ない環境など）

## フォント
一部の機能にはフォントが必要です。藍にはフォントは同梱されていないので、ご自身でフォントをインストールディレクトリに`font.ttf`という名前で設置してください。

## 記憶
藍は記憶の保持にインメモリデータベースを使用しており、藍のインストールディレクトリに `memory.json` という名前で永続化されます。

## ライセンス
MIT

## Awards
<img src="./WorksOnMyMachine.png" alt="Works on my machine" height="120">
