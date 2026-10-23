# ID 账号与三题密保

## 当前状态

账号页面：`https://rose-zg.github.io/englace/app/account.html`。

已完成账号后端部署，并通过云端实际集成测试：注册、重复 ID 拒绝、大小写 ID 登录、社区权限、三题中任一错误拒绝找回、全对重设、旧密码失效、新密码登录。测试记录：https://github.com/Rose-ZG/englace/actions/runs/39919622595 。前端会检查健康接口，服务不可达时禁用提交。以下部署步骤保留供维护使用。

## Supabase 部署（已有项目）

1. SQL Editor 新建查询，执行 `community/accounts.sql`，不要重新执行旧 `schema.sql`。
2. Edge Functions 新建函数，名称 **englace-account**，使用 `supabase/functions/englace-account/index.ts` 完整代码部署。关闭该函数的 **Verify JWT / Enforce JWT Verification**：登录、注册和找回调用发生在尚未登录时；函数自行校验输入和限流，不开放其他管理员接口。此配置只应用于这个函数，不关闭数据库 RLS。
3. Supabase Edge 环境内使用平台提供的 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`。不要复制管理员密钥到网页、聊天或 Git。若平台未提供服务端环境变量，请在后台 Secrets 设置，绝不修改源码硬编码。
4. 使用两个测试 ID 验收：注册、登录、三题全对重设、任意一题错拒绝、旧密码失效、新密码有效；确认账号会话可以访问社区且不同 ID 无法读取他人私信。

也可用 Supabase CLI 在已授权电脑执行 `supabase functions deploy englace-account --project-ref zwvvycidjioozfasjqwj --no-verify-jwt`。CLI 个人访问令牌不要提交到仓库。

## 设计边界

- ID 为 4–24 位，字母开头，允许字母、数字、下划线，统一小写。密码 10–128 位，包含字母和数字；交由 Supabase Auth 管理。
- 为实现无邮箱 ID，服务端为账号生成不用于投递的随机内部认证邮箱。用户只填写 ID，无邮件找回流程；不能将内部地址用于联系用户。
- 三题均为用户自定义暗语，每条至少 8 字符且互不相同；服务端 NFKC 规范化、去首尾空格并转小写，每题使用独立的派生盐和 PBKDF2-SHA256 210000 次，验证需三题全部匹配。不保存答案原文。
- 仅靠密保弱于现代 MFA；应避免易猜的真实经历。忘记答案时，本版本没有另一条自助找回路径。不要承诺绝对安全。
- 数据库禁止 anon/authenticated 直接读取账号、哈希和限流表。管理员权限仅用于 Edge Function，不能下发客户端。
- 每小时按网络来源摘要限制 100 次、每 ID/操作 20 次；找回每 ID 每小时最多 5 次。限流表采用数据库原子更新；仍需要运营防刷、CAPTCHA、预算及容量监控，不代表已经完成公开大规模上线的防护。
- 登录替换本机社区凭证，不自动把旧匿名账号的信件迁移给新 ID；避免未经验证接管身份。退出只清除本机凭证，不承诺立即撤销其他设备已发出的访问令牌。
- 学习记录继续本机存储，注册／登录不会自动上传或同步学习档案。密码和密保答案不写 localStorage；登录令牌按原社区方案保存在本机。

## 验证

Node 单元测试覆盖输入边界；GitHub Actions `Account Backend Check` 执行 Deno 类型检查。数据库及 Edge Function 已部署并通过上述真实集成测试；浏览器及不同设备仍需持续验证。
