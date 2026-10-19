# 英格雷斯 v0.7.1 · 桌面稳定性修复

修复主窗口或桌宠销毁后，迟到的窗口操作、托盘操作及 IPC 校验访问原生对象时产生的 `TypeError: Object has been destroyed`。

- 窗口关闭后清理引用；所有窗口显示、隐藏与桌宠切换先检查窗口是否仍然存活。
- GitHub 下载现已公开，无需登录应用；沿用本机学习档案，无需删除或重置数据。
- 源代码采用 MIT 许可证，第三方内容保留各自许可；新安装包包含许可证。
- 49 项测试通过，包含销毁对象与关闭后操作回归测试。

安装版与便携版适用于 Windows 10/11 x64。更新前请从托盘退出旧版，再启动新版本。

[Code signing policy](https://github.com/Rose-ZG/englace/blob/main/docs/CODE-SIGNING.md)：免费签名申请尚未提交成功，本版本未签名，仍可能显示未知发布者提示。请使用随附的 SHA256SUMS.txt 核验下载文件。
