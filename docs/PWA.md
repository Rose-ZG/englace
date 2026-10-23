# iPhone / iPad 网页 App

地址：https://rose-zg.github.io/englace/app/

使用 Safari 打开，分享 → 添加到主屏幕。首次联网打开并等待“离线词库已就绪”，之后可离线使用词汇等本地功能；点击“下载离线听力”后等待成功提示，方可离线播放内置听力。在线影视仍需要网络。联网 AI 尚未接入网页服务。

记录仅存当前浏览器／主屏幕 App 的设备存储中，不保证永不清理；请定期导出学习和工作室备份。不同电脑、Safari 与主屏幕 App 之间不自动同步。iOS 可能清理缓存、拒绝存储或限制后台音频。Windows 悬浮桌宠不能在 iOS 上实现。

构建：`node scripts/build-pwa.cjs`。输出到 `.cache/pages-site/app/`，只复制公开资源，不打包 Node 服务、用户资料、私钥或开发缓存。安装缓存不包含音频，音频可按需缓存；缓存更新需用户确认。发布时同步 gh-pages 分支。当前 Windows 安装包不因此重新发布。

这是网页 App，非 App Store／TestFlight 原生应用。iOS 真机录音、文件导入导出、首次安装与离线恢复仍需用户设备验收。
