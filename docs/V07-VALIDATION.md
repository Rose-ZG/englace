# v0.7 Windows 桌面发行验证

2026-10-19 / Windows 11 x64 / Node.js / Electron 44.9.0 / electron-builder 26.15.3

## 源码检查

- `npm run check` 与 `npm test`，47 项通过，包含打包白名单、入口资源、用户级安装配置、图标格式、校验值与原有学习/隐私逻辑。
- `npm audit --omit=dev`：生产 npm 依赖 0 项漏洞。构建工具仅为开发依赖，不进入安装包。
- 应用图标从网页 favicon 的几何参数与 Georgia italic 绘制，输出多尺寸 ICO 和 256 px PNG。

## 桌面检查

- 源码桌面程序使用独立临时档案和随机本机端口运行，现有桌面实例保持运行。
- 真实 `win-unpacked/Englace.exe` 的隔离冒烟验证：`packaged: true`、版本 `0.7.0`、首页与方向选择、桌宠、预加载桥接、四个内置文件、本机 API 均就绪，渲染器错误 0。
- 渲染器维持 `nodeIntegration: false`、`contextIsolation: true`、`sandbox: true`，桌宠保持置顶。
- 发行物为 NSIS 一键安装版、免安装便携版及 SHA-256 校验文件；发布前审计 ASAR，不含用户档案、环境变量文件、缓存、测试文件或凭据。
- 最终 `Englace-0.7.0-x64-portable.exe` 通过直接启动测试，主界面、桌宠、内置文件及 API 就绪、版本正确、渲染错误 0；验证过程中未依赖系统 Node.js。
- 使用 Windows 签名接口检查，便携版为 `NotSigned`，下载页已明确说明未签名状态。

## 发行边界

当前仅提供 Windows x64，未制作 macOS/Linux 安装包，未申请商业签名证书。未在用户当前 Windows 档案中实际执行安装/卸载流程，以免改写其快捷方式或安装项；安装配置及安装包结构已检查，便携版已执行独立启动测试。

GitHub 仓库保持私有。发行附件的上传仅包含应用与校验文件，不改变仓库可见性。自动构建不自动覆盖已经发布的附件，手动发布使用远端大小与 SHA-256 一致性校验。
