// Original Englace practice material. No official exam questions or film scripts.
const fs=require('node:fs');
const choice=(prompt,options,answer,why)=>({kind:'choice',prompt,options,answer,why});
const fill=(prompt,answer,why,maxWords=1)=>({kind:'fill',prompt,answer:Array.isArray(answer)?answer:[answer],maxWords,why});
const items=[];
function add(id,track,type,title,lines,questions){items.push({id,track,type,title,lines:lines.map((text,i)=>({speaker:i%2?'B':'A',text})),questions,source:'英格雷斯原创',audio:'audio/'+id+'.wav',accent:track==='ielts'?'en-GB':'en-US'});}
add('gk-01','gaokao','短对话','下一班车，几点出发？',[
'Excuse me, has the eight thirty bus to the museum left yet?',
'Yes, it left five minutes ago. The next one is at nine fifteen, but you can take the underground. It only takes twenty minutes.',
'That sounds better. I need to arrive before nine. Where is the station?',
'Go straight ahead and turn left at the bookstore. It is opposite the bank.'
],[choice('How will the man probably go to the museum?',['By bus.','By underground.','On foot.'],1,'他需要九点前到达，接受了乘坐地铁的建议。'),choice('Where is the underground station?',['Next to the museum.','Behind the bookstore.','Opposite the bank.'],2,'定位 opposite the bank。')]);
add('gk-02','gaokao','长对话','社团活动，临时改期',[
'Hi, Amy. Are we still meeting at the library on Friday afternoon to prepare for the science fair?',
'The library closes early on Friday. I have booked the art room for Saturday morning instead.',
'I have a swimming lesson until ten. Could we meet at half past ten?',
'Of course. Please bring the photos from our river project. I will bring the poster paper.',
'Great. Shall I ask David to join us?',
'Yes, he can explain the results. We should finish by noon.'
],[choice('When will they meet?',['Friday afternoon.','Saturday at ten.','Saturday at ten thirty.'],2,'原定周五，改为周六上午十点半。'),choice('What should the boy bring?',['Project photos.','Poster paper.','Swimming equipment.'],0,'男生负责带河流项目的照片。'),choice('Why will David join them?',['To book a room.','To explain the results.','To take photos.'],1,'听到 he can explain the results。')]);
add('gk-03','gaokao','独白','校园志愿服务通知',[
'Good morning, everyone. Our school will hold a book sale this Sunday to raise money for the town animal shelter. The sale starts at ten in the school garden. If it rains, we will move into the sports hall. Volunteers should arrive at nine to arrange the tables. Please do not bring textbooks with missing pages. We need storybooks, travel books and magazines in good condition. Last year we raised six hundred pounds. This year our goal is eight hundred. If you would like to help, speak to Ms Green before Thursday.'
],[choice('What is the purpose of the sale?',['To support an animal shelter.','To buy school computers.','To repair a sports hall.'],0,'开头说明募集资金支持动物收容所。'),choice('When should volunteers arrive?',['At eight.','At nine.','At ten.'],1,'活动十点开始，志愿者九点到。'),choice('What is this year\'s target?',['£600.','£700.','£800.'],2,'今年目标八百英镑，六百是去年的数字。')]);
add('c4-01','cet4','短篇新闻','社区图书馆延长开放',[
'A public library in Westford has introduced evening opening hours after residents requested more flexible access. From Monday, the library will remain open until nine on weekdays, two hours later than before. The change is part of a six month trial funded by the local council. Library staff say they hope the new hours will benefit students and people who work during the day. Weekend hours will stay the same. The council will review visitor numbers before deciding whether to continue the scheme.'
],[choice('Why has the library changed its hours?',['To reduce energy costs.','To respond to local demand.','To train new staff.','To host weekend concerts.'],1,'居民请求更灵活的开放时间。'),choice('What will determine whether the scheme continues?',['Visitor numbers.','Book prices.','Student exam scores.','The number of volunteers.'],0,'委员会将查看访客数量再决定。')]);
add('c4-02','cet4','长对话','第一次实习如何安排',[
'I have just received an offer for a summer internship at a small publishing company.',
'Congratulations. Will you be editing books?',
'Not at first. I will help the marketing team analyse reader surveys. They said I could spend one afternoon a week with the editors.',
'That should help you decide what to do after graduation. How long does the internship last?',
'Eight weeks. I wanted twelve, but the company closes for two weeks in August. The office is near the train station, so I will not need to rent a room.',
'You should ask for regular feedback. That was the most useful part of my internship last year.'
],[choice('What will the woman mainly do?',['Edit textbooks.','Design book covers.','Analyse reader surveys.','Organise train schedules.'],2,'主要工作是为市场团队分析读者调查。'),choice('What does the man recommend?',['Asking for feedback.','Renting a flat.','Working for twelve weeks.','Changing companies.'],0,'末句明确建议定期获得反馈。')]);
add('c4-03','cet4','听力篇章','小习惯带来的改变',[
'When students plan to improve their study habits, they often set goals that are too ambitious. A plan to study for three hours every night may work for a few days, but it can be difficult to maintain. A more practical approach is to start with a short activity linked to an existing routine. For example, review five words after breakfast. The familiar routine acts as a reminder. Once the activity becomes easy, increase it gradually. Keeping a simple record can also help. The purpose of the record is not to punish yourself for missing a day, but to notice patterns and make realistic adjustments.'
],[choice('What problem is mentioned at the beginning?',['Students lack textbooks.','Students choose unrealistic goals.','Breakfast takes too long.','Schools give too little homework.'],1,'开头指出目标过于宏大而难以坚持。'),choice('What is the purpose of keeping a record?',['To compare with classmates.','To avoid breakfast.','To punish missed days.','To identify patterns and adjust.'],3,'最后一句强调观察规律并合理调整。')]);
add('c6-01','cet6','长对话','研究项目为什么延期',[
'Your survey on remote working was supposed to be finished this month. Has the deadline changed?',
'Yes. We initially recruited participants through technology companies, but that produced a sample with very similar backgrounds.',
'So the issue was representativeness rather than the number of responses?',
'Exactly. We had plenty of responses, but could not confidently extend our conclusions to other industries. We are now recruiting through hospitals and local government offices.',
'Will you have to redesign the questionnaire?',
'Only slightly. We are keeping the core questions so that the results remain comparable. The additional recruitment will take another six weeks.'
],[choice('Why was the project delayed?',['There were no responses.','The sample lacked diversity.','The questionnaire was lost.','Funding was withdrawn.'],1,'样本背景过于相似，影响代表性。'),choice('Why retain the core questions?',['To reduce printing costs.','To satisfy technology companies.','To preserve comparability.','To avoid collecting more data.'],2,'保留核心问题是为了使结果可比。')]);
add('c6-02','cet6','听力篇章','城市树木与热岛效应',[
'Urban trees are often promoted as a simple solution to rising temperatures. Their leaves provide shade, while evaporation from the leaf surface cools the surrounding air. However, the benefits are not distributed equally. Wealthier neighbourhoods frequently have denser tree cover than areas with lower incomes. Planting programmes therefore need to consider social equity as well as total numbers. Another challenge is maintenance. A young tree placed in a narrow pavement may struggle if its roots lack space or its soil dries out. Successful programmes budget for years of care, rather than treating planting day as the end of the project.'
],[choice('What inequality does the speaker identify?',['Tree cover differs across income groups.','Rural areas have no trees.','All trees need the same care.','Only tall trees provide shade.'],0,'高收入社区通常树冠覆盖更密集。'),choice('What does the speaker recommend?',['Plant only on narrow pavements.','Focus exclusively on planting numbers.','Avoid public planting programmes.','Plan for long-term maintenance.'],3,'种植后仍需多年养护预算。')]);
add('c6-03','cet6','讲座 / 讲话','相关性并不等于因果',[
'Today we are considering a common error in interpreting research: assuming that because two things occur together, one causes the other. Imagine a study finds that people who visit museums report higher levels of wellbeing. It may be tempting to conclude that museum visits directly improve mental health. Yet visitors may also have more free time or stronger social networks, and these factors could influence wellbeing. Researchers call such factors confounding variables. Randomised experiments can reduce some of these problems, but they are not always practical or ethical. In observational research, transparency about limitations is therefore essential. A cautious conclusion is often more scientifically valuable than a dramatic one.'
],[choice('What is the lecture mainly about?',['How museums sell tickets.','Why experiments always fail.','The limits of causal claims.','How to increase free time.'],2,'通过博物馆案例说明相关不能直接推出因果。'),choice('What are free time and social networks examples of?',['Confounding variables.','Random assignments.','Research outcomes.','Ethical violations.'],0,'这些额外因素可能影响幸福感，属于混杂变量。')]);
add('ie-01','ielts','Part 1 · 表格填空','社区摄影课程报名',[
'Good afternoon, Riverside Centre. How can I help you?',
'I would like to join the photography course. Does it start in June?',
'The beginners course starts on the twelfth of July. It runs on Thursday evenings, from six thirty until eight.',
'That works for me. How much does it cost?',
'The full course costs eighty pounds, including the printed handbook. You need to bring your own camera.',
'And where are the classes held?',
'In the studio on the second floor. To book a place, please leave your surname and phone number.'
],[fill('Course day: ______ (ONE WORD ONLY)','Thursday','定位 Thursday evenings。'),fill('Fee: £______ (ONE NUMBER ONLY)',['80','eighty'],'课程总价为 eighty pounds。'),fill('Bring your own ______ (ONE WORD ONLY)','camera','手册包含在费用中，相机需自备。')]);
add('ie-02','ielts','Part 2 · 匹配','第一次参观社区中心',[
'Welcome to the new community centre. Let me tell you about three of our rooms. The garden room is our quiet space, reserved for reading and individual study. The windows overlook the courtyard, but please do not hold group meetings there. The workshop room contains large tables and washable floors, making it suitable for painting and other practical activities. Finally, the terrace room has a projector and seating for sixty people. We use it mainly for public talks. All rooms can be booked online, though the workshop room requires a small deposit.'
],[{kind:'match',prompt:'Garden room 对应哪项用途？',options:['Practical art activities','Public talks','Quiet individual study','Sports training'],answer:2,why:'garden room 是阅读与个人学习的安静空间。'},{kind:'match',prompt:'Workshop room 对应哪项用途？',options:['Practical art activities','Public talks','Quiet individual study','Sports training'],answer:0,why:'大桌子与易清洗地板适合绘画等实践活动。'},{kind:'match',prompt:'Terrace room 对应哪项用途？',options:['Practical art activities','Public talks','Quiet individual study','Sports training'],answer:1,why:'配备投影仪，主要用于公共讲座。'}]);
add('ie-03','ielts','Part 3 · 多项选择','学生讨论调查设计',[
'We need to decide how to collect feedback on the university recycling programme. I was thinking of an online questionnaire.',
'That would reach a lot of students, but people may ignore it. What about interviewing students in the cafeteria?',
'We would mainly hear from people who eat on campus. That could bias the sample.',
'True. We could combine a short online questionnaire with interviews in several locations, including the library and sports centre.',
'I agree. We should also test the questionnaire on a small group before sending it out. Some questions may be unclear.',
'Yes, but let us keep names optional. Students might give more honest answers if they can remain anonymous.'
],[{kind:'multi',prompt:'Which TWO actions do the students agree to take?',options:['Interview only cafeteria users.','Use a combination of methods.','Make names compulsory.','Pilot the questionnaire.','Cancel all interviews.'],answer:[1,3],why:'同意结合问卷与多地点访谈，并先做小规模测试。'},choice('Why keep names optional?',['To reduce printing.','To encourage honest answers.','To shorten interviews.'],1,'匿名可能鼓励更诚实的回答。')]);
add('ie-04','ielts','Part 4 · 笔记填空','城市湿地的生态作用',[
'This lecture introduces urban wetlands. These habitats serve several functions that are sometimes overlooked in city planning. First, wetland vegetation slows the movement of water, reducing the risk of flooding after heavy rain. Second, the soil and plants can trap pollutants, although this does not remove the need to control pollution at its source. Wetlands also provide a habitat for birds and insects. When creating a wetland, designers must pay attention to water depth. A variety of depths supports a wider range of species. Long-term monitoring is necessary, because a site that looks attractive may not yet be functioning as a healthy ecosystem.'
],[fill('Wetlands reduce the risk of ______. (ONE WORD ONLY)','flooding','植被减缓水流，降低洪水风险。'),fill('Designers should vary water ______. (ONE WORD ONLY)','depth','不同水深支持更广泛的物种。'),fill('Long-term ______ is needed. (ONE WORD ONLY)','monitoring','最后指出要进行长期监测。')]);
add('tf-01','toefl','Listen and Choose a Response','一句话，选出恰当回应',[
'Would you mind sending me the revised schedule before noon?'
],[choice('Choose the most appropriate response.',['The meeting was quite useful.','Not at all. I will email it this morning.','Yes, the building has two floors.','I usually eat lunch at twelve.'],1,'对礼貌请求作出同意，并承诺上午发送。')]);
add('tf-02','toefl','Conversation','预约写作中心',[
'Hi, I need some help with my research paper. Can I book an appointment for this afternoon?',
'All of today\'s individual appointments are full, but there is a drop in workshop at three. You do not need to book.',
'Would someone be able to read my entire draft there?',
'The workshop focuses on organising an argument. For detailed feedback on a full draft, an individual appointment would be better. The next available slot is tomorrow at ten.',
'I will take that appointment. I can use today to check my references.'
],[choice('Why does the student visit the centre?',['To borrow research equipment.','To receive help with a paper.','To register for a degree.','To collect exam results.'],1,'学生希望研究论文得到帮助。'),choice('What will the student probably do tomorrow?',['Attend an individual appointment.','Lead a workshop.','Check references for the first time.','Cancel the paper.'],0,'选择预约明天十点的一对一辅导。')]);
add('tf-03','toefl','Announcement','实验室维护通知',[
'Attention, science students. The computer laboratory in Hall B will be closed on Wednesday morning while the network is upgraded. It will reopen at two in the afternoon. If you need to use specialist software before then, computers in the engineering library have temporary access. Please save all work before leaving the laboratory on Tuesday evening. Files stored only on the desktop may be removed during maintenance. For assistance, contact the help desk by email rather than telephone, as the phone system will also be unavailable.'
],[choice('What is the main purpose of the announcement?',['To recruit laboratory staff.','To introduce a new course.','To explain a temporary closure.','To announce exam grades.'],2,'说明维护关闭及替代安排。'),choice('What are students advised to do?',['Call the help desk.','Save their files before maintenance.','Use Hall B on Wednesday morning.','Remove specialist software.'],1,'维护前保存工作，桌面文件可能被移除。')]);
add('tf-04','toefl','Academic Talk','动物如何在城市适应',[
'Urban environments offer an interesting setting for studying animal behaviour. Consider birds that live near busy roads. Traffic noise is strongest at lower frequencies, which can interfere with communication. Some birds respond by singing at a higher pitch. Others shift the timing of their songs to quieter periods. These changes may help individuals find mates or defend territory. However, a change in behaviour is not necessarily a genetic adaptation. An individual bird may adjust its song within its lifetime. To establish evolutionary change, researchers would need evidence that relevant traits are inherited across generations.'
],[choice('Why might urban birds sing at a higher pitch?',['To compete with low-frequency traffic noise.','To imitate humans.','To reduce the number of songs.','To avoid defending territory.'],0,'交通低频噪声干扰交流，升高音调可避开干扰。'),choice('What distinction does the speaker emphasise?',['Roads and buildings.','Mates and territory.','Song length and volume.','Behavioural adjustment and inherited change.'],3,'个体一生中的行为调整不等于跨代遗传的演化。')]);
add('pg-01','postgrad','复试 · 研究经历','理解一段研究自述',[
'During my final year, I investigated how students choose sources for academic writing. I interviewed twelve volunteers and asked them to explain why they trusted particular websites. One finding was that a professional appearance often influenced trust more than the author\'s qualifications. The project was small, so I would not claim that the results apply to all students. If I continued the research, I would recruit participants from different disciplines and compare interviews with observations of their actual search behaviour.'
],[choice('What did the project investigate?',['How students choose academic sources.','How teachers grade essays.','How websites set prices.','How universities recruit staff.'],0,'研究主题是学生如何选择学术写作信息源。'),choice('What limitation does the speaker acknowledge?',['No interviews were conducted.','The sample was small.','All websites were unavailable.','The project had no research question.'],1,'只有十二名志愿者，因此不把结果推广到全部学生。'),choice('What would the speaker add in future research?',['More website advertisements.','A compulsory writing test.','Observation of actual searches.','Only participants from one discipline.'],2,'将访谈与真实搜索行为观察结合。')]);
add('pg-02','postgrad','复试 · 学术理解','听懂学术观点与限制',[
'When evaluating an educational intervention, an improvement in test scores is useful evidence, but it is not sufficient on its own. Students may improve simply because they have become familiar with the test. A comparison group can help researchers separate this practice effect from the impact of the intervention. It is also important to examine whether the improvement lasts. A test administered immediately after a course may produce different results from one taken three months later. For this reason, my proposed study includes both a comparison group and a delayed assessment.'
],[choice('Why is a comparison group useful?',['To remove all costs.','To distinguish practice effects.','To avoid giving tests.','To increase course length.'],1,'对照组帮助区分熟悉测试所带来的练习效应。'),choice('Why include a delayed assessment?',['To check whether gains persist.','To replace the comparison group.','To make the test easier.','To avoid analysing results.'],0,'延后测试检验学习提升能否持续。')]);
fs.writeFileSync('data/listening.json',JSON.stringify(items,null,2));console.log(`${items.length} original passages; ${items.reduce((n,i)=>n+i.questions.length,0)} questions`);
