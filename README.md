# ARCAIV (Air Combat AI Visualizer)

<br>
<div align="center">
<img src="./readme_images/cover.png" width="100%">
<br>
A Video View of Air Combat AI Visualizer
</div>
<br>

## 1. ツール概要

BasicLogger により出力されたログファイルを分析するツールです。<br>
現在 GitHub サーバーで公開しています。[リンクはこちら](https://shirakumo155.github.io/ARCAIV/)　<br>
スタンドアローンシステムのローカルサーバでも利用可能です。 <br>
現在のバージョンは β 版で以下の機能に限定されています。<br>
今後要望に応じて機能を拡張させる計画です。

<ui>
<li> 対戦状況を３ D で表示可能な「Quick View」と「Video View」のみ利用可能（詳細後述） </li>
<li> ２ vs ２で MRM ４発の対戦データのみ。 </li>
</ui>

## 2. Quick View

１つのログファイルを YouTube と同様の操作方法で簡易的に確認できます。

<div style='display:flex; width:100%; height:100%; flex-direction: column; align-items: center'>
<img src="./readme_images/QuickViewTutorial.gif" width="60%"/>

### 操作手順

<div class="flex-container"><!-- .element: style="display: flex; flex-direction: row;" -->
<ui>
<li> 左端のメニューバー上にある「QuickView」を選択 </li>
<li> 画面右上の「SelectFile」ボタンを選択 </li>
<li> BasicLoggerにより出力されたCSVログファイルを選択 </li>
<li> 動画画面左下の再生ボタンを押下（YouTubeと同様） </li>
</ui>
</div>
</div>

## Video View

複数ログファイルの包括的な分析を支援します。

<div style='display:flex; width:100%; height:100%; flex-direction: column; align-items: center'>
<img src="./readme_images/VideoViewTutorial.gif" width="60%"/>

### 操作手順

<ui>
<li> 左端のメニューバー下にある「ImportLogs」を選択 </li>
<li> 画面右上の「SelectFolder」ボタンを選択 </li>
<li> BasicLoggerにより出力されたCSVログファイルが格納されているフォルダを選択 </li>
<li> 左端のメニューバー真ん中にある「Videos」を選択 </li>
<li> ログファイル一覧から興味のあるデータを選択 </li>
<li> 動画真ん中の再生ボタンを押下 </li>
</ui>
</div>

## 今後の計画

要望に応じて開発<br>（例：２ D モードの実装、図表/動画データのダウンロード機能、戦闘データの統計分析ページの実装、OffPolicyLearning を支援するリプレイバッファ切り出し機能の実装など）
