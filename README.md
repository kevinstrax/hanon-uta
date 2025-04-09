<div align="right">
  <p>
    <a href="README.md"><img src="https://img.shields.io/badge/日本語-🇯🇵-red?style=flat-square" alt="Japanese"></a>
    <a href="README_zh-CN.md"><img src="https://img.shields.io/badge/简体中文-🇨🇳-brightgreen?style=flat-square" alt="Chinese"></a>
  </p>
</div>

# 香鳴ハノン 歌枠アーカイブ

[香鳴ハノン](https://www.youtube.com/@kanaruhanon)さんのYouTube歌枠動画から楽曲検索できるアプリケーションです。

## ✨ 特徴

- 過去の歌枠動画をまとめたアーカイブ
- 曲名・アーティスト名で検索可能
- 各楽曲の再生開始位置を正確に表示
- ワンクリックで該当動画の正確な位置へジャンプ

## 🔍 機能説明

### 1. 歌枠動画コレクション
香鳴ハノンさんの過去のYouTube歌枠動画を網羅的に収集

### 2. 精密検索システム
- 曲名またはアーティスト名で検索
- 該当楽曲が登場する全ての動画を表示
- 各動画内の正確な開始時間（分:秒）を提示

### 3. シームレス再生
検索結果をクリックすると:
- YouTube該当動画が新しいタブで開く
- 指定した時間位置から自動再生開始

## 🛠️ 技術スタック
- **Frontend**: Vue 3 + Vite
- **Hosting**: GitHub Pages
- **UI Framework**: Bootstrap 5.3.3
- **AIコード生成**: [DeepSeek Chat](https://www.deepseek.com) (ほぼ全コードを生成)

## 🚀 使い方
1. 検索ボックスに曲名またはアーティスト名を入力
2. 表示された結果から選択
3. YouTubeで該当箇所が自動再生

## 📦 インストール方法
```bash
git clone https://github.com/kevinstrax/hanon-uta.git

cd hanon-uta

npm install

npm run dev
```

## 🙏 謝辞

本プロジェクトでは、以下のYouTubeユーザー様が投稿した歌枠動画のタイムスタンプ情報を参考にさせていただきました:

- [@tk-taks1984](https://www.youtube.com/@tk-taks1984) 様
- [@timestamp-nog](https://www.youtube.com/@timestamp-nog) 様
- [@haruto-nog](https://www.youtube.com/@haruto-nog) 様

これらの貴重なファン制作のタイムスタンプデータがなければ、このアプリケーションの実現は不可能でした。心より感謝申し上げます。

## 📝 注意事項

- 本アプリは非公式ファン作品であり、タイムスタンプデータは各ユーザー様の投稿を元にしています
- タイムスタンプの精度については保証できかねますので予めご了承ください
- 誤りを見つけた場合はGitHub Issuesでご報告いただけますと幸いです

## 🔄 データ更新について

データは定期的に手動で更新しています。更新リクエストや誤りの報告は、GitHubのIssuesまでお願いします。

## 📜 ライセンス

本プロジェクトはMITライセンスの下で公開されています。ただし、収集した動画データの二次利用は禁止します。

## ❓ お問い合わせ

バグ報告や機能要望は以下まで:
- GitHub Issues: [https://github.com/kevinstrax/hanon-uta/issues](https://github.com/kevinstrax/hanon-uta/issues)
- X(旧Twitter): [@dtkviolin](https://x.com/dtkviolin)

[香鳴ハノン YouTubeチャンネル](https://www.youtube.com/@kanaruhanon) |
[香鳴ハノン X(旧Twitter)](https://x.com/kanaruhanon) 