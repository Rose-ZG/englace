# iPhone / iPad 工程预览

本目录是 SwiftUI + WKWebView 原生宿主工程，离线打包现有学习界面。它不是完全以 SwiftUI 重写的学习产品，也尚未完成 iOS 实机验证或 TestFlight 发布。

## 构建

在 Mac 安装 Xcode 与 XcodeGen 后，从仓库根目录执行：

```
node scripts/build-ios-web.cjs
cd ios
xcodegen generate
open Englace.xcodeproj
```

选择 iPhone 或 iPad 模拟器运行。GitHub Actions 的 iOS Simulator Build 可生成不签名的模拟器构建；该产物不能安装到真实手机。

## TestFlight 前置条件

需要 Apple Developer 付费会员、App Store Connect 应用记录，以及受支持的 Xcode/macOS 环境。设置自己的签名 Team 和唯一 Bundle ID。补齐 App Icon、隐私申报、测试说明，在真机验收后 Archive 并上传 App Store Connect，再配置 TestFlight 测试人员。不要将证书、私钥或账号密码提交到 Git。

## 当前边界与验收

- 包含离线词库、学习页面、游戏与原创听力资源；保留同一 App 容器的本地存储。卸载 App 可能清除记录，需定期备份。
- 手机安全区、触控目标、横向学习导航以及 iPad 布局已增加专项样式。
- 联网 AI 的 Node 服务未移植到 iOS，移动宿主明确返回不可用，不向任何模型发送密钥。
- iOS 不支持 Windows 桌面悬浮桌宠。应用内伙伴保留。
- 尚需模拟器/真机验证：自定义资源协议下 JSON 加载、离线音频播放/拖动、麦克风权限、导入导出、相册图片、视频嵌入、横竖屏、分屏与存储恢复。WKWebView 下载文件的原生分享流程尚未实现，备份导出不能作为已可用功能交付。
- 本工程只是原生 App 的首轮工程交付；不得称为已可安装或已上架版本。
