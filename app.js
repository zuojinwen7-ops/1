/* No account, tracking, CDN, or remote requests. All learning data stays in this browser. */
(() => {
  'use strict';
  const D = window.STUDY_DATA;
  const KEY = 'shiji-cfa-v1';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const DAY = 86400000;
  const fmtDate = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'});
  const today = () => { const p=fmtDate.formatToParts(new Date());return ['year','month','day'].map(k=>p.find(x=>x.type===k).value).join('-'); };
  const stamp = s => Date.parse(s+'T00:00:00Z');
  const addDays = (s,n) => new Date(stamp(s)+n*DAY).toISOString().slice(0,10);
  const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(stamp(s)) && new Date(stamp(s)).toISOString().slice(0,10)===s;
  const shortDate = s => `${Number(s.slice(5,7))} 月 ${Number(s.slice(8,10))} 日`;
  const defaults = () => ({version:1,examDate:'2026-11-11',hours:4,tasks:{},attempts:[],vocab:{},questionReview:{},notes:{},questionNotes:{},reviewed:{}});
  let storageOK = true;
  let state = defaults();
  function normalize(raw) {
    if (!raw || typeof raw!=='object' || raw.version!==1) throw new Error('不支持的备份格式');
    const base=defaults();
    if (!validDate(raw.examDate) || ![2,4,6].includes(Number(raw.hours))) throw new Error('考试日期或学习时间格式不正确');
    base.examDate=raw.examDate;base.hours=Number(raw.hours);
    const record = v => v && typeof v==='object' && !Array.isArray(v) ? v : {};
    const taskIds=new Set(D.days.flatMap(d=>d.tasks.map(t=>t.id)));
    for(const [day,value] of Object.entries(record(raw.tasks))) if(validDate(day) && Array.isArray(value)) base.tasks[day]=[...new Set(value.filter(x=>taskIds.has(x)))].slice(0,60);
    const ids = new Set((D?.questions||[]).map(q=>q.id));
    base.attempts=(Array.isArray(raw.attempts)?raw.attempts:[]).filter(a=>a && ids.has(a.questionId) && typeof a.correct==='boolean' && Number.isInteger(a.choice) && a.choice>=0 && a.choice<3 && typeof a.at==='string' && Number.isFinite(Date.parse(a.at))).slice(-2000).map(a=>({questionId:a.questionId,correct:a.correct,choice:a.choice,at:a.at,cause:['concept','english','calculation','careless'].includes(a.cause)?a.cause:null}));
    for(const kind of ['vocab','questionReview']) {
      const validIds=new Set((kind==='vocab'?D.vocabulary:D.questions).map(x=>x.id));
      for(const [id,r] of Object.entries(record(raw[kind]))) if(validIds.has(id) && r && validDate(r.due)) base[kind][id]={due:r.due,reps:Math.max(0,Math.min(10,Number(r.reps)||0)),last:validDate(r.last)?r.last:today()};
    }
    for(const kind of ['notes','questionNotes']) for(const [id,note] of Object.entries(record(raw[kind]))) if(typeof note==='string' && (kind==='notes'?D.topics.some(t=>t.id===id):ids.has(id))) base[kind][id]=note.slice(0,10000);
    for(const [id,r] of Object.entries(record(raw.reviewed))) if(D.topics.some(t=>t.id===id) && r && validDate(r.due)) base.reviewed[id]={due:r.due,last:validDate(r.last)?r.last:today(),reps:Math.max(1,Math.min(10,Number(r.reps)||1))};
    return base;
  }
  if (!D || !D.topics?.length || !D.days?.length) { $('#main').innerHTML='<div class="card empty-state"><h1>学习资料未能加载</h1><p>请确认 index.html、app.js、styles.css 与 study-data.js 放在同一个文件夹，然后重新打开。</p></div>';return; }
  try { const saved=localStorage.getItem(KEY);if(saved)state=normalize(JSON.parse(saved)); } catch(e) {storageOK=false;}
  const topic = id => D.topics.find(t=>t.id===id) || D.topics[0];
  const question = id => D.questions.find(q=>q.id===id);
  const planStart = () => addDays(state.examDate,-19);
  const dateForDay = n => addDays(planStart(),n-1);
  const remaining = () => Math.round((stamp(state.examDate)-stamp(today()))/DAY);
  const currentDay = () => Math.max(1,Math.min(20,20-remaining()));
  const tasksFor = n => (state.tasks[dateForDay(n)] || []).filter(id=>D.days[n-1].tasks.some(t=>t.id===id));
  const completedDays = () => D.days.filter(d=>tasksFor(d.day).length>=d.tasks.length).length;
  const latest = () => { const map={};for(const a of state.attempts)map[a.questionId]=a;return map; };
  const wrongIds = () => Object.values(latest()).filter(a=>!a.correct).map(a=>a.questionId);
  const dueVocab = () => D.vocabulary.filter(v=>state.vocab[v.id]?.due<=today());
  const dueQuestions = () => D.questions.filter(q=>state.questionReview[q.id]?.due<=today());
  const dueLessons = () => D.topics.filter(t=>state.reviewed[t.id]?.due<=today());
  const dueCount = () => dueVocab().length+dueQuestions().length+dueLessons().length;
  const blocksFor = d => {
    if(d.day>=19)return d.blocks;
    if(d.day===16||d.day===17)return d.blocks.map((b,i)=>({...b,minutes:i===1?b.minutes+Math.max(0,state.hours-4)*60:b.minutes}));
    const target=state.hours*60,total=d.blocks.reduce((sum,b)=>sum+b.minutes,0);
    let used=0;
    return d.blocks.map((b,i)=>{const minutes=i===d.blocks.length-1?target-used:Math.round(b.minutes/total*target);used+=minutes;return {...b,minutes};});
  };
  const minutesFor = d => blocksFor(d).reduce((sum,b)=>sum+b.minutes,0);
  const hoursLabel = d => {const m=minutesFor(d);return m%60===0 ? `${m/60} 小时`:`${Math.floor(m/60)} 小时 ${m%60} 分钟`;};
  let currentPage='today', activeTopic=null, topicFilter='all', vocabFilter='all', englishTab='words', vocabSearch='', knowledgeSearch='';
  let revealed=new Set(), quiz=null, toastId=null, noteTimer=null;
  const timer={seconds:1500,running:false,end:0,interval:null,minutes:25};
  function toast(message) { $('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastId);toastId=setTimeout(()=>$('#toast').classList.remove('visible'),3500); }
  function save() {try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){storageOK=false;toast('浏览器未能保存进度，请到学习设置导出备份。');}updateNav();}
  function updateNav() { $$('#navigation a').forEach(a=>{const active=a.dataset.nav===currentPage;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});$('#wrong-dot').hidden=!wrongIds().length; }
  const btn = (text,action,style='primary-btn',extra='',ic='arrow') => `<button class="${style}" data-action="${action}" ${extra}>${esc(text)}${ic?icon(ic):''}</button>`;
  function heading(title,sub,eyebrow='YOUR PERSONAL STUDY SPACE',action='focus') {return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${action==='focus'?btn(timer.running?'正在专注':'专注 25 分钟','focus','outline-btn','', 'clock'):btn('学习设置','settings','outline-btn','','settings')}</div>`;}
  function empty(title,text,action,textButton) {return `<div class="card empty-state">${icon('leaf')}<h3>${title}</h3><p>${text}</p>${action?btn(textButton,action):''}</div>`;}
  function tasksHTML(d,compact=false) {
    const completed=tasksFor(d.day);
    return d.tasks.map((t,i)=>`<label class="task ${completed.includes(t.id)?'done':''}"><input type="checkbox" data-task="${t.id}" data-day="${d.day}" ${completed.includes(t.id)?'checked':''}><span class="task-copy"><span class="task-title">${esc(t.text)}</span>${!compact?`<span class="task-detail">${['先独立尝试，再对照材料','理解之后，用一个例子检验','合上材料，回忆并复述'][i]}</span>`:''}</span><span class="duration-pill">${String(i+1).padStart(2,'0')}</span></label>`).join('');
  }
  function topicCard(t) {const seen=!!state.reviewed[t.id];return `<button class="card topic-card" data-action="topic" data-id="${t.id}"><div class="topic-card-top"><span class="topic-emoji">${icon(t.id==='ethics'?'leaf':t.id==='fsa'?'book':'target')}</span><span class="topic-weight">参考权重 ${t.weight}</span></div><h3>${esc(t.name)}</h3><div class="english-name">${esc(t.en)}</div><p>${esc(t.description)}</p><div class="topic-card-bottom"><span>${seen?'已学 · 等待回忆复习':'基础入门 · 中文讲解'}</span>${icon('arrow')}</div></button>`;}
  function adjustmentHTML() {
    const wrong=Object.values(latest()).filter(a=>!a.correct);
    if(!wrong.length)return '';
    const topicCounts={},causeCounts={};for(const a of wrong){const id=question(a.questionId).topic;topicCounts[id]=(topicCounts[id]||0)+1;if(a.cause)causeCounts[a.cause]=(causeCounts[a.cause]||0)+1;}
    const weak=Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]||topic(b[0]).max-topic(a[0]).max)[0][0];
    const cause=Object.entries(causeCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];
    const instruction=({english:'先圈 most / least / except 和单位，逐句对照中文，再遮住中文重读。',calculation:'先写已知量、百分号与时间单位，用一个小数字例子检查，再重新计算。',careless:'慢下来圈出题目的限定词和所问变量，讲明白为什么另外两项不对。',concept:'先回看一个基础例子，合上材料用中文复述，再独立重做。'})[cause||'concept'];
    return `<section class="card adjustment"><div><div class="eyebrow">YOUR NEXT SMALL STEP</div><h3>接下来 20 分钟，先补${esc(topic(weak).name)}。</h3><p>${instruction}</p><span>依据目前 ${wrong.length} 道未修复基础错题，样本有限，仅作补漏建议；不替你跳过其他科目。</span></div>${btn('回到这个概念','topic','light-btn',`data-id="${weak}"`,'arrow')}</section>`;
  }
  function todayPage() {
    const n=currentDay(),d=D.days[n-1],done=tasksFor(n).length,word=D.vocabulary[(n-1)%D.vocabulary.length],count=remaining(),phase=n<=6?1:n<=15?2:3;
    const total=Object.keys(latest()).length,uniqueCorrect=Object.values(latest()).filter(a=>a.correct).length;
    let dateNotice='';
    if(count<0)dateNotice=`<div class="notice">${icon('info')}<span>设置中的考试日期已过去。你仍可使用资料和练习，或在学习设置中更新日期。</span></div>`;
    if(count>19)dateNotice=`<div class="notice green">${icon('info')}<span>20 天路线将于 ${shortDate(planStart())} 开始。现在可提前打基础，完成记录按计划日期保存。</span></div>`;
    return `${heading(n===20&&count===0?'今天，稳稳地去考试。':'给努力一个清晰的方向',`每天 ${state.hours} 小时，中文理解 + 英文识题，一步一步建立信心。`,'HELLO, FUTURE CANDIDATE')}${!storageOK?'<div class="notice">浏览器本地存储不可用或旧数据读取失败，请定期在学习设置中导出备份。</div>':''}${dateNotice}
    <section class="hero" aria-label="考试倒计时"><div class="hero-copy"><div class="eyebrow">CFA LEVEL I · YOUR 20-DAY JOURNEY</div><h2>把每一天，<br>学得更有底。</h2><p>不必一次弄懂所有知识。<br>从一个概念、一道题、一个英文词开始。</p><div class="hero-tags"><span class="hero-pill">${icon('leaf')}基础友好 · 中文搭桥</span><span>${icon('clock')}每天 ${state.hours} 小时</span><span>${icon('calendar')}${shortDate(state.examDate)} 考试</span></div></div><div class="countdown"><div class="countdown-copy">你的下一站<strong>CFA 一级考试</strong>坚持的每一步，都算数</div><div class="countdown-ring"><svg viewBox="0 0 148 148" aria-hidden="true"><circle class="ring-base" cx="74" cy="74" r="66"/><circle class="ring-fill" cx="74" cy="74" r="66" style="stroke-dashoffset:${414.7*(1-Math.min(1,Math.max(0,20-count)/20))}"/></svg><div class="ring-center"><small>${count===0?'就在今天':count<0?'考试已过':'距离考试还有'}</small><span class="ring-number">${Math.abs(count)}<em>天</em></span><span>一步一步，向前走</span></div></div></div></section>
    <section class="stats-grid" aria-label="学习概况"><div class="stat"><div class="stat-icon">${icon('check')}</div><div><div class="stat-label">今日任务</div><div class="stat-value">${done}<span class="sub-value"> / ${d.tasks.length}</span></div><div class="stat-hint">完成一点，积累一点</div></div></div><div class="stat"><div class="stat-icon">${icon('clock')}</div><div><div class="stat-label">今日计划时长</div><div class="stat-value">${Math.round(minutesFor(d)/60*10)/10}<small>小时</small></div><div class="stat-hint">${n>=19?'考前减量，给大脑恢复':'含英语、伦理与错题复盘'}</div></div></div><div class="stat"><div class="stat-icon">${icon('refresh')}</div><div><div class="stat-label">到期复习</div><div class="stat-value">${dueCount()}<small>项</small></div><div class="stat-hint">间隔 1 / 3 / 7 天巩固记忆</div></div></div><div class="stat"><div class="stat-icon">${icon('target')}</div><div><div class="stat-label">基础题答对</div><div class="stat-value">${uniqueCorrect}<span class="sub-value"> / ${total}</span></div><div class="stat-hint">按每道题最近一次作答统计</div></div></div></section>
    <div class="dashboard-grid"><section class="card today-card"><div class="card-header"><div><h2 class="section-title">今天，先做好这三件事</h2><p class="card-subtitle">${shortDate(dateForDay(n))} · ${esc(d.focus)}</p></div><span class="day-label">DAY ${String(n).padStart(2,'0')}</span></div><div class="today-topic"><span class="topic-square">${String(n).padStart(2,'0')}</span><div><h3>${esc(d.title)}</h3><p>${d.topics.map(id=>esc(topic(id).name)).join(' · ')}${d.topics.length?' · ':''}${hoursLabel(d)}</p></div></div><div class="task-list">${tasksHTML(d,true)}</div><div class="task-footer"><div class="task-progress"><span class="mini-track"><span style="width:${done/d.tasks.length*100}%"></span></span>${done}/${d.tasks.length} 已完成</div>${btn(done===d.tasks.length?'回顾今日安排':'开始今日学习','start-day','primary-btn',`data-day="${n}"`)}</div></section>
    <div class="right-column"><section class="card roadmap-card"><div class="card-header"><h2 class="section-title">一条适合你的路线</h2>${btn('全览','go-plan','text-btn','','chevron')}</div><div class="roadmap">${[[1,'01–06','打好地基','基础数学 · 财报 · 核心词'],[2,'07–15','抓住主干','高权重科目 · 混合练习'],[3,'16–20','模拟与收拢','查漏补缺 · 轻复习 · 考试']].map(([p,days,title,desc])=>`<div class="roadmap-step ${phase===p?'current':''}"><span class="step-dot">${p}</span><div><h4>${title}<span>D${days}</span></h4><p>${desc}</p></div></div>`).join('')}</div><div class="roadmap-hint">优先级依据近年科目权重与先修关系，<br>不是押题，也不承诺通过。</div></section><section class="card daily-word"><div class="word-heading"><span>${icon('language')}每天认识一个词</span><span>${String(n).padStart(2,'0')} / 20</span></div><h3 lang="en">${esc(word.en)}</h3><p>${esc(word.zh)}</p><div class="word-example" lang="en">${esc(word.sentence)}</div>${btn('去英语角练一练','go-english','text-btn','','arrow')}</section></div></div>
    ${dueCount()?`<section class="notice green" style="margin-top:22px;margin-bottom:0">${icon('refresh')}<div>今天有 ${dueVocab().length} 个单词、${dueQuestions().length} 道题和 ${dueLessons().length} 个概念到期。${dueVocab().length?btn('复习单词','due-words','text-btn','','arrow'):''} ${dueQuestions().length?btn('复习题目','review-quiz','text-btn','','arrow'):''} ${dueLessons().length?btn('复习概念','due-lessons','text-btn','','arrow'):''}</div></section>`:''}
    ${adjustmentHTML()}<section class="recommended"><div class="section-row"><h2>先从这些知识开始<small>理解比死记，更重要</small></h2>${btn('全部 10 个科目','go-knowledge','text-btn','','arrow')}</div><div class="topic-card-grid">${['quant','fsa','ethics'].map(id=>topicCard(topic(id))).join('')}</div></section><p class="bottom-note">${icon('info')}20 天属于压缩冲刺，本站提供入门支架，不能替代完整课程与官方题库。基础题正确率不代表通过概率。优先保睡眠，每天闭卷回忆。</p>`;
  }
  function planPage() {
    const complete=completedDays(),n=currentDay();
    return `${heading('20 天，每一天都知道做什么。',`${shortDate(planStart())} — ${shortDate(state.examDate)} · 已完成 ${complete} / 20 天 · 默认每天 ${state.hours} 小时`,'A PLAN YOU CAN ACTUALLY FOLLOW','settings')}<div class="notice green">${icon('leaf')}<span>按近年科目权重、先修关系和复习间隔安排。第 16、17 天分节模拟，第 19 天减量，第 20 天考试。每日伦理练习贯穿前 18 天；这是一份可调整的冲刺建议，不是通过保证。</span></div><div class="plan-list">${D.days.map(d=>`${[1,7,16].includes(d.day)?`<h2 class="phase-label">${d.day===1?'第一阶段 · 打好地基':d.day===7?'第二阶段 · 抓住主干':'第三阶段 · 模拟与收拢'}<span>${d.day===1?'DAY 01–06':d.day===7?'DAY 07–15':'DAY 16–20'}</span></h2>`:''}<article class="card plan-day ${d.day===n?'is-today':''}"><div class="plan-top"><span class="plan-number">DAY ${String(d.day).padStart(2,'0')}</span><time datetime="${dateForDay(d.day)}">${shortDate(dateForDay(d.day))}</time><span class="status-pill ${tasksFor(d.day).length===d.tasks.length?'complete':d.day===n?'current':''}">${tasksFor(d.day).length===d.tasks.length?'已完成':d.day===n?'今日计划':`${tasksFor(d.day).length}/${d.tasks.length} 项`}</span></div><h3>${esc(d.title)}</h3><p class="small muted">${esc(d.focus)}</p><div class="plan-tags">${d.topics.map(id=>`<span>${esc(topic(id).name)}</span>`).join('')}${d.day>=19?'<span>减量与恢复</span>':''}</div><div class="plan-bottom"><span class="small muted">${icon('clock')} ${hoursLabel(d)}</span>${btn('查看安排','day','text-btn',`data-day="${d.day}"`,'arrow')}</div></article>`).join('')}</div><div class="bottom-note">${icon('info')}若实际只剩不到 20 天，先做当天计划并补最薄弱的先修内容。不要为“补打卡”牺牲模拟复盘和睡眠。变更考试日期会整体平移计划，已有打卡按原日历日期保留。</div>`;
  }
  function knowledgePage() {
    if(activeTopic)return lessonPage(topic(activeTopic));
    const list=D.topics.filter(t=>(t.name+t.en+t.description).toLowerCase().includes(knowledgeSearch.toLowerCase()));
    return `${heading('先把概念，讲明白。','10 个科目 · 中文入门讲解 · 关键公式 · 一看就懂的小例子','UNDERSTAND BEFORE YOU MEMORIZE')}<div class="toolbar"><div class="filter-group">${btn('全部科目','all-lessons','chip',`aria-pressed="${topicFilter==='all'}"`,'')}${btn(`到期复习 ${dueLessons().length}`,'due-lessons','chip',`aria-pressed="${topicFilter==='due'}"`,'')}</div><label class="search">${icon('search')}<input id="knowledge-search" type="search" placeholder="搜索科目或概念" aria-label="搜索科目或概念" value="${esc(knowledgeSearch)}"></label></div><div class="knowledge-grid">${list.filter(t=>topicFilter!=='due'||state.reviewed[t.id]?.due<=today()).map((t,i)=>`<button class="card knowledge-card" data-action="topic" data-id="${t.id}"><div class="knowledge-title"><span class="topic-square">${String(D.topics.indexOf(t)+1).padStart(2,'0')}</span><div><h3>${esc(t.name)}</h3><p lang="en">${esc(t.en)}</p></div></div><p>${esc(t.description)}</p><div class="knowledge-footer"><span>${esc(t.priority)} · 参考权重 ${t.weight}</span><span>${state.reviewed[t.id]?'已学 · 再回忆':'开始理解'} →</span></div></button>`).join('')||empty('这里暂时没有内容',topicFilter==='due'?'还没有到期的概念。学完一个科目后标记回忆，明天会再见。':'换一个关键词试试。')}</div><p class="bottom-note">${icon('info')}权重为近年公开参考，未在线核验当前考季；以你报名年份的官方考纲为准。此处为入门提纲，不覆盖完整学习目标（LOS）。</p>`;
  }
  function expandedLesson(t) {
    return (t.sections||[]).map(s=>`<section class="lesson-section teaching-section"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></section>`).join('');
  }
  function selfCheckHTML(t) {
    return `${t.pitfalls?.length?`<section class="lesson-section"><h3>最容易混淆的地方</h3><div class="pitfalls">${t.pitfalls.map(p=>`<p>${icon('info')}${esc(p)}</p>`).join('')}</div></section>`:''}${t.selfCheck?`<section class="lesson-section"><h3>轮到你了：先自己想一想</h3><div class="self-check"><p>${esc(t.selfCheck.prompt)}</p><details><summary>想好之后，展开答案与步骤</summary><p>${esc(t.selfCheck.answer)}</p></details></div></section>`:''}`;
  }
  function lessonPage(t) {
    const review=state.reviewed[t.id];
    return `${heading(esc(t.name),`${esc(t.en)} · 参考权重 ${t.weight}`,'ONE CONCEPT AT A TIME')}${btn('返回全部科目','back-lessons','text-btn','','')}<article class="card lesson"><div class="lesson-heading"><div><h2>${esc(t.name)}</h2><p>${esc(t.description)}</p></div><span class="status-pill">${esc(t.priority)}</span></div>${expandedLesson(t)}<section class="lesson-section"><h3>先理解这几件事</h3><ol class="takeaways">${t.takeaways.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section><section class="lesson-section"><h3>核心公式 / 判断顺序</h3><div class="formula-box">${esc(t.formula)}</div></section><section class="lesson-section"><h3>用一个小例子试试看</h3><div class="example-box">${esc(t.example)}</div></section>${selfCheckHTML(t)}<section class="lesson-section"><h3>本章英文，先认识这些</h3><div class="vocab-inline">${D.vocabulary.filter(v=>v.topic===t.id).slice(0,7).map(v=>`<span>${esc(v.en)} · ${esc(v.zh)}</span>`).join('')}</div></section><section class="lesson-section"><h3>合上材料，用你自己的话说一遍</h3><p class="small muted" style="margin-bottom:12px">定义是什么？什么时候用？能不能自己算出例子？写一句就好。</p><textarea class="note-input" data-note="${t.id}" aria-label="${esc(t.name)}的学习笔记" placeholder="例如：现值就是未来的钱折算到今天值多少……">${esc(state.notes[t.id]||'')}</textarea><p class="form-hint">自动保存在此浏览器。标记回忆后，会按 1 / 3 / 7 天提醒复习。</p></section><div class="lesson-actions"><div>${btn('我能闭卷复述，安排复习','learned','light-btn',`data-id="${t.id}"`,'check')}${review?`<p class="form-hint">下次回忆：${shortDate(review.due)}</p>`:''}</div>${btn('做几道本章题','topic-quiz','primary-btn',`data-id="${t.id}"`)}</div></article><p class="bottom-note">${icon('info')}本页是第一层理解。读完后仍需用所报考年份的官方学习目标、教材和题库补齐内容。</p>`;
  }
  function practicePage() {
    if(quiz)return quiz.finished?resultPage():questionPage();
    const last=Object.values(latest()),wrong=wrongIds();
    return `${heading('先独立作答，再读懂为什么。','每一道错题，都是下一步该学什么的线索。','PRACTICE WITH A PURPOSE')}<div class="notice">${icon('info')}<span>本站共 ${D.questions.length} 道原创基础题，帮助理解概念和英文题干，不是完整题库或全真模拟。请使用官方 Learning Ecosystem 中与你考季匹配的练习与模拟卷。</span></div><div class="card practice-stats"><div><strong>${last.length}</strong><span>已尝试的不同题目</span></div><div><strong>${last.filter(a=>a.correct).length}</strong><span>最近作答正确</span></div><div><strong>${wrong.length}</strong><span>待修复错题</span></div><div><strong>${dueQuestions().length}</strong><span>今日到期复习</span></div></div><div class="quiz-modes">${[['diagnostic','target','先找起点 · 8 道基础题','概念、英语还是计算？做完再决定先补什么。'],['mixed','edit','交错巩固 · 12 道混合题','练习识别科目和判断方法，逐步减少中文依赖。'],['wrong','refresh',`重做错题 · ${wrong.length} 道`,'答对后移出待修复列表，并安排间隔复习。'],['review','calendar',`到期复习 · ${dueQuestions().length} 道`,'先回忆后看解析；还没到期也可以练习。']].map(([mode,ic,title,desc])=>`<button class="card quiz-mode" data-action="quiz" data-mode="${mode}"><span class="topic-square">${icon(ic)}</span><span><h3>${title}</h3><p>${desc}</p></span>${icon('chevron')}</button>`).join('')}</div><section class="recommended"><div class="section-row"><h2>按科目练一练</h2><span class="small muted">中文可收起 · 每题 3 个选项</span></div><div class="filter-group">${D.topics.map(t=>btn(t.name,'topic-quiz','chip',`data-id="${t.id}"`,'')).join('')}</div></section><section class="recommended"><div class="section-row"><h2>我的错题本</h2><span class="small muted">保存最近一次错误及错因</span></div><div class="wrong-list">${wrong.length?wrong.map(id=>{const q=question(id),a=latest()[id];return `<article class="card wrong-item"><div><small>${esc(topic(q.topic).name)} · ${esc(({concept:'概念没懂',english:'英文没读懂',calculation:'计算出错',careless:'审题疏漏'})[a.cause]||'尚未标记错因')}</small><p>${esc(q.stem)}</p>${state.questionNotes[id]?`<small>笔记：${esc(state.questionNotes[id])}</small>`:''}</div>${btn('重新作答','single-quiz','light-btn',`data-id="${id}"`,'refresh')}</article>`;}).join(''):empty('暂时没有待修复错题','完成一次练习，答错的题目会自动出现在这里。')}</div></section>`;
  }
  function shuffle(items) {const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
  function startQuiz(mode,id) {
    let pool=D.questions;
    if(mode==='topic')pool=pool.filter(q=>q.topic===id);
    if(mode==='single')pool=pool.filter(q=>q.id===id);
    if(mode==='wrong')pool=pool.filter(q=>wrongIds().includes(q.id));
    if(mode==='review')pool=dueQuestions();
    if(!pool.length){toast(mode==='wrong'?'目前没有待修复错题。':'目前没有到期题目，可以先做混合练习。');return;}
    const selected=shuffle(pool).slice(0,mode==='diagnostic'?8:mode==='mixed'?12:pool.length);
    quiz={questions:selected,index:0,selected:null,submitted:false,results:[],finished:false,showChinese:true,mode};
    currentPage='practice';location.hash='practice';render();scrollTop();
  }
  function questionPage() {
    const q=quiz.questions[quiz.index],submitted=quiz.submitted,correct=quiz.selected===q.answer;
    return `${heading('一步一步，把题目读懂。','先圈问法和单位，独立思考；提交后再看解析。','PRACTICE, REFLECT, REPEAT')}<div class="quiz-layout"><section class="card quiz-card"><div class="quiz-top"><span class="quiz-topic">${icon('book')}${esc(topic(q.topic).name)}</span><span>${quiz.index+1} / ${quiz.questions.length} 题</span>${btn('退出练习','exit-quiz','text-btn','','')}</div><div class="quiz-track"><span style="width:${quiz.index/quiz.questions.length*100}%"></span></div><div class="question-label">ORIGINAL FOUNDATION QUESTION · 原创基础题</div><div class="question-en" lang="en">${esc(q.en||q.stem)}</div>${q.en?`<button class="text-btn" data-action="toggle-chinese">${quiz.showChinese?'收起中文，试着独立读题':'显示中文辅助'} ${quiz.showChinese?'↑':'↓'}</button><p class="question-zh" ${quiz.showChinese?'':'hidden'}>${esc(q.stem)}</p>`:''}<div class="option-list" role="group" aria-label="答案选项">${q.options.map((o,i)=>`<button class="option ${quiz.selected===i?'selected':''} ${submitted&&i===q.answer?'correct':''} ${submitted&&quiz.selected===i&&!correct?'incorrect':''}" data-action="option" data-index="${i}" aria-pressed="${quiz.selected===i}" ${submitted?'disabled':''}><span class="option-letter">${'ABC'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>${submitted?`<div class="answer-explanation ${correct?'':'wrong'}" role="status"><strong>${correct?'答对了，再确认一次理由。':`这道题先留下，正确答案是 ${'ABC'[q.answer]}。`}</strong>${esc(q.explanation)}<div class="vocab-inline">${(q.vocab||[]).map(v=>`<span>${esc(v)}</span>`).join('')}</div></div>${!correct?`<div class="lesson-section"><h3>这次主要卡在哪里？</h3><div class="filter-group">${[['concept','概念没懂'],['english','英文没读懂'],['calculation','计算出错'],['careless','审题疏漏']].map(([v,label])=>`<button class="chip ${latest()[q.id]?.cause===v?'active':''}" data-action="cause" data-cause="${v}">${label}</button>`).join('')}</div><textarea class="note-input" style="margin-top:12px;min-height:76px" data-question-note="${q.id}" aria-label="本题错因笔记" placeholder="用一句话写下，下次怎么避免……">${esc(state.questionNotes[q.id]||'')}</textarea></div>`:''}`:''}<div class="quiz-bottom"><span>${submitted?'本次作答已保存，可随时退出。':'不确定也先选一个，再通过解析找缺口。'}</span>${submitted?btn(quiz.index===quiz.questions.length-1?'查看本轮回顾':'下一题','next-question'):btn('提交答案','submit-answer','primary-btn',quiz.selected===null?'disabled':'','check')}</div></section><aside class="card quiz-side"><h3>读题的小步骤</h3><p>01 找 most / least / except<br>02 标出已知量和单位<br>03 想清概念，再计算<br>04 排除选项后作答</p><div class="divider"></div><h3>英语先搭桥</h3><p>现在可以看中文。熟悉之后，先收起中文，再试一次英文。词义只记与金融有关的用法。</p><div class="divider"></div><p>小样本基础题不能预测考试分数。真正的计时模拟，请使用完整模拟卷。</p></aside></div>`;
  }
  function submitAnswer() {
    if(!quiz || quiz.submitted || quiz.selected===null)return;
    const q=quiz.questions[quiz.index],correct=quiz.selected===q.answer;
    const attempt={questionId:q.id,correct,choice:quiz.selected,at:new Date().toISOString(),cause:null};
    state.attempts.push(attempt);state.attempts=state.attempts.slice(-2000);
    quiz.results.push({id:q.id,correct});quiz.submitted=true;
    if(!correct || state.questionReview[q.id]) schedule('questionReview',q.id,correct,false);
    save();render();
  }
  function resultPage() {
    const correct=quiz.results.filter(r=>r.correct).length,missed=quiz.results.filter(r=>!r.correct);
    return `${heading('认真复盘，比多做几题更有用。','把本轮最重要的一个缺口补上，再向前走。','A SMALL STEP, A CLEARER PICTURE')}<section class="card empty-state"><div class="score-ring"><strong>${correct}/${quiz.results.length}</strong><span>本轮答对</span></div><h3>${missed.length?'先把这几个地方补稳。':'基础练习完成，再练英文识题。'}</h3><p>${missed.length?missed.map(r=>topic(question(r.id).topic).name).filter((v,i,a)=>a.indexOf(v)===i).join(' · '):'试着合上解析，用自己的话讲一遍解题理由。'}</p><p class="result-note">这组题只用于入门诊断，难度、题量和覆盖面均不等同正式考试。${missed.length?'错题已收进错题本，并安排次日回顾。':'请继续使用官方考纲与完整题库补齐知识。'}</p><div class="result-actions">${btn('返回练习中心','exit-quiz','light-btn','','')}${missed.length?btn('重做待修复错题','wrong-quiz'):btn('看看金融英语','go-english')}</div></section>`;
  }
  function englishPage() {
    let list=D.vocabulary.filter(v=>(v.en+' '+v.zh+' '+v.meaning).toLowerCase().includes(vocabSearch.toLowerCase()));
    if(vocabFilter==='due')list=list.filter(v=>state.vocab[v.id]?.due<=today());
    if(vocabFilter==='new')list=list.filter(v=>!state.vocab[v.id]);
    return `${heading('英语先够用，再一点点变好。','不背大词表。先认识金融名词、问法、方向词和单位。','SMALL WORDS, BIG DIFFERENCE')}<div class="card english-intro"><div><h2>先读懂题目在问什么。</h2><p>每次 8–12 个新词：先看英文 → 自己回忆 → 翻面核对。<br>答得出来，再点“记住了”；按 1 / 3 / 7 天安排复习。</p></div>${icon('language')}</div><div class="filter-group english-tab"><button class="chip ${englishTab==='words'?'active':''}" data-action="english-tab" data-tab="words">金融词卡 · ${D.vocabulary.length} 个</button><button class="chip ${englishTab==='reading'?'active':''}" data-action="english-tab" data-tab="reading">拆句读题 · ${D.reading.length} 句</button></div>${englishTab==='reading'?`<div class="reading-grid">${D.reading.map(r=>`<article class="card reading-card"><h3>${esc(r.label)}</h3><p class="reading-en" lang="en">${esc(r.en)}</p><details><summary class="text-btn" style="margin-top:12px;cursor:pointer">展开中文与读题提示</summary><p class="reading-zh">${esc(r.zh)}</p><div class="reading-keywords">${r.keywords.map(k=>`<span>${esc(k)}</span>`).join('')}</div><p class="reading-tip">${esc(r.tip)}</p></details></article>`).join('')}</div>`:`<div class="toolbar"><div class="filter-group">${[['all','全部'],['new','还没学'],['due',`到期复习 ${dueVocab().length}`]].map(([v,label])=>`<button class="chip ${vocabFilter===v?'active':''}" data-action="word-filter" data-filter="${v}">${label}</button>`).join('')}</div><label class="search">${icon('search')}<input id="vocab-search" type="search" placeholder="搜索英文 / 中文" aria-label="搜索单词" value="${esc(vocabSearch)}"></label></div><div class="vocab-grid">${list.map(v=>{const open=revealed.has(v.id),r=state.vocab[v.id];return `<article class="card vocab-card"><div class="vocab-top"><span>${esc(topic(v.topic).name)}</span><span>${r?(r.due<=today()?'今天复习':`${shortDate(r.due)} 复习`):'新词'}</span></div><h3 lang="en">${esc(v.en)}</h3>${open?`<p class="zh">${esc(v.zh)}</p><p class="vocab-sentence" lang="en">${esc(v.sentence)}<em lang="zh-CN">${esc(v.meaning)}</em></p><div class="vocab-controls"><button data-action="word-again" data-id="${v.id}">还不熟</button><span>先回忆，再判断</span><button data-action="word-known" data-id="${v.id}">记住了 ${icon('check')}</button></div>`:`<button class="reveal-button" data-action="reveal" data-id="${v.id}">自己回忆一下，再点开释义</button><div class="vocab-controls"><span>${r?'让记忆再出现一次':'从一个词开始'}</span><span>点击翻面 ↗</span></div>`}</article>`;}).join('')||empty('这里暂时没有词卡',vocabFilter==='due'?'还没有到期的单词，先认识几个新词吧。':'换一个关键词，或查看全部词卡。')}</div>`}`;
  }
  function schedule(kind,id,known,notify=true) {
    const previous=state[kind][id];
    if(known && previous && previous.last===today() && previous.due>today()) {if(notify)toast('今天已经安排好了，按到期时间再复习更有效。');return;}
    const reps=known?(previous?.reps||0)+1:0;
    const gap=known?[1,3,7,14][Math.min(3,reps-1)]:1;
    state[kind][id]={due:addDays(today(),gap),last:today(),reps};
    if(notify)toast(known?`已安排 ${gap} 天后回忆复习。`:'不着急，明天再试一次。');
  }
  function render() {
    const labels={today:'今日学习',plan:'20 天冲刺计划',knowledge:'知识与公式',practice:'刷题与错题',english:'金融英语'};
    $('#page-label').textContent=labels[currentPage];
    $('#today-date').textContent=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
    $('#main').innerHTML=`<div class="entry-animation">${({today:todayPage,plan:planPage,knowledge:knowledgePage,practice:practicePage,english:englishPage})[currentPage]()}</div>`;
    updateNav();
    document.title=`${labels[currentPage]} · 拾级 CFA`;
  }
  function scrollTop(){window.scrollTo({top:0,behavior:'instant'});}
  function navigate(page) {if(!['today','plan','knowledge','practice','english'].includes(page))page='today';currentPage=page;location.hash=page;render();scrollTop();}
  function modal(title,html) {$('#modal-content').innerHTML=`<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close-btn" data-action="close" aria-label="关闭弹窗">${icon('close')}</button></div><div class="modal-body">${html}</div>`;if(!$('#modal').open)$('#modal').showModal();}
  function closeModal() {if($('#modal').open)$('#modal').close();}
  function settings() {
    modal('让计划适合你的生活',`<form id="settings-form"><div class="form-field"><label for="exam-date">你的考试日期</label><input type="date" id="exam-date" value="${state.examDate}" min="2026-01-01" max="2035-12-31" required><p class="form-hint">20 天包括考试当天。计划从 ${shortDate(planStart())} 开始；更改日期将平移整条路线。原打卡仍保留在原日期。</p></div><div class="form-field"><label for="study-hours">每天可以稳定投入的时间</label><select id="study-hours"><option value="2" ${state.hours===2?'selected':''}>2 小时 · 精简基础与高权重主线</option><option value="4" ${state.hours===4?'selected':''}>4 小时 · 当前冲刺安排</option><option value="6" ${state.hours===6?'selected':''}>6 小时 · 增加官方题练习与复盘</option></select><p class="form-hint">减少时间时，保留英语、伦理与错题复习，缩短新课范围；不是把同样内容简单加速。最后两天仍减量。计时模拟按正式时长，不随设置缩短。</p></div><button type="submit" class="primary-btn">保存学习设置 ${icon('check')}</button></form><div class="settings-actions">${btn('导出学习备份','export','outline-btn','','download')}<label class="import-label" for="import-file">导入学习备份<input type="file" id="import-file" accept=".json,application/json" hidden></label>${btn('学习方法与来源','sources','outline-btn','','info')}</div><p class="backup-warning">没有账号同步。清理浏览器数据、更换浏览器或切换网站地址后，原进度可能无法读取。建议每两三天导出备份；导入会替换此浏览器当前的学习记录。</p><button class="danger-btn" data-action="reset-confirm">清空当前浏览器的学习记录</button>`);
  }
  function methodsSourcesHTML() {
    if(!D.methodsSources?.length)return '';
    return `<h3 class="source-subheading">学习方法参考文献</h3><ul class="sources-list">${D.methodsSources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><p class="form-hint">${esc(s.note)}</p></li>`).join('')}</ul>`;
  }
  function sources() {
    modal('学习方法与资料来源',`<div class="notice green">${icon('leaf')}<span>这是为弱基础与英语薄弱考生设计的压缩路线。20 天内无法保证覆盖完整考纲，更不能保证通过。目标是建立理解、提高读题能力，并用练习识别缺口。</span></div>${D.methods.map(m=>`<section class="method-item"><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></section>`).join('')}<h3 class="source-subheading">考试与实用技能模块（PSM）</h3><p class="source-note">${esc(D.exam.timing)}</p><p class="source-note">${esc(D.exam.language)} ${esc(D.exam.scoring)}</p><p class="source-note">${esc(D.exam.psm)}</p><h3 class="source-subheading">请用官方资料核对</h3><p class="source-note">以下为官方核对入口。当前资料未在线核验你的考季；科目权重与考试要求以报名年份的官方考纲、准考证和候选人账户为准。</p><ul class="sources-list">${D.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></li>`).join('')}</ul>${methodsSourcesHTML()}<h3 class="source-subheading">关于本站的边界</h3><p class="source-note">课程为中文入门提纲；${D.questions.length} 道题均为本站原创基础练习，${D.vocabulary.length} 个词卡用于金融英语入门。它们不代表正式题库的难度与覆盖面，不能用正确率估计通过概率。分节模拟应使用合法取得的完整模拟卷。通常一套 180 题需要 270 分钟作答，不含休息和复盘。</p><p class="source-note">主动回忆与间隔练习属于有研究支持的学习方法；本站的 1 / 3 / 7 天间隔是易执行的默认值，并非针对每个人或 CFA 的最优间隔。路线优先级是基于权重与先修关系的建议，不是题目命中预测。</p><p class="source-note">学习数据仅存于本浏览器，没有发送到服务器。CFA® 为 CFA Institute 的注册商标。本站为独立个人学习工具，与 CFA Institute 无隶属、认可或担保关系。</p>`);
  }
  function dayModal(n) {
    const d=D.days[n-1];
    modal(`DAY ${String(n).padStart(2,'0')} · ${shortDate(dateForDay(n))}`,`<h3 style="font-size:19px;margin-bottom:8px">${esc(d.title)}</h3><p class="small muted">${esc(d.focus)}</p><div class="day-modal-tasks">${tasksHTML(d)}</div><h3 class="source-subheading">时间怎么分 · ${hoursLabel(d)}</h3><div class="filter-group">${blocksFor(d).map(b=>`<span class="chip">${esc(b.label)} ${b.minutes} 分钟</span>`).join('')||'<span class="small muted">今天不安排集中学习，按官方通知参加考试。</span>'}</div><p class="day-note" style="margin:20px 0">${esc(d.note)}</p>${state.hours===2&&d.day<16?'<p class="source-note" style="margin-bottom:18px">2 小时建议：保留 10 分钟英语、10 分钟伦理，围绕一个核心例子理解概念；官方题少做但逐题复盘，不追求完成整章。</p>':''}${state.hours===2&&(d.day===16||d.day===17)?'<p class="source-note" style="margin-bottom:18px">注意：模拟日仍需预留 4 小时，超出你每天 2 小时的预算。正式作答固定 135 分钟，不能缩短；请额外预留时间，或将复盘移至独立时段。若只练 2 小时，请把它视为练习而非完整分节模拟。</p>':''}${state.hours===6&&(d.day===16||d.day===17)?'<p class="source-note" style="margin-bottom:18px">正式作答仍是 135 分钟；增加的时间全部用于复盘，不延长模拟作答。</p>':''}<div class="lesson-actions">${btn(n===20?'查看考前提醒':'进入学习','start-day','primary-btn',`data-day="${n}"`)}${btn('返回计划','close','text-btn','','')}</div>`);
  }
  function timerText() {return `${String(Math.floor(timer.seconds/60)).padStart(2,'0')}:${String(timer.seconds%60).padStart(2,'0')}`;}
  function focusModal() {
    modal('给自己一段安静的时间',`<div class="focus-display"><div class="focus-select">${[25,35,5].map(n=>`<button class="chip ${timer.minutes===n?'active':''}" data-action="timer-duration" data-minutes="${n}">${n===5?'休息 5':`专注 ${n}`} 分钟</button>`).join('')}</div><div class="time" id="timer-display" role="timer" aria-label="剩余专注时间">${timerText()}</div><p>${timer.minutes===5?'站起来走一走，喝点水，让眼睛离开屏幕。':'只做一件事。时间到了，合上材料回忆 3 个要点。'}</p><div class="focus-actions">${btn(timer.running?'暂停':'开始','timer-toggle','primary-btn','',timer.running?'pause':'play')}${btn('重新计时','timer-reset','outline-btn','','refresh')}</div></div><p class="focus-tip">25 分钟是一个起点，也可以用 35 分钟。根据疲劳程度休息，不必为了计时而中断正理解到一半的内容。关闭弹窗后本页计时仍会继续；关闭网页会停止。</p>`);
  }
  function stopTimer(){timer.running=false;clearInterval(timer.interval);timer.interval=null;}
  function tick(){timer.seconds=Math.max(0,Math.ceil((timer.end-Date.now())/1000));const display=$('#timer-display');if(display)display.textContent=timerText();if(timer.seconds===0){stopTimer();toast(timer.minutes===5?'休息结束，可以慢慢回到学习。':'这一段完成了。合上材料，回忆 3 个要点，再休息一下。');if(display)focusModal();render();}}
  function startDay(n) {
    closeModal();
    if(n===20){dayModal(20);return;}
    if(n===1){startQuiz('diagnostic');return;}
    if(n===16||n===17){modal('模拟练习 · 使用你的完整模拟卷',`<p class="source-note">本站基础题不构成完整模拟。请到官方 Learning Ecosystem 或使用你合法购买、符合当前考纲的模拟卷。</p><p class="source-note">每节 90 题，计时 135 分钟；分两天做适合当前 4 小时安排，但不能检验连续完整考试的耐力。若有额外时间，整套需至少 270 分钟，另加休息和复盘。</p><p class="source-note">${esc(D.days[n-1].note)}</p><ul class="sources-list"><li><a href="https://www.cfainstitute.org/programs/cfa-program/candidate-resources/learning-ecosystem" target="_blank" rel="noopener noreferrer">前往官方 Learning Ecosystem ↗</a></li></ul>${btn('复习本站错题','wrong-quiz','light-btn','','refresh')}`);return;}
    const d=D.days[n-1];activeTopic=d.topics[0]||'ethics';navigate('knowledge');
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-action]');if(!b)return;
    const a=b.dataset.action,id=b.dataset.id;
    if(a==='settings')settings();
    else if(a==='sources')sources();
    else if(a==='close')closeModal();
    else if(a==='focus')focusModal();
    else if(a==='go-plan'){closeModal();navigate('plan');}
    else if(a==='go-knowledge'){activeTopic=null;topicFilter='all';navigate('knowledge');}
    else if(a==='go-english'){closeModal();navigate('english');}
    else if(a==='topic'){activeTopic=id;closeModal();navigate('knowledge');}
    else if(a==='back-lessons'||a==='all-lessons'){activeTopic=null;topicFilter='all';render();scrollTop();}
    else if(a==='due-lessons'){activeTopic=null;topicFilter='due';navigate('knowledge');}
    else if(a==='day')dayModal(Number(b.dataset.day));
    else if(a==='start-day')startDay(Number(b.dataset.day));
    else if(a==='learned'){schedule('reviewed',id,true);save();render();}
    else if(a==='quiz'){closeModal();startQuiz(b.dataset.mode);}
    else if(a==='topic-quiz'){closeModal();startQuiz('topic',id);}
    else if(a==='single-quiz'){startQuiz('single',id);}
    else if(a==='wrong-quiz'){closeModal();startQuiz('wrong');}
    else if(a==='review-quiz')startQuiz('review');
    else if(a==='exit-quiz'){quiz=null;render();scrollTop();}
    else if(a==='option'){if(quiz&&!quiz.submitted){quiz.selected=Number(b.dataset.index);render();}}
    else if(a==='submit-answer')submitAnswer();
    else if(a==='toggle-chinese'){quiz.showChinese=!quiz.showChinese;render();}
    else if(a==='next-question'){if(!quiz?.submitted)return;if(quiz.index===quiz.questions.length-1)quiz.finished=true;else{quiz.index++;quiz.selected=null;quiz.submitted=false;}render();scrollTop();}
    else if(a==='cause'){if(!quiz?.submitted)return;const q=quiz.questions[quiz.index];const attempt=state.attempts.at(-1);if(attempt?.questionId===q.id){attempt.cause=b.dataset.cause;save();render();}}
    else if(a==='english-tab'){englishTab=b.dataset.tab;render();}
    else if(a==='word-filter'){vocabFilter=b.dataset.filter;render();}
    else if(a==='due-words'){englishTab='words';vocabFilter='due';navigate('english');}
    else if(a==='reveal'){revealed.add(id);render();}
    else if(a==='word-known'||a==='word-again'){schedule('vocab',id,a==='word-known');save();revealed.delete(id);render();}
    else if(a==='export'){
      const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`拾级学习备份-${today()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('备份已生成，请保存在你能找到的位置。');
    }
    else if(a==='reset-confirm')modal('清空前，再确认一次',`<p class="source-note">这会删除此浏览器中的打卡、答题、笔记和复习记录，无法撤销。考试日期与每日时长会恢复为 11 月 11 日、每天 4 小时。建议先导出备份。</p><div class="settings-actions">${btn('先导出备份','export','outline-btn','','download')}${btn('返回设置','settings','light-btn','','')}${btn('确认清空','reset','outline-btn','','')}</div>`);
    else if(a==='reset'){state=defaults();save();quiz=null;revealed.clear();activeTopic=null;closeModal();render();toast('学习记录已清空。可以重新开始。');}
    else if(a==='timer-duration'){stopTimer();timer.minutes=Number(b.dataset.minutes);timer.seconds=timer.minutes*60;focusModal();render();}
    else if(a==='timer-reset'){stopTimer();timer.seconds=timer.minutes*60;focusModal();render();}
    else if(a==='timer-toggle'){if(timer.running){tick();stopTimer();}else{if(timer.seconds===0)timer.seconds=timer.minutes*60;timer.end=Date.now()+timer.seconds*1000;timer.running=true;timer.interval=setInterval(tick,500);}focusModal();render();}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-task]')){
      const n=Number(e.target.dataset.day),id=e.target.dataset.task,key=dateForDay(n),set=new Set(state.tasks[key]||[]);if(e.target.checked)set.add(id);else set.delete(id);state.tasks[key]=[...set];save();render();
      if($('#modal').open && $('#modal-content [data-task]'))dayModal(n);
    }
    if(e.target.id==='import-file')importFile(e.target.files[0]);
  });
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-note],[data-question-note]')){const kind=e.target.dataset.note?'notes':'questionNotes',id=e.target.dataset.note||e.target.dataset.questionNote;state[kind][id]=e.target.value.slice(0,10000);clearTimeout(noteTimer);noteTimer=setTimeout(save,300);}
    if(e.target.id==='vocab-search'||e.target.id==='knowledge-search'){
      const el=e.target,id=el.id,pos=el.selectionStart;if(id==='vocab-search')vocabSearch=el.value;else knowledgeSearch=el.value;render();const replacement=$('#'+id);replacement.focus();try{replacement.setSelectionRange(pos,pos);}catch(_){}
    }
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='settings-form')return;e.preventDefault();const date=$('#exam-date').value,hours=Number($('#study-hours').value);
    if(!validDate(date)||![2,4,6].includes(hours))return toast('请填写有效日期与学习时间。');
    state.examDate=date;state.hours=hours;save();closeModal();render();toast('已更新，计划会随考试日期与可用时间调整。');
  });
  let pendingImport=null;
  async function importFile(file) {
    if(!file)return;
    if(file.size>2*1024*1024)return toast('文件过大，请选择 2 MB 以内的学习备份。');
    try{
      pendingImport=normalize(JSON.parse(await file.text()));
      modal('导入这份学习记录？',`<p class="source-note">备份包含 ${pendingImport.attempts.length} 次作答记录、${Object.keys(pendingImport.vocab).length} 个词卡复习安排。导入会替换当前浏览器的学习数据。</p><p class="source-note">建议先导出当前备份。确认后，考试日期将设为 ${esc(pendingImport.examDate)}，每天 ${pendingImport.hours} 小时。</p><div class="settings-actions">${btn('先备份当前记录','export','outline-btn','','download')}${btn('取消','settings','light-btn','','')}${btn('确认导入','confirm-import','primary-btn','','check')}</div>`);
    }catch(_){pendingImport=null;toast('无法读取备份，请使用本站导出的有效 JSON 文件。');}
  }
  document.addEventListener('click',e=>{if(e.target.closest('[data-action="confirm-import"]')&&pendingImport){state=pendingImport;pendingImport=null;quiz=null;revealed.clear();save();closeModal();render();toast('备份已导入。');}});
  $('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(['today','plan','knowledge','practice','english'].includes(page)&&currentPage!==page){currentPage=page;render();scrollTop();}});
  window.addEventListener('beforeunload',()=>{if(noteTimer)save();});
  currentPage=['today','plan','knowledge','practice','english'].includes(location.hash.slice(1))?location.hash.slice(1):'today';
  render();
})();
