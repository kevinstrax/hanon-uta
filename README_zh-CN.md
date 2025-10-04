<div align="right">
  <p>
    <a href="README.md"><img src="https://img.shields.io/badge/日本語-🇯🇵-red?style=flat-square" alt="Japanese"></a>
    <a href="README_zh-CN.md"><img src="https://img.shields.io/badge/简体中文-🇨🇳-brightgreen?style=flat-square" alt="Chinese"></a>
  </p>
</div>

# 香鳴ハノン 歌回存档

[香鳴ハノン](https://www.youtube.com/@kanaruhanon)的YouTube歌回直播视频检索应用。

## ✨ 特点

- 汇总过往歌回直播的存档
- 支持按歌曲名/艺术家名搜索
- 精确显示每首歌曲的开始时间点
- 一键跳转到YouTube指定时间位置

## 💡 开发初衷

某天我特别想听ハノンちゃん演唱的《ロマンスの神様》，却记不清是在哪次直播中演唱的。花费大量时间翻找后，我萌生了创建这个工具的想法——希望能让所有粉丝快速定位到想听的歌曲。

## 🔍 功能说明

### 1. 歌回视频收集
全面收录香鳴ハノン过往的YouTube歌回直播视频

### 2. 精准搜索系统
- 通过歌曲名或艺术家名搜索
- 显示最近一年直播中包含该歌曲的所有视频
- 精确标注每个视频中的开始时间(分:秒)

### 3. 无缝播放体验
点击搜索结果将：
- 在新标签页打开对应YouTube视频
- 自动从指定时间点开始播放

## 🚀 在线体验
项目已部署至GitHub Pages，可直接在线访问：
→ [https://hanon-uta.github.io/](https://hanon-uta.github.io/)

## 🛠️ 技术栈
- **前端**: Vue 3 + Vite
- **部署**: GitHub Pages
- **UI框架**: Bootstrap 5.3.3
- **AI代码生成**: [DeepSeek Chat](https://www.deepseek.com) (几乎全部代码由AI生成)

## 🚀 使用方法
1. 在搜索框输入歌曲名或艺术家名
2. 从搜索结果中选择
3. 自动跳转到YouTube对应时间点播放

## 📦 安装方法
```bash
git clone https://github.com/hanon-uta/hanon-uta.github.io.git

cd hanon-uta

npm install

npm run dev
```

## 🙏 致谢

本项目参考了以下YouTube用户提供的歌回时间轴信息：

- [@tk-taks1984](https://www.youtube.com/@tk-taks1984)
- [@timestamp-nog](https://www.youtube.com/@timestamp-nog)
- [@haruto-nog](https://www.youtube.com/@haruto-nog)

没有这些宝贵的时间轴数据，本项目将无法实现。在此表示衷心感谢。

## 📝 注意事项

* 本应用是粉丝制作的非官方工具，与香鳴ハノン及其所属团体无关联
* 所有视频权利归属原作者，本项目仅提供时间索引服务
* 数据来源于用户投稿，准确性不作担保
* 如发现错误请在GitHub Issues提交报告

## 🔄 数据更新说明

数据会定期手动更新。如需请求更新或报告错误，请通过GitHub Issues提交。

## 📜 许可证

本项目采用MIT许可证。但禁止对收集的视频数据进行二次利用。

## ❓ 联系

问题反馈或功能建议：
- GitHub Issues: [https://github.com/hanon-uta/hanon-uta.github.io/issues](https://github.com/hanon-uta/hanon-uta.github.io/issues)
- X(旧Twitter): [@dtkviolin](https://x.com/dtkviolin)

[香鳴ハノン YouTube频道](https://www.youtube.com/@kanaruhanon) |
[香鳴ハノン X(旧Twitter)](https://x.com/kanaruhanon) 