# Unix Timestamp to JST Chrome Extension

Webページ上のUnixタイムスタンプを自動的に日本標準時（JST）に変換するChrome拡張機能です。

## 機能

- 🔄 **自動変換**: ページ上の10桁（秒）・13桁（ミリ秒）のUnixタイムスタンプを自動検出し、JST形式で表示
- 🎯 **ホバー表示**: 変換された時刻にマウスを合わせると元のタイムスタンプも表示
- 💡 **トグル機能**: ポップアップから変換表示のON/OFF切り替え可能
- 🔧 **手動変換**: ポップアップでUnixタイムスタンプを入力して日本時間を確認
- ⚡ **動的対応**: Ajax/SPAサイトでも動的に追加されるコンテンツに対応

## インストール方法

### 開発者モードでのインストール

1. このリポジトリをクローン
   ```bash
   git clone git@github.com:delightech/unixtimestamp2jst-extension.git
   cd unixtimestamp2jst-extension
   ```

2. Chrome（またはEdge）で拡張機能ページを開く
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`

3. 右上の「デベロッパーモード」をONにする

4. 「パッケージ化されていない拡張機能を読み込む」をクリック

5. クローンしたフォルダを選択

## 使い方

### 自動変換
Webページを開くと、以下のようなUnixタイムスタンプが自動的に日本時間に変換されます：
- `1705456800` → `2024/01/17 11:00:00`
- `1705456800000` → `2024/01/17 11:00:00`

### 表示の切り替え
1. ブラウザのツールバーにある拡張機能アイコンをクリック
2. 「表示: ON/OFF」ボタンで変換表示を切り替え

### 手動変換
1. 拡張機能のポップアップを開く
2. 入力欄にUnixタイムスタンプを入力
3. 即座に日本時間が表示される

## 対応ブラウザ

- Google Chrome
- Microsoft Edge
- その他のChromiumベースブラウザ

## プライバシーとセキュリティ

この拡張機能は：
- ✅ 最小限の権限（activeTab）のみ要求
- ✅ 外部サーバーとの通信なし
- ✅ ユーザーデータの収集・保存なし
- ✅ すべての処理をローカルで実行

## 開発

### ファイル構成
```
unixtimestamp2jst-extension/
├── manifest.json      # 拡張機能の設定
├── content.js         # メインのコンテンツスクリプト
├── styles.css         # スタイルシート
├── popup.html         # ポップアップUI
├── popup.js           # ポップアップのスクリプト
├── README.md          # このファイル
└── LICENSE            # ライセンス
```

### ビルド
この拡張機能は純粋なJavaScriptで書かれており、ビルドプロセスは不要です。

## コントリビューション

プルリクエストを歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

## ライセンス

[MIT License](LICENSE)

## 作者

- GitHub: [@delightech](https://github.com/delightech)

## 謝辞

このプロジェクトはオープンソースコミュニティの支援により実現しました。