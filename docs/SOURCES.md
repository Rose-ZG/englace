# 内容来源与题型依据

## 下载页氛围音乐与视觉

下载页的 Orbit 氛围音乐为项目原创 Web Audio 合成编曲，使用正弦音色、缓慢和弦与稀疏旋律，不包含第三方录音或影视音轨。用户点击后才创建音频上下文；可暂停和调整音量，页面进入后台时暂停。星点、轨道光球和漂浮词卡由 Canvas / CSS 在本机绘制，无外部图片、音频或字体请求。系统开启减少动画时关闭连续视觉动画。

核对日期：2026-10-19。

## 词库

内置分级包来自 [ECDICT](https://github.com/skywind3000/ECDICT) 的 ecdict.csv，按 gk、cet4、cet6、ielts、toefl、ky 标签筛选。保留可读英文词、短语和有效中文释义，按词频排序并去重。统计和原始文件 SHA-256 记录在 data/manifest.json。重新构建：`python scripts/build_vocab.py .cache/ecdict.csv`。

上游仓库声明 MIT，原文保留于 data/ECDICT-LICENSE.txt。上游数据为多来源汇编；考试标签与释义可能存在过时、遗漏或错误，不等同于完整的最新官方考纲，也不代表获得牛津、朗文等出版商授权。

专业词典及教材采用官方来源入口与用户本地导入，而非打包商业词典、教材全文：

- Oxford：https://www.oxfordlearnersdictionaries.com/
- Longman：https://www.ldoceonline.com/
- 人民教育出版社：https://www.pep.com.cn/
- 大学英语教材：用户按自己的课程、册次、单元整理已授权词表为 CSV / JSON。

词库数量：高考 3,674；四级 3,846；六级 5,406；雅思 5,040；托福 6,974；考研 4,801。不同包有重合，不能将它们相加称为独立单词总数。

## 听力训练

19 篇文本与 43 题均为本项目原创，不含官方真题、教材原文、影视台词。音频为 Windows 已安装英语语音合成生成（Microsoft Zira Desktop），16 kHz 单声道 WAV，随仓库提供，可离线播放。没有英式语音包时使用美式语音，不把它宣称为雅思多口音训练。原文逐句朗读使用浏览器 SpeechSynthesis，可能依赖系统语音配置。

以下来源仅用于题型设计，未复制其试题、音频或例文：

- 高考常见短对话、长对话、独白；实际安排按所在省份：https://gaokao.neea.edu.cn/res/Home/structure/ef1746d46e7129defd766cc21029b521.pdf
- CET-4：短篇新闻、长对话、听力篇章；CET-6：长对话、听力篇章、讲座/讲话。考试中心结构：https://cet.neea.edu.cn/html1/folder/16113/1586-1.htm
- IELTS：四部分，常见选择、匹配与填空。本版实现表格填空、用途匹配、多选、笔记填空，未覆盖地图标注等全部题型：https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening
- 2026 TOEFL：Listen and Choose a Response、Conversation、Announcement、Academic Talk：https://www.ets.org/toefl/test-takers/ibt/about/content/listening.html
- 考研英语初试不含听力，外国语听力口语在复试由招生单位组织，本版为通用复试理解练习：https://www.moe.gov.cn/srcsite/A15/moe_778/s3261/202509/t20250918_1413836.html

短篇专题练习不模拟正式卷题量、播放限制、自适应路线、难度标定、考试分数或官方 CEFR 等级。

## 影视精听

模块不提供《纸牌屋》《生活大爆炸》《绝命毒师》等剧集下载、内置视频、字幕或台词。用户可导入有权使用的本地视频/音频与 SRT，选择起止秒数进行虚拟截取、循环与听写对照；不导出裁剪视频，不进行语音识别。媒体仅存于当前浏览器 IndexedDB，不能随 GitHub 仓库或学习 JSON 备份迁移。

## v0.3：在线影片与字幕

- 内置连接入口：https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4 ，已以 HEAD 请求验证 200。资源由 Blender 官方托管，按需直连，不下载到仓库。
- 来源与许可：https://durian.blender.org/about/ 、https://durian.blender.org/sharing/ 。© copyright Blender Foundation | durian.blender.org，CC BY 3.0。官方预告片原样嵌入，不裁切文件。
- B 站公开页面示例：https://www.bilibili.com/video/BV1iW411j7bn/ 。仅使用官方 iframe 地址，不使用解析、盗链或鉴权绕过接口；不保证第三方允许嵌入。
- 双语 SRT 由使用者自行导入。原生视频按时间同步；跨域 iframe 仅提供可调整的画面区域遮罩。

## v0.3：每日名句与画面

1,085 条摘句：154 首十四行诗按相邻两行摘取，共 1,077 条，加 8 条经原文文本匹配核验的戏剧台词。不是 1,085 位作者或 1,085 部影视作品；所有条目均标注同一作者与真实作品出处，诗歌还标注原文行号。

- Sonnets：https://www.gutenberg.org/ebooks/1041
- Hamlet：https://www.gutenberg.org/ebooks/1524
- Romeo and Juliet：https://www.gutenberg.org/ebooks/1513

作者 William Shakespeare，英文原作为公版。8 条戏剧摘句的中文为本项目学习意译；其余保留英文原文。出处包括作品名与十四行诗编号。重建脚本为 scripts/build_quotes.py，原始下载文件在忽略目录 .cache/。

六套配图由 scripts/build_art.js 生成，是本项目原创意境插画，用于表达阅读主题，不是原著插图、实际剧照或历史照片。词库书架复用同一组插画，无第三方图片热链。

## v0.3：写作口语题型依据

12 项写作任务和 10 项口语任务均为项目原创。题型参考不等于完整模拟，各科具体要求仍以当次题目和院校通知为准。

- IELTS Academic 写作：https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing
- IELTS 口语：https://takeielts.britishcouncil.org/prepare/ielts-academic/speaking
- TOEFL 2026 写作（句子构建、邮件、学术讨论）：https://www.ets.org/toefl/test-takers/ibt/about/content/writing.html
- TOEFL 2026 口语（Listen and Repeat / Take an Interview）：https://www.ets.org/toefl/test-takers/ibt/about/content/speaking.html
- CET 笔试 / 口试大纲：https://cet.neea.edu.cn/xhtml1/folder/16113/1588-1.htm

高考口语是通用情景表达，非所有省份的统一口试；考研口语为通用复试表达。当前不做录音语音识别、音素评测、正式分数估计或双人实时对话。
