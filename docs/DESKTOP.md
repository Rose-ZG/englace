# 英格雷斯桌面版 · Windows

[Code signing policy](CODE-SIGNING.md)：免费签名申请准备中，尚未获批；现有附件仍未签名。

## 下载与启动

从 [最新发行版](https://github.com/Rose-ZG/englace/releases/latest) 选择：

- `Englace-0.7.1-x64-portable.exe`：免安装，下载后双击启动。首次解包可能稍慢，不需要 Node.js 或终端。
- `Englace-0.7.1-x64-setup.exe`：当前用户一键安装，创建桌面和开始菜单快捷方式，安装完成自动启动。
- `SHA256SUMS.txt`：两份可执行文件的 SHA-256 校验值。

适用于 Windows 10/11 64 位。软件及词库内置在下载文件中；学习记录只保存在当前电脑，无需登录英格雷斯。GitHub 仓库现已公开，发行附件可直接下载。

本发行版未使用商业代码签名证书，Windows 可能显示“未知发布者”或 SmartScreen 提示。请核对下载来源和校验值；应用不能绕过系统的安全策略。

## 本机学习档案

正式版固定使用本机 `127.0.0.1:4174` 与 `%APPDATA%\Englace` 用户档案。安装更新或移动便携可执行文件不会改变该档案；“便携版”指免安装运行，不表示学习档案写在 exe 旁边。卸载默认保留档案。先前通过 `npm run desktop` 使用的同一路径继续兼容。

网页版 `127.0.0.1:4173` 与桌面版属于不同浏览器存储空间。迁移时分别导出、导入学习备份和工作室备份；本地视频素材需自行保留。外观偏好与历史排行榜的备份边界见隐私说明。

同一电脑重复启动会唤回已有窗口；更新前请从托盘或菜单“退出英格雷斯”结束旧实例。关闭主窗口且桌宠显示时，主窗口会隐藏；双击托盘图标可恢复。

桌面版不设置开机启动、不申请管理员权限、不自动上传学习数据。联网 AI 与在线影片继续按页面中的单次确认连接。

## 从源码构建

```powershell
npm ci
npm run desktop:dist
```

输出位于 `release/`，包括安装版、便携版与校验文件。构建依赖 Node.js；最终用户不需要 Node.js。固定 Electron 和 electron-builder 版本，打包使用明确文件白名单，不带 `.cache`、账号凭据、测试记录或用户档案。

```powershell
npm run desktop -- --smoke-test --smoke-output=.cache/desktop-smoke-result.json
& '.\release\win-unpacked\Englace.exe' --smoke-test --smoke-output=.cache/packaged-smoke-result.json
```

冒烟测试使用独立临时档案和随机本机端口，不占用正在运行的正式桌面实例；验证首页、方向入口、桌宠、预加载桥接、内置文件、本机 API 和渲染隔离。测试完成后退出，不显示桌面窗口。
