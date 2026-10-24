/* Original starter material, not CFA Institute questions. All answer indexes are zero-based.
 * Data contract: topics, days, vocabulary, questions, reading, methods, exam, sources.
 * Topic ids are stable keys shared by lessons, plans and practice.
 */
window.STUDY_DATA = {
  exam: {
    level: 'CFA Level I',
    language: '考试题目为英文；本站中文用于搭桥，练习时要逐渐保留英文题干。',
    questions: 180,
    sessions: 2,
    sessionMinutes: 135,
    optionsPerQuestion: 3,
    timing: '通常为两节，每节 90 题、135 分钟，约每题 90 秒；两节之间有可选休息。以你的准考证和官方说明为准。',
    scoring: '答错通常不倒扣分。没有可预先保证通过的固定分数线；本站正确率仅反映这组基础题。',
    psm: '实用技能模块（PSM）独立于选择题考试。近年要求每级至少完成一个指定模块，通常约 10–20 小时；须在官方成绩发布截止时间前完成，才能获得成绩。先登录候选人账户核对个人要求与截止日；若允许，可安排在笔试后，勿挤占考前核心复习。',
    caveat: '近年公开结构参考，非你的考季保证。本站仅提供入门骨架与原创基础练习，不是完整官方考纲或教材。本站无法联网核验 CFA 官网（代理访问返回 403），请以所报考年份的官方考纲、Learning Ecosystem、考试预约及 PSM 要求为准。',
    practiceNotice: '本站 32 道原创基础题用于学概念和看懂英文，难度与覆盖面不等于正式考试。第 16–17 天的模拟须使用官方 Learning Ecosystem 或你合法获得的完整模拟卷。'
  },
  methods: [
    { title: '先测再学', text: '第 1 天做 8 道混合基础题，记录错因：概念、英语、计算或粗心。样本很小，只用于决定先补什么，不用于预测能否通过。' },
    { title: '闭卷回忆', text: '每学 25–35 分钟，合上材料，用中文说出定义、公式和一个例子；说不出再回看。看懂与能独立做题是两件事。' },
    { title: '间隔 1 / 3 / 7 天', text: '新内容先在次日回忆；记住后把下次复习间隔依次拉长为 3、7 天，忘记则退回次日。先独立作答，再看解析；看网站显示的具体到期日，不反复抄整章笔记。' },
    { title: '交错练习', text: '基础概念初步掌握后，把两到三个科目的题混合练习，训练判断该用哪个方法。先做题，再看答案，最后写一句错因。' },
    { title: '读英文先找任务', text: '先圈 most likely、least likely、except、increase、decrease；再找已知量与单位。先读懂问什么，允许起步时借助中文，逐步减少整句翻译。' },
    { title: '每天保留伦理', text: '每天短练 2–5 道伦理情境题并解释理由。伦理有较高权重且依赖情境辨析，不适合全部压到最后一天。' },
    { title: '保护睡眠与恢复', text: '保证通常 7–9 小时睡眠；疲劳时缩短任务而不熬通宵。最后一天只复习熟悉内容、查证件与路线，不再开新章。' },
    { title: '按证据调整', text: '每 3 天看一次错因分布。若概念仍不懂，减少刷题数量并回到例子；若中文会做而英文不会，增加短题干训练。优先修复反复错的高权重基础。' }
  ],
  topics: [
    { id:'ethics', name:'职业伦理', en:'Ethical and Professional Standards', weight:'15–20%', min:15, max:20, priority:'每日必学', description:'理解投资从业者应该如何对待客户、市场和职业义务，靠辨析情境而不是背口号。', takeaways:['诚信与独立判断：不歪曲事实，不让礼物或报酬影响客观性。','重大非公开信息：既重大又未公开的信息，不用于交易，也不诱使他人交易。','客户利益优先，公平对待客户；披露利益冲突并不自动消除所有违规。','推荐投资应有合理依据，考虑客户目标、风险承受能力和限制。','业绩呈现要公平、准确、完整；“保证收益”需要警惕。'], formula:'先问：谁受影响 → 有什么义务 → 信息是否重大且未公开 → 应如何行动？', example:'分析师提前收到未公开的盈利大幅下滑消息。即使客户可能损失，也不能用该信息安排交易。应限制使用并遵守合规程序。' },
    { id:'quant', name:'定量方法', en:'Quantitative Methods', weight:'6–9%', min:6, max:9, priority:'基础先修', description:'从百分比、时间价值和统计直觉开始。先会解释输入、输出和单位，再记公式。', takeaways:['百分比变动 =（新值 − 旧值）/旧值；百分比与百分点不同。','钱有时间价值：未来同额的钱通常不如今天的钱值钱。','均值描述中心，方差与标准差描述波动，相关关系不等于因果。','期望值是各结果按概率加权的平均；概率之和应为 1。','假设检验中，p 值不是“原假设为真的概率”；与显著性水平比较后作判断。'], formula:'FV = PV × (1 + r)^n；PV = FV / (1 + r)^n', example:'今天存 100 元，年利率 5%，两年后 FV = 100 × 1.05² = 110.25 元；r 用 0.05 而不是 5。' },
    { id:'economics', name:'经济学', en:'Economics', weight:'6–9%', min:6, max:9, priority:'理解方向', description:'建立供需、周期、通胀、政策和汇率的方向感。', takeaways:['其他条件不变，需求曲线通常向右下倾斜；价格变化是沿曲线移动。','需求增加使需求曲线右移；均衡价格通常上升。','名义变量未扣通胀，实际变量扣除通胀影响。','紧缩货币政策通常通过提高利率等方式抑制需求，但结果取决于条件。','汇率必须看报价方向；USD/CNY 变化的含义不能只看“升”“降”。'], formula:'近似实际收益率 ≈ 名义收益率 − 通胀率', example:'名义收益 6%，通胀 2%，实际收益约 4%；精确值 1.06 / 1.02 − 1 ≈ 3.92%。' },
    { id:'fsa', name:'财务报表分析', en:'Financial Statement Analysis', weight:'11–14%', min:11, max:14, priority:'高权重主线', description:'先读懂公司有什么、欠什么、赚了多少、现金去了哪里。', takeaways:['资产负债表是某一时点：资产 = 负债 + 所有者权益。','利润表是一个期间的经营结果；利润不等于现金流。','现金流量表区分经营、投资、融资活动；注意 IFRS 与 US GAAP 分类可能不同。','应收账款增长可能增加收入却未带来现金；必须理解权责发生制。','分析比率要比较时期、行业及会计口径，不能用一个数字判定公司好坏。'], formula:'流动比率 = 流动资产 / 流动负债；毛利率 =（收入 − 销售成本）/ 收入', example:'收入 100，销售成本 60，毛利率 = 40%；流动资产 120，流动负债 80，流动比率 = 1.5。' },
    { id:'corporate', name:'公司发行人', en:'Corporate Issuers', weight:'6–9%', min:6, max:9, priority:'衔接财报', description:'理解公司融资、治理和投资项目决策。', takeaways:['债权人与股东的权利、风险、回报不同。','公司治理用制度约束代理冲突；管理层利益未必总与股东一致。','资本预算比较项目的未来现金流，不能只看会计利润。','净现值使用适当折现率；其他条件相同，正 NPV 项目增加价值。','营运资本管理关注库存、应收、应付和现金转换周期。'], formula:'NPV = 未来现金流现值之和 − 初始投资', example:'投入 100，一年后收到 110，要求回报率 5%，NPV = 110 / 1.05 − 100 ≈ 4.76，价值增加。' },
    { id:'equity', name:'权益投资', en:'Equity Investments', weight:'11–14%', min:11, max:14, priority:'高权重主线', description:'股票代表所有权；先理解市场如何交易，再学如何估值。', takeaways:['普通股是剩余索取权；清算时通常在债权人之后。','市价单优先成交但不保证价格；限价单限制价格但不保证成交。','有效市场讨论价格如何反映信息，不等于价格永远没有波动。','估值必须区分价格与价值，比较指标要使用一致口径。','股利贴现模型依赖长期假设；永续增长模型要求 r > g。'], formula:'P/E = 每股价格 / 每股收益；固定增长 DDM：V₀ = D₁ / (r − g)', example:'下一年股利 D₁ 为 2，要求回报率 10%，长期增长率 2%，估值 = 2 / 0.08 = 25。不是用当期股利直接代入。' },
    { id:'fixed', name:'固定收益', en:'Fixed Income', weight:'11–14%', min:11, max:14, priority:'高权重主线', description:'理解债券的现金流、价格、收益率和利率风险。', takeaways:['债券通常承诺票息和本金；承诺不代表不会违约。','票息率基于面值，当前收益率基于当前价格，到期收益率还考虑本金变化与时间。','其他条件不变，市场要求收益率上升，固定现金流债券价格下降。','久期描述价格对收益率小幅变动的敏感度；凸性改善近似。','信用利差可能反映违约风险、流动性等因素，不能直接等同违约概率。'], formula:'债券价格 = 各期票息现值 + 到期本金现值；ΔP/P ≈ −修正久期 × Δy', example:'修正久期为 4，收益率上升 0.01（100 个基点），价格约下降 4%，暂不考虑凸性。' },
    { id:'derivatives', name:'衍生品', en:'Derivatives', weight:'5–8%', min:5, max:8, priority:'掌握基本结构', description:'先分清远期、期货、互换、期权的义务和权利，再看收益。', takeaways:['远期与期货通常对双方都有履约义务；期权买方有选择是否行权的权利。','看涨期权受益于标的上涨；看跌期权受益于标的下跌，均需考虑权利金。','到期收益（payoff）与利润（profit）不同，利润要扣初始成本。','套期保值用于管理风险，不意味着消除所有风险。','衍生品定价重视无套利，不能把预期收益简单当价格。'], formula:'看涨期权到期收益 = max(Sₜ − K, 0)；买方利润 = 收益 − 权利金（忽略资金时间价值）', example:'执行价 100，期末股价 120，权利金 5：看涨期权收益 20，利润 15。' },
    { id:'alternatives', name:'另类投资', en:'Alternative Investments', weight:'7–10%', min:7, max:10, priority:'概念与特征', description:'认识私募资本、房地产、商品、基础设施等类别及其费用和流动性。', takeaways:['另类资产不必然低风险，也不必然与股票低相关。','私募投资往往流动性较低，估值不频繁可能掩盖价格波动。','对冲基金策略、杠杆和费用结构差异很大。','房地产需区分直接持有、债务投资和上市证券。','历史回报数据库可能存在幸存者偏差和回填偏差。'], formula:'净收益 = 费用前收益 − 管理费 − 业绩报酬（实际计算以约定计费基础为准）', example:'同样的毛回报，收费更高通常会降低投资者净回报。复杂费用须先确认管理费基数、门槛和高水位线。' },
    { id:'portfolio', name:'投资组合管理', en:'Portfolio Management', weight:'8–12%', min:8, max:12, priority:'串联风险收益', description:'从单个资产转向整体组合，理解分散化与投资者约束。', takeaways:['组合收益率是资产收益按权重加权；权重之和通常为 1。','分散化可降低非系统性风险，不能消除整个市场的系统性风险。','相关性越低，其他条件相同，分散化潜力通常越大。','β 衡量相对于市场的系统性风险，不等于总波动率。','投资政策说明书应反映目标、风险承受能力、期限、流动性等限制。'], formula:'E(Rₚ) = Σ wᵢE(Rᵢ)；CAPM：E(Rᵢ) = Rf + βᵢ × [E(Rm) − Rf]', example:'无风险利率 3%，市场期望收益 8%，β = 1.2，CAPM 要求收益 = 3% + 1.2 × 5% = 9%。' }
  ],
  days: [],
  vocabulary: [],
  questions: [],
  reading: [],
  sources: [
    { title:'CFA Institute · Level I exam guide', url:'https://www.cfainstitute.org/programs/cfa-program/candidate-resources/level-i-exam', note:'考试结构、主题与权重的官方核对入口；本次代理 CONNECT 403，未完成在线核验。', checked:'2026-10-23', verified:false },
    { title:'CFA Institute · Practical Skills Modules', url:'https://www.cfainstitute.org/programs/cfa-program/candidate-resources/practical-skills-modules', note:'核对 PSM 模块、用时及领取成绩前的完成要求；以账户内个人截止日为准。本次网络未核验。', checked:'2026-10-23', verified:false },
    { title:'CFA Institute · Learning Ecosystem', url:'https://www.cfainstitute.org/programs/cfa-program/candidate-resources/learning-ecosystem', note:'使用所报考年份的正式教材、练习题和完整模拟卷。本站不替代官方题库。', checked:'2026-10-23', verified:false }
  ]
};

// Day 20 is exam day for the user's 2026-11-11 booking. Day 1 is 2026-10-23.
{
  const plans = [
    [1,['quant','ethics'],'先找起点，建立学习节奏','小样本诊断 + 百分比与题干关键词',['闭卷完成 8 道混合基础题；逐题标记是概念、英语、计算还是粗心，不把小样本正确率当通过率。','练 5 个百分比与复利例子；掌握 PV、FV、rate、increase、least likely。','学 2 个伦理情境；合上笔记，用中文复述今天的 3 个概念。'],'今天只建立基线，不能用 8 道题推断真实应试水平。'],
    [2,['quant','portfolio'],'把数字读懂','时间价值、均值、标准差和期望收益',['复习第 1 天错题和 8 个英文词，先答后看解析。','用计算器独立计算单笔现值与终值；再做均值、期望值和标准差直觉题。','做一组定量题与短伦理题；写清百分号、百分点和基点区别。'],'使用官方允许的计算器型号练习；不要到考前才学按键。'],
    [3,['fsa'],'读懂三张报表','资产负债表 → 利润表 → 现金流量表',['闭卷写出资产 = 负债 + 权益，并给三类各举一个例子。','用小公司例子区分收入、利润与现金；看懂 revenue、expense、asset、liability。','做财报基础题并解释每个错误选项为什么错；完成伦理短练。'],'先建立报表之间的联系，暂不追求复杂会计细节。'],
    [4,['fsa'],'用比率描述公司','盈利、流动性、杠杆与可比性',['按 1 / 3 天间隔复习已学词与错题。','手算毛利率、流动比率、资产负债率，练习英文分子分母。','混合财报基础题与定量题；用一句话说明比率变化可能意味着什么。'],'比率不是越大越好；比较时检查行业、时期、口径。'],
    [5,['fsa','ethics'],'财报第二遍：理解现金与估计','权责发生制、折旧、存货与报表质量',['复盘前三天反复错的财报概念，优先填最基础的缺口。','比较赊销与收款、资本化与费用化的方向影响；注意不同会计准则可能有差异。','做财报混合练习和伦理案例；把三类最常见错因记入错题本。'],'无法解释基础例子时，先回到教材，不用刷题数量掩盖概念空缺。'],
    [6,['corporate','fsa'],'从公司账本走向决策','治理、资本预算与营运资本',['复习第 3 天财报词汇，讲清股东与债权人的差别。','学 NPV，手算单期项目；理解为什么正 NPV 通常增加价值。','练公司发行人题与财报交错题；完成伦理短练。'],'NPV 用现金流，不直接用会计利润。'],
    [7,['economics','quant'],'建立经济方向感','供需、通胀、政策与汇率',['闭卷回顾第 1 天的错题与词；一周后仍不会的标记为重点。','画供需移动的简图；练名义与实际收益、升值贬值的报价方向。','做经济基础题和定量题；翻译 3 条带 increase/decrease 的短题干。'],'每题写明“其他条件不变”，减少把方向关系背错。'],
    [8,['equity'],'读懂股票与市场','所有权、订单类型、价格与价值',['复习财报中每股收益、利润率的含义。','区分普通股、市价单、限价单；解释市场有效性的基本含义。','做权益题并配 2–5 道伦理题；整理 stock、share、earnings、dividend。'],'先理解现金流和所有权，再学估值公式。'],
    [9,['equity','corporate'],'股票估值基础','P/E 与固定增长股利贴现模型',['间隔复习第 2、6、8 天的薄弱点。','手算 P/E 与 DDM，确认 D₁、r、g，检查 r > g。','混合权益与公司题；练 least likely 和 except 的反向问法。'],'不要把简化模型当投资建议；估值结果对假设很敏感。'],
    [10,['fixed'],'理解债券现金流','面值、票息、收益率、折现与价格',['画债券现金流时间线，明确 coupon 与 yield 不同。','用一年期债券手算价格；解释收益率上升时价格为什么下降。','做固定收益基础题与短伦理题；建立 face value、maturity、yield 词卡。'],'先学普通固定利率债券；复杂结构回到官方教材。'],
    [11,['fixed','quant'],'债券风险与敏感度','久期、凸性、信用与利差',['复习第 4、8、10 天相关错题；先估方向，再按计算器。','手算久期的一阶价格变化，练 100bp = 1 个百分点 = 0.01。','混合债券与定量题；记录 credit risk 与 interest rate risk 的区别。'],'久期近似适用于小幅收益率变动，不是所有情形的精确价格。'],
    [12,['portfolio'],'理解组合，而非单个资产','加权收益、相关性、分散化与 CAPM',['回顾均值、权重与波动的含义。','手算两资产组合收益和 CAPM；解释系统性与非系统性风险。','做组合与权益交错题，结合客户目标理解适当性；完成伦理短练。'],'组合标准差通常不是各资产标准差的简单加权平均。'],
    [13,['alternatives','portfolio'],'另类资产与费用','类别、流动性、估值偏差与费用结构',['复习第 6、10、12 天的相关术语。','列出私募、房地产、商品和基础设施的典型风险，理解流动性限制。','做另类基础题与组合题；练 fee、liquidity、leverage、bias。'],'另类不自动等于分散化或高回报，避免记绝对化结论。'],
    [14,['derivatives','fixed'],'衍生品先抓结构','义务与权利、远期与期权、收益与利润',['间隔复习第 7、11、13 天错题。','画看涨与看跌期权到期收益的几个点，再扣权利金得到利润。','做衍生品与固定收益交错题；配伦理短练并检查英文限定词。'],'计算前先写多头/空头、看涨/看跌、收益/利润。'],
    [15,['ethics','fsa','fixed'],'伦理整合与高权重补漏','情境辨析 + 高频基础的第二轮回忆',['做一组英文伦理情境题；每题指出义务、相关事实与合适行动。','按错题记录，选择财报、权益、债券中最薄弱的一个基础模块补课。','准备完整官方模拟卷与计时器；复习必要计算器操作和考试流程。'],'本站题量不能替代完整模拟。今天确定第 16–17 天使用的合法模拟卷。'],
    [16,['ethics','fsa','equity'],'模拟上半场：英文与节奏','官方/合法模拟第 1 节，90 题 / 135 分钟',['使用官方或合法完整模拟卷的第 1 节：90 题，135 分钟，按真实规定独立作答。','用约 65 分钟复盘，标记概念、英语、计算和节奏问题，优先解释不确定的对题。','用 20 分钟复习关键词，20 分钟回顾伦理，不在今天开启新章节。'],'分两天做模拟只能检验分节表现，不能验证连续 4.5 小时考试的耐力。不要把本站 32 题当模拟卷。'],
    [17,['quant','fixed','portfolio'],'模拟下半场：把问题找全','同一套官方/合法模拟第 2 节',['独立完成同一套模拟的第 2 节：90 题，135 分钟；保留原始答案与用时。','复盘第二节并合并两节错因；总正确率只作为调整参考，不等于通过预测。','复习英文关键词与伦理；圈出最后两天最值得修复的 3 个基础点。'],'完整计时模拟需至少 270 分钟答题，另加休息。若另有空闲可连续完成；每天 4 小时时按此拆分。'],
    [18,['ethics','fsa','fixed','equity'],'最后一次集中修复','只修反复错的高权重基础',['依据模拟错因，选 3 个可修复的问题，各找一个例子重新解释。','闭卷重做之前错题，做少量不同表述的新题，确认不是记住选项。','整理一页公式与英文触发词；检查 PSM 个人要求、证件和考试通知。'],'不再追求全考纲补齐。遇到大块完全陌生内容，优先稳定已经学过的基础。'],
    [19,['ethics','quant'],'轻量回顾，留出恢复','熟悉内容 + 考前准备',['约 30 分钟回忆公式、单位和限定词，不临时背新章节。','约 30 分钟回看伦理错因及最常见概念错误；只做少量熟悉题。','约 30 分钟确认考点、交通、证件姓名、允许的计算器与备用电池；按平时作息睡觉。'],'建议只安排约 90 分钟轻量学习，其余用于恢复与准备；不强行补满 4 小时。'],
    [20,[],'考试日：稳住已会的题','流程、节奏与休息',['出发前检查官方要求的有效证件、允许的计算器、预约信息和路线。','考场按官方流程操作；先读问法与单位，合理分配每题约 90 秒的平均节奏。','考后休息，再按候选人门户截止时间完成或确认 PSM。'],'今天是考试日，不安排 4 小时学习；到场时间和物品要求以官方通知为准。']
  ];
  window.STUDY_DATA.days = plans.map(([day,topics,title,focus,tasks,note]) => ({
    day, topics, title, focus, note,
    tasks: tasks.map((text,index)=>({id:`day-${day}-task-${index+1}`,text})),
    blocks: day===20 ? [] : day===19 ? [{label:'回忆公式与英文',minutes:30},{label:'伦理与错因',minutes:30},{label:'考前准备',minutes:30}] : (day===16||day===17) ? [{label:'正式计时模拟一节',minutes:135},{label:'解析与错因',minutes:65},{label:'关键词',minutes:20},{label:'伦理回忆',minutes:20}] : [{label:'金融英语与旧词',minutes:20},{label:'概念与例子',minutes:80},{label:'独立做题',minutes:75},{label:'错题与闭卷回忆',minutes:45},{label:'伦理短练',minutes:20}]
  }));
}

window.STUDY_DATA.vocabulary = [
 ['asset','资产','Cash is an asset.','公司或个人拥有、控制并预期带来经济利益的资源。','fsa'],
 ['liability','负债','A bank loan is a liability.','已经承担、未来通常需要付出资源的义务。','fsa'],
 ['equity','权益；股权','Assets equal liabilities plus equity.','资产减去负债后的剩余权益；在投资中也可指股票类资产。','fsa'],
 ['revenue','收入','Revenue increased this year.','企业销售商品或提供服务等产生的收入，不等于已经收到账款。','fsa'],
 ['expense','费用','Rent is an expense.','为取得收入或维持经营而确认的耗费。','fsa'],
 ['earnings','盈利','Earnings are lower than revenue.','通常指利润；看语境和具体会计口径。','fsa'],
 ['cash flow','现金流','Profit is not the same as cash flow.','现金实际流入和流出；与会计利润不同。','fsa'],
 ['receivable','应收款','The sale created a receivable.','已经确认但还未收回的钱，常见 accounts receivable。','fsa'],
 ['inventory','存货','The company holds inventory.','用于出售或生产的货物等，注意估值与成本确认。','fsa'],
 ['depreciation','折旧','Depreciation reduces reported profit.','把可折旧资产的成本在使用期内分配；当期折旧本身通常不付现金。','fsa'],
 ['margin','利润率；保证金','The gross profit margin is 40%.','财报中常指利润占收入比例；在交易中也可指保证金，需看上下文。','fsa'],
 ['ratio','比率','The current ratio is 1.5.','两个量相除；先确认分子、分母和单位。','fsa'],
 ['present value','现值','The present value is 100.','把未来的钱按折现率换算成今天的价值，缩写 PV。','quant'],
 ['future value','终值','The future value is 105.','今天的钱按利率增长到未来的价值，缩写 FV。','quant'],
 ['interest rate','利率','The annual interest rate is 5%.','按一定期间计算的利息比例；要对齐年、月等周期。','quant'],
 ['discount rate','折现率','Use a 6% discount rate.','把未来现金流折成现值的利率。','quant'],
 ['mean','平均数','The mean of 2 and 4 is 3.','简单算术平均是总和除以数量；也有其他类型均值。','quant'],
 ['standard deviation','标准差','A higher standard deviation means more dispersion.','描述数据围绕均值的离散程度，不直接说明收益高低。','quant'],
 ['probability','概率','The probability is 0.2.','事件发生可能性的度量，通常在 0 与 1 之间。','quant'],
 ['expected return','期望收益率','The expected return is 8%.','按概率加权的收益率；不是保证收益。','portfolio'],
 ['risk','风险','This investment has market risk.','不确定性与损失可能；不同模型用不同指标衡量。','portfolio'],
 ['weight','权重','The stock has a 40% weight.','在总组合或加权计算中占的比例。','portfolio'],
 ['correlation','相关性','The two returns have low correlation.','衡量两个变量共同变化的线性关系，不等于因果。','portfolio'],
 ['diversification','分散化','Diversification can reduce specific risk.','将风险分布到不同资产；不能消除所有风险。','portfolio'],
 ['systematic risk','系统性风险','Market risk is systematic risk.','影响整个市场、不能通过普通分散化消除的风险。','portfolio'],
 ['beta','贝塔','The stock has a beta of 1.2.','相对于市场变动的敏感度，描述系统性风险的一种指标。','portfolio'],
 ['demand','需求','Demand for the product increased.','在不同价格下愿意并能够购买的数量关系。','economics'],
 ['supply','供给','Supply increased after costs fell.','在不同价格下愿意并能够提供的数量关系。','economics'],
 ['inflation','通货膨胀','Inflation reduces purchasing power.','总体价格水平上升，使相同货币的购买力下降。','economics'],
 ['real return','实际收益率','The real return accounts for inflation.','调整通胀后的收益率，与名义收益率不同。','economics'],
 ['exchange rate','汇率','Check how the exchange rate is quoted.','两种货币兑换的价格，必须先读清报价方向。','economics'],
 ['net present value','净现值','The project has a positive net present value.','未来现金流现值减去初始投入，缩写 NPV。','corporate'],
 ['shareholder','股东','Shareholders own the company’s shares.','持有股权的人；不等于债权人。','corporate'],
 ['governance','治理','Good governance can reduce agency conflicts.','对决策、监督和责任进行安排的制度。','corporate'],
 ['working capital','营运资本','Inventory is part of working capital management.','常指流动资产减流动负债；具体分析时注意定义。','corporate'],
 ['share','股份；股票','She owns 100 shares.','公司股权的份额；shares outstanding 是发行在外股份。','equity'],
 ['dividend','股利；分红','The next dividend is 2 per share.','公司向股东分配的收益，不等于公司总利润。','equity'],
 ['valuation','估值','Valuation depends on assumptions.','根据现金流、风险与可比数据等估计价值。','equity'],
 ['market order','市价单','A market order does not guarantee a price.','以市场可得价格尽快成交，但不保证成交价格。','equity'],
 ['limit order','限价单','A limit order may not be filled.','限制买入最高价或卖出最低价，但不保证成交。','equity'],
 ['bond','债券','The bond pays interest each year.','债务工具，通常约定利息与本金偿付。','fixed'],
 ['face value','面值','The bond’s face value is 1,000.','债券约定的名义本金，不必等于市价。','fixed'],
 ['coupon','票息','The annual coupon is 50.','按约定支付的利息；coupon rate 是票息率。','fixed'],
 ['yield','收益率','When yield rises, the bond price usually falls.','由价格和现金流隐含的收益率；要辨别具体指标。','fixed'],
 ['maturity','到期日；期限','The bond has two years to maturity.','最后本金等到期偿付的日期或剩余时间。','fixed'],
 ['duration','久期','Duration measures interest-rate sensitivity.','衡量债券利率敏感度的指标；先分清修正久期等类型。','fixed'],
 ['basis point','基点','100 basis points equal one percentage point.','1 个基点 = 0.01 个百分点；100 个基点 = 1 个百分点。','fixed'],
 ['credit risk','信用风险','Credit risk increases if repayment becomes less likely.','发行人不能按约定履行偿付义务的风险。','fixed'],
 ['forward','远期合约','A forward creates obligations for both parties.','双方约定未来按条款买卖标的的合约。','derivatives'],
 ['option','期权','An option buyer has a right.','买方拥有按约定买卖的权利，通常要支付权利金。','derivatives'],
 ['call option','看涨期权','A call gives the right to buy.','赋予买方按执行价格买入标的的权利。','derivatives'],
 ['put option','看跌期权','A put gives the right to sell.','赋予买方按执行价格卖出标的的权利。','derivatives'],
 ['strike price','执行价格','The strike price is 100.','期权行权时约定的买卖价格，常用 K 表示。','derivatives'],
 ['payoff','到期收益','Payoff does not subtract the option premium.','按到期合约条件得到的收益；与扣除成本后的利润不同。','derivatives'],
 ['liquidity','流动性','Private assets may have low liquidity.','较快交易且不显著影响价格的能力，也可指偿付短期债务能力。','alternatives'],
 ['leverage','杠杆','Leverage can magnify gains and losses.','使用借款等方式放大风险敞口。','alternatives'],
 ['fee','费用','A fee reduces the investor’s net return.','向管理人或服务方支付的成本，注意计费基础。','alternatives'],
 ['bias','偏差','Survivorship bias can overstate returns.','样本或分析方法造成的系统性倾向。','alternatives'],
 ['material nonpublic information','重大非公开信息','Do not trade on material nonpublic information.','既可能影响理性投资者决策、又尚未公开的信息。','ethics'],
 ['conflict of interest','利益冲突','Disclose a conflict of interest.','个人或其他利益可能影响客观判断；披露未必足以解决全部问题。','ethics'],
 ['suitability','适当性','An investment must be suitable for the client.','根据客户目标、风险承受能力及限制判断投资是否合适。','ethics'],
 ['reasonable basis','合理依据','Research needs a reasonable basis.','投资分析与推荐须建立在审慎、充分的研究基础之上。','ethics'],
 ['most likely','最可能','Which outcome is most likely?','找最符合条件的选项，不是绝对必然。','quant'],
 ['least likely','最不可能','Which statement is least likely correct?','反向问法，通常寻找错误或最不符合条件的陈述。','quant'],
 ['except','除了；不包括','All statements are correct except one.','警惕反向选择：其余成立，找例外。','quant'],
 ['increase / decrease','增加 / 减少','If yield increases, price decreases.','先识别哪个量变了，再判断所问变量方向。','quant']
].map(([en,zh,sentence,meaning,topic],index)=>({id:`v-${index+1}`,en,zh,sentence,meaning,topic}));

window.STUDY_DATA.reading = [
 {id:'read-1',label:'先找问法：most likely',en:'If the required yield increases, a fixed-rate bond’s price is most likely to decrease.',zh:'如果要求收益率上升，固定利率债券的价格最可能下降。',keywords:['required yield = 要求收益率','increases = 上升','most likely = 最可能','decrease = 下降'],tip:'先抓 If 条件，再圈被问的 price。其他条件相同时，价格与收益率反向变化。'},
 {id:'read-2',label:'反向问法：least likely',en:'Which statement about diversification is least likely to be correct?',zh:'关于分散化，哪项陈述最不可能正确？',keywords:['which statement = 哪项陈述','about = 关于','least likely = 最不可能','correct = 正确'],tip:'这是找错误/最不符合条件的陈述。先在草稿写“找错”，再读选项，避免习惯性选正确项。'},
 {id:'read-3',label:'例外：except',en:'All of the following are assets except a bank loan payable.',zh:'下列各项均为资产，银行应付借款除外。',keywords:['all of the following = 以下所有','assets = 资产','except = 除外','payable = 应付'],tip:'except 让方向反转。应付借款是负债；loan receivable 与 loan payable 的方向相反。'},
 {id:'read-4',label:'限定条件：holding other factors constant',en:'Holding other factors constant, a higher discount rate reduces present value.',zh:'其他因素不变时，更高的折现率使现值下降。',keywords:['holding other factors constant = 其他因素不变','higher = 更高','reduces = 降低','present value = 现值'],tip:'只改变题目指定的变量，不自己增加“现金流也变多了”等假设。'},
 {id:'read-5',label:'时间与单位',en:'An investor deposits 100 today at an annual rate of 5% for two years.',zh:'一名投资者今天存入 100，年利率为 5%，存两年。',keywords:['today = 今天','annual rate = 年利率','for two years = 两年','deposits = 存入'],tip:'标 PV = 100、r = 0.05、n = 2。计算前对齐利率和时间的周期。'},
 {id:'read-6',label:'区分收益与利润',en:'A call option has a strike price of 100 and a premium of 5. At expiration, the stock price is 120. What is the buyer’s profit?',zh:'看涨期权执行价 100，权利金 5；到期股价 120。买方利润是多少？',keywords:['call = 看涨','strike price = 执行价','premium = 权利金','profit = 利润'],tip:'先算 payoff = max(120 − 100, 0) = 20，再扣 5 得利润 15。题目问 profit，不能停在 20。'},
 {id:'read-7',label:'否定词：not / without',en:'An analyst must not trade on material nonpublic information.',zh:'分析师不得利用重大非公开信息进行交易。',keywords:['must not = 不得','trade on = 利用……交易','material = 重大','nonpublic = 未公开'],tip:'not 与 nonpublic 都影响句意。先判断信息是否同时“重大”和“未公开”。'},
 {id:'read-8',label:'比较对象：relative to',en:'Relative to a bond with lower duration, a bond with higher duration is more sensitive to a small change in yield.',zh:'与较低久期债券相比，较高久期债券对收益率小幅变动更敏感。',keywords:['relative to = 与……相比','lower / higher = 较低 / 较高','sensitive to = 对……敏感','small change = 小幅变化'],tip:'圈出比较对象和所问特征。句子长时拆成“谁比谁，在什么方面，更怎样”。'}
];

window.STUDY_DATA.questions = [
 {id:'q-ethics-1',topic:'ethics',stem:'分析师获得一项尚未公开、且可能显著影响股价的盈利消息。最合适的行为是？',en:'An analyst receives material nonpublic earnings information. Which action is most appropriate?',options:['马上替客户买卖（Trade for clients）','限制信息使用并遵守合规程序（Restrict use and follow compliance procedures）','先告诉最重要的客户（Inform selected clients first）'],answer:1,explanation:'重大且未公开的信息不能用于交易或诱使他人交易。客户利益、个人损益或“只告诉少数人”都不能让这种行为合理。',vocab:['material','nonpublic','most appropriate']},
 {id:'q-ethics-2',topic:'ethics',stem:'某投资有很高预期收益，但客户需要下个月支付学费。判断适当性时应首先考虑什么？',en:'A client needs tuition money next month. What should an adviser consider when assessing investment suitability?',options:['只看过去一年的收益（Past return only）','客户的目标、流动性需求和风险承受能力（Objectives, liquidity needs and risk tolerance）','投资是否热门（Popularity）'],answer:1,explanation:'适当性须结合客户整体状况。短期必需资金通常不能只因某项投资预期收益高就承担不匹配的风险。',vocab:['suitability','liquidity needs','risk tolerance']},
 {id:'q-ethics-3',topic:'ethics',stem:'一份报告列出推荐理由，却故意隐瞒分析师持有该股票的利益。问题主要是什么？',en:'An analyst intentionally omits a personal holding from a research report. The main concern is:',options:['没有披露可能影响客观性的利益冲突（Undisclosed conflict of interest）','报告使用了英文（Use of English）','所有持股都绝对禁止（All ownership is prohibited）'],answer:0,explanation:'持股可能形成利益冲突，应按适用义务充分披露并管理。不能把“需要披露”错误理解为“任何持股都绝对禁止”。',vocab:['omit','personal holding','conflict of interest']},
 {id:'q-ethics-4',topic:'ethics',stem:'下列哪种投资推荐最符合合理依据要求？',en:'Which recommendation is most likely to have a reasonable basis?',options:['仅因社交媒体上的匿名热帖（An anonymous popular post only）','有充分研究、核对关键假设并考虑风险（Diligent research, checked assumptions and risks）','因为别人说保证翻倍（A promise to double the money）'],answer:1,explanation:'合理依据来自审慎、充分的研究。流行、传言或收益承诺不能替代核实与独立判断。',vocab:['reasonable basis','assumption','diligent']},
 {id:'q-quant-1',topic:'quant',stem:'今天投资 100 元，年复利 5%，两年后的终值最接近多少？',en:'What is the future value of 100 invested for two years at 5% annually, with annual compounding?',options:['105.00','110.00','110.25'],answer:2,explanation:'FV = 100 × (1.05)² = 110.25。110 是没有把第一年利息继续计息的简单利息结果。',vocab:['future value','annually','compounding']},
 {id:'q-quant-2',topic:'quant',stem:'一年后收到 110 元，折现率 10%，今天的现值是多少？',en:'What is the present value of 110 received in one year at a discount rate of 10%?',options:['100','110','121'],answer:0,explanation:'PV = 110 / 1.10 = 100。向今天折现用除法；再乘 1.10 是向未来复利。',vocab:['present value','received','discount rate']},
 {id:'q-quant-3',topic:'quant',stem:'数值 2、4、6 的算术平均数是多少？',en:'What is the arithmetic mean of 2, 4 and 6?',options:['3','4','6'],answer:1,explanation:'算术平均数 = (2 + 4 + 6) / 3 = 4。先求和，再除以观察值数量。',vocab:['arithmetic mean','observation']},
 {id:'q-quant-4',topic:'quant',stem:'利率从 4% 升到 5%，上升多少个基点？',en:'An interest rate rises from 4% to 5%. The increase in basis points is:',options:['1 bp','10 bp','100 bp'],answer:2,explanation:'变化为 1 个百分点；1 个百分点 = 100 个基点。相对涨幅则为 25%，这三个概念不可混淆。',vocab:['basis point','percentage point','increase']},
 {id:'q-economics-1',topic:'economics',stem:'其他条件不变，需求增加、供给不变，均衡价格通常如何变化？',en:'Holding supply constant, an increase in demand most likely causes the equilibrium price to:',options:['上升（Increase）','下降（Decrease）','必然不变（Remain unchanged）'],answer:0,explanation:'需求曲线向右移而供给不变时，在通常向上倾斜的供给曲线下，均衡价格与数量会上升。注意这不同于因价格变化而沿需求曲线移动。',vocab:['holding constant','demand','equilibrium price']},
 {id:'q-economics-2',topic:'economics',stem:'名义收益率 6%，通胀率 2%。实际收益率的近似值是多少？',en:'The nominal return is 6% and inflation is 2%. The approximate real return is:',options:['2%','4%','8%'],answer:1,explanation:'近似实际收益 = 6% − 2% = 4%；精确值为 1.06 / 1.02 − 1 ≈ 3.92%。题干已说明 approximate。',vocab:['nominal','inflation','approximate']},
 {id:'q-fsa-1',topic:'fsa',stem:'公司资产 500，负债 300。所有者权益是多少？',en:'A company has assets of 500 and liabilities of 300. Its equity is:',options:['200','300','800'],answer:0,explanation:'资产 = 负债 + 权益，因此权益 = 500 − 300 = 200。不是把资产与负债相加。',vocab:['assets','liabilities','equity']},
 {id:'q-fsa-2',topic:'fsa',stem:'收入 100，销售成本 60。毛利率是多少？',en:'Revenue is 100 and cost of goods sold is 60. The gross profit margin is:',options:['40%','60%','66.7%'],answer:0,explanation:'毛利润 = 100 − 60 = 40，毛利率 = 40 / 100 = 40%。分母是收入，而不是销售成本。',vocab:['revenue','cost of goods sold','gross profit margin']},
 {id:'q-fsa-3',topic:'fsa',stem:'流动资产 120，流动负债 80。流动比率是多少？',en:'Current assets are 120 and current liabilities are 80. The current ratio is:',options:['0.67','1.50','40.00'],answer:1,explanation:'流动比率 = 流动资产 / 流动负债 = 120 / 80 = 1.5。两者之差 40 是金额，不是比率。',vocab:['current assets','current liabilities','ratio']},
 {id:'q-fsa-4',topic:'fsa',stem:'公司今天赊销商品，符合收入确认条件，但客户下月付款。哪项最合理？',en:'A credit sale meets revenue recognition criteria today, but cash will be collected next month. Which statement is most likely correct?',options:['今天确认收入就意味着今天收到现金（Revenue means immediate cash）','今天可能确认收入和应收款，却没有该笔现金流入（Revenue and a receivable without immediate cash）','下月前一定不能确认收入（No revenue can ever be recognized before cash）'],answer:1,explanation:'权责发生制可在满足条件时先确认收入和应收账款，现金以后才收到。因此利润与现金流不同。',vocab:['credit sale','receivable','recognition']},
 {id:'q-corporate-1',topic:'corporate',stem:'项目今天投入 100，一年后得到 110，折现率 5%。NPV 最接近多少？',en:'A project costs 100 today and pays 110 in one year. At a 5% discount rate, the NPV is closest to:',options:['−4.76','4.76','10.00'],answer:1,explanation:'NPV = 110 / 1.05 − 100 ≈ 4.76。10 是未折现的金额差，不是净现值。',vocab:['costs today','NPV','closest to']},
 {id:'q-corporate-2',topic:'corporate',stem:'其他条件相同、估计合理时，正 NPV 项目通常会怎样？',en:'All else equal, a positive-NPV project is expected to:',options:['增加公司价值（Add value）','减少公司价值（Destroy value）','保证未来没有风险（Eliminate all future risk）'],answer:0,explanation:'正 NPV 表示按适当折现率计，预期现金流的现值超过投入，因此预期增加价值。它不保证现金流一定实现。',vocab:['positive','expected','all else equal']},
 {id:'q-corporate-3',topic:'corporate',stem:'公司治理的重要作用之一是什么？',en:'One important purpose of corporate governance is to:',options:['保证股价永远上涨（Guarantee a rising stock price）','减少管理层与所有者之间的代理冲突（Reduce agency conflicts）','消除所有商业风险（Remove all business risk）'],answer:1,explanation:'治理通过监督、激励和责任安排减少代理冲突，但无法保证盈利或消除所有风险。',vocab:['governance','agency conflict','purpose']},
 {id:'q-equity-1',topic:'equity',stem:'股价 30，每股收益 3。市盈率是多少？',en:'A share price is 30 and earnings per share are 3. The P/E ratio is:',options:['0.1 倍','10 倍','90 倍'],answer:1,explanation:'P/E = 股价 / 每股收益 = 30 / 3 = 10。需要确认价格和收益使用一致的每股口径。',vocab:['share price','earnings per share','P/E']},
 {id:'q-equity-2',topic:'equity',stem:'下一年股利为 2，要求回报率 10%，永久增长率 2%。固定增长模型估值是多少？',en:'Next year’s dividend is 2, required return is 10% and constant growth is 2%. The stock value is:',options:['16.67','20.00','25.00'],answer:2,explanation:'V₀ = D₁ / (r − g) = 2 / (0.10 − 0.02) = 25。注意给的是下一年股利，且 r > g。',vocab:['next year','required return','constant growth']},
 {id:'q-equity-3',topic:'equity',stem:'哪种订单设定买入最高价，但可能无法成交？',en:'Which buy order sets a maximum purchase price but may not be executed?',options:['市价单（Market order）','限价单（Limit order）','任何订单都保证成交（Any order guarantees execution）'],answer:1,explanation:'限价买单要求按指定价格或更低价格买入，市场不满足价格等条件时可能不成交；市价单不保证价格。',vocab:['maximum','executed','limit order']},
 {id:'q-fixed-1',topic:'fixed',stem:'其他条件不变，固定利率债券的市场要求收益率上升，价格通常怎样？',en:'All else equal, if the required yield on a fixed-rate bond rises, its price most likely:',options:['上升（Increases）','下降（Decreases）','一定等于面值（Equals face value）'],answer:1,explanation:'债券现金流不变时，更高折现率使现金流现值更低，因此价格下降。',vocab:['fixed-rate bond','required yield','all else equal']},
 {id:'q-fixed-2',topic:'fixed',stem:'面值 1,000 的债券，年票息率 5%。每年票息金额是多少？',en:'A bond has a face value of 1,000 and an annual coupon rate of 5%. Its annual coupon is:',options:['5','50','100'],answer:1,explanation:'票息金额 = 面值 × 票息率 = 1,000 × 0.05 = 50。票息率以面值为基数，不是当前市价。',vocab:['face value','annual coupon rate','coupon']},
 {id:'q-fixed-3',topic:'fixed',stem:'修正久期为 3，收益率上升 100 个基点。忽略凸性，价格大约变化多少？',en:'A bond’s modified duration is 3. If yield rises by 100 basis points, its approximate price change, ignoring convexity, is:',options:['上涨 3%','下跌 3%','下跌 300%'],answer:1,explanation:'ΔP/P ≈ −3 × 0.01 = −3%。100bp = 0.01；不要把 1% 当成数值 1 代入。',vocab:['modified duration','basis points','ignoring convexity']},
 {id:'q-fixed-4',topic:'fixed',stem:'一年后支付本金 1,000 和票息 50，要求收益率为 10%。今天价格最接近多少？',en:'A bond pays 1,000 principal plus 50 coupon in one year. At a 10% required yield, its price is closest to:',options:['954.55','1,000.00','1,155.00'],answer:0,explanation:'一年后总现金流为 1,050；价格 = 1,050 / 1.10 ≈ 954.55。票息率 5% 低于要求收益率 10%，折价交易方向也符合。',vocab:['principal','coupon','required yield']},
 {id:'q-derivatives-1',topic:'derivatives',stem:'看涨期权买方通常拥有什么？',en:'The buyer of a call option has:',options:['按约定价格买入标的的权利（The right to buy）','按约定价格卖出标的的权利（The right to sell）','必须购买标的的无条件义务（An unconditional obligation to buy）'],answer:0,explanation:'Call 对应买入权，put 对应卖出权；买方是权利而非必须行权的义务。',vocab:['buyer','call option','right']},
 {id:'q-derivatives-2',topic:'derivatives',stem:'看涨期权执行价 100，到期股价 120，权利金 5。忽略资金时间价值，买方利润是多少？',en:'A call has strike 100, stock price at expiry 120 and premium 5. Ignoring time value, the buyer’s profit is:',options:['5','15','20'],answer:1,explanation:'到期收益 max(120 − 100, 0) = 20；利润 = 20 − 5 = 15。题干问利润而不是到期收益。',vocab:['strike','premium','profit']},
 {id:'q-derivatives-3',topic:'derivatives',stem:'看跌期权执行价 100，到期股价 80。到期收益是多少（不扣权利金）？',en:'A put option has strike 100 and stock price at expiry 80. Its payoff, before premium, is:',options:['0','20','80'],answer:1,explanation:'Put 到期收益 = max(K − Sₜ, 0) = max(100 − 80, 0) = 20。是否有净利润还要扣除权利金。',vocab:['put option','payoff','before premium']},
 {id:'q-alternatives-1',topic:'alternatives',stem:'相对公开交易股票，私募资产常见的特点是？',en:'Compared with publicly traded equities, private assets are often:',options:['流动性更低（Less liquid）','保证不亏损（Guaranteed against losses）','每天都有活跃公开报价（Always actively quoted daily）'],answer:0,explanation:'私募资产常有转让限制、交易不频繁等特点。估值更新不频繁不意味着真实经济风险低。',vocab:['private assets','less liquid','compared with']},
 {id:'q-alternatives-2',topic:'alternatives',stem:'数据库只保留仍在运营的基金，遗漏已关闭的基金，可能产生什么偏差？',en:'A database includes only funds still operating and excludes closed funds. The likely concern is:',options:['幸存者偏差（Survivorship bias）','所有风险已消失（Risk elimination）','保证样本更有代表性（Guaranteed representativeness）'],answer:0,explanation:'只看幸存基金会忽略退出样本者，尤其当失败基金更易退出时，可能高估历史表现。',vocab:['excludes','closed funds','survivorship bias']},
 {id:'q-portfolio-1',topic:'portfolio',stem:'组合 60% 配置于预期收益 10% 的资产，40% 配置于预期收益 5% 的资产。期望收益是多少？',en:'A portfolio has 60% in an asset with expected return 10% and 40% in one with expected return 5%. Its expected return is:',options:['6%','8%','15%'],answer:1,explanation:'E(Rₚ) = 0.60 × 10% + 0.40 × 5% = 6% + 2% = 8%。期望值不是保证实际结果。',vocab:['portfolio','weight','expected return']},
 {id:'q-portfolio-2',topic:'portfolio',stem:'下列关于分散化的说法，哪项最不可能正确？',en:'Which statement about diversification is least likely to be correct?',options:['可以降低部分公司特有风险（Can reduce company-specific risk）','可以消除所有市场风险（Can eliminate all market risk）','效果与资产相关性有关（Depends partly on correlation）'],answer:1,explanation:'least likely 要找错误项。分散化能降低非系统性风险，不能消除整个市场的系统性风险。',vocab:['least likely','diversification','market risk']},
 {id:'q-portfolio-3',topic:'portfolio',stem:'无风险利率 3%，市场期望收益率 8%，β 为 1.2。CAPM 要求收益率是多少？',en:'The risk-free rate is 3%, expected market return 8% and beta 1.2. The CAPM required return is:',options:['6.0%','9.0%','12.6%'],answer:1,explanation:'3% + 1.2 × (8% − 3%) = 3% + 6% = 9%。β 乘的是市场风险溢价 5%，不是全部市场收益 8%。',vocab:['risk-free rate','beta','market risk premium']}
];

// Short original lessons: an entry point, not a replacement for exam-year learning outcomes.
{
  const teaching = {
    ethics: {
      sections:[
        {title:'先判断义务，再判断收益',body:'伦理题经常把“客户能赚更多”放在诱人的选项里。先不要算收益，要问：信息能否使用？是否诚实？是否公平对待客户？研究有没有合理依据？保护客户利益是一项义务，但不能通过欺骗、操纵市场或利用重大非公开信息来实现。'},
        {title:'把“重大”和“未公开”分开检查',body:'重大是指理性投资者可能认为这条信息很重要；未公开是指尚未向市场广泛公开传播。两项同时满足时，不能据此交易或建议别人交易。自己知道消息、消息后来可能公开，或者自己认为交易有利于客户，都不能自动解除限制。'},
        {title:'披露是步骤，不是万能通行证',body:'分析师持股、接受礼物或收取介绍费，可能影响独立判断。题目要看冲突性质、相关限制和充分披露要求。不要把“已经披露”理解为任何行为都可以；有些行为需要拒绝、停止或采取隔离措施。回到具体义务和事实判断。'}
      ],
      pitfalls:['把“客户优先”理解为可以利用任何消息交易。','看到“披露”就直接选，不检查行为本身是否仍被禁止。'],
      selfCheck:{prompt:'你在公开财报发布前收到公司内部邮件，称主要客户已取消一笔足以影响利润的大订单。你没有持股，但客户持股。应该如何判断能否建议卖出？',answer:'① 判断影响：大订单取消可能显著影响投资决策，具有重大性。② 判断公开程度：内部邮件尚未公开。③ 两项同时成立，不能据此建议客户卖出，也不能向他人传递消息诱导交易。④ 依公司合规程序限制信息使用；不因“我是为客户好”改变判断。'}
    },
    quant: {
      sections:[
        {title:'先学会把百分数换成小数',body:'5% 表示每 100 份中的 5 份，放进乘法公式时写 0.05。100 元上涨 5%，增加 100 × 0.05 = 5 元，总额是 100 × 1.05 = 105 元。金额、收益率和时间是三个不同的量，计算前在纸上分别标注，能减少很多看似粗心的错误。'},
        {title:'现值与终值，只是沿时间线走向不同',body:'今天的钱按利率增长到未来，叫求终值，用乘法；未来的钱换算成今天，叫求现值，用除法。复利表示第一期利息也进入下一期本金。年利率要配年数，月利率要配月数；如果题目给名义年利率和复利次数，还要先换算每期利率。'},
        {title:'平均收益与波动讲的是两件事',body:'平均数描述数据中心，标准差描述数据分散程度。两组投资可能平均收益相同，却一组每年很稳定，另一组大涨大跌。期望收益则按各结果的概率加权，表示模型中的平均结果，并不保证现实一定实现。看到概率时先检查合计是否为 100%。'}
      ],
      pitfalls:['把 5% 当成数字 5 代入，或把月数直接配年利率。','把“期望收益 8%”理解成投资者一定能获得 8%。'],
      selfCheck:{prompt:'今天存入 200 元，年复利 10%，两年后取出。请先解释第一年、第二年各发生什么，再求终值。',answer:'① 第一年利息 = 200 × 0.10 = 20，年末本金加利息为 220。② 第二年按 220 计息，利息 = 22。③ 两年终值 = 242。也可写 200 × 1.10² = 242。若只得到 240，说明漏算了第一年利息的再投资。'}
    },
    economics: {
      sections:[
        {title:'沿曲线移动与整条曲线移动',body:'同一种商品因为价格下降而多卖一些，通常是沿需求曲线移动；消费者收入、偏好等其他条件改变，可能让整条需求曲线移动。做题先问“发生变化的是什么”。如果供给曲线正常向上倾斜且不变，需求向右移通常使均衡价格与数量都提高。'},
        {title:'名义增长不等于购买力增长',body:'银行账户多了钱，叫名义金额增长；如果商品价格也上涨，能买到的东西未必增加同样多。实际收益率调整了通胀。小幅利率下，可以用名义收益减通胀近似；更精确的关系是实际增长因子 = 名义增长因子 / 价格增长因子。'},
        {title:'读汇率时先写“买什么，花什么”',body:'如果报价为每 1 美元需要多少人民币，例如 1 USD = 7 CNY，数字升到 7.2，表示同一美元要花更多人民币：美元相对人民币升值，人民币相对美元贬值。不要单独背“汇率上涨等于升值”，因为交换报价方向后，数字变化的解释会反过来。'}
      ],
      pitfalls:['把商品自身价格变化误写成需求曲线整体移动。','只看到汇率数字上涨，就认定两种货币都“升值”。'],
      selfCheck:{prompt:'某投资一年名义增长 5%，同年价格水平上涨 3%。100 元投资一年后为 105 元；按年初购买力计算，实际价值和实际收益率是多少？',answer:'① 把 105 元按价格增长因子 1.03 折回年初购买力：105 / 1.03 ≈ 101.94 元。② 实际收益率 = 101.94 / 100 − 1 ≈ 1.94%。③ 用近似法 5% − 3% = 2% 也能快速检查方向，但不是精确值。'}
    },
    fsa: {
      sections:[
        {title:'资产负债表像一张时点照片',body:'资产是公司控制的资源；负债是公司承担的义务；权益是扣除负债后属于所有者的剩余部分。向银行借入现金时，现金资产增加，借款负债也增加，权益不会因为借钱而自动增加。记住等式必须保持平衡，比先背很多账户名称更有帮助。'},
        {title:'利润表与现金流量表记录不同内容',body:'利润表按收入与费用的确认规则衡量一个期间的经营成果；现金流量表追踪实际现金进出。赊销可能先形成收入和应收款，现金尚未收到；购买设备可能今天付出现金，但成本通过未来折旧逐步进入费用。因此利润高不自动说明现金充足。'},
        {title:'比率是提问工具，不是最终结论',body:'流动比率帮助观察短期偿债资源，毛利率帮助观察收入扣除销售成本后的空间。但数字变化要结合原因：库存积压也可能推高流动资产，价格上涨或产品结构变化都可能影响毛利率。先确认口径，再比较同业与历史，最后追问经济原因。'}
      ],
      pitfalls:['把银行借款当成营业收入，或把股东投入当成利润。','只看到流动比率高就认定公司一定健康，不看存货质量和现金。'],
      selfCheck:{prompt:'一家新公司先由股东投入现金 80，再向银行借款 20，目前尚未经营。资产、负债、权益和营业收入分别是多少？',answer:'① 现金资产 = 80 + 20 = 100。② 借款负债 = 20。③ 所有者权益 = 80。④ 资产 100 = 负债 20 + 权益 80，等式平衡。⑤ 两笔都是融资活动，不是销售商品或服务，营业收入仍为 0。'}
    },
    corporate: {
      sections:[
        {title:'股东、债权人与管理层的关注点',body:'债权人关注公司能否按约定还本付息，股东取得偿债等义务之后的剩余回报，管理层负责日常经营。三者的利益可能不同。治理制度用董事会监督、激励安排和信息披露等方式减少冲突，帮助决策，但不会消除商业上的不确定性。'},
        {title:'投资项目看新增现金流和时间',body:'项目今天花钱、以后收钱，不能直接比较名义总额。先识别项目带来的增量现金流，再按适当要求回报率折成今天的金额，扣除投入得到 NPV。已经发生且无法收回的沉没成本，不应因“已经花了很多”而影响未来是否继续投资的判断。'},
        {title:'利润很好也可能缺现金',body:'公司买库存、赊销给客户，却要较早付供应商和工资，中间就需要融资。营运资本管理关注钱被库存和应收款占用多久，以及应付款能提供多久的支持。延迟收款可能推动账面销售增长，却同时让现金更紧张，分析时要把经营流程串起来。'}
      ],
      pitfalls:['把项目未折现的收入减支出当成 NPV。','因为已投入很多不可收回的钱，就继续接受未来负价值的决策。'],
      selfCheck:{prompt:'一个项目今天需要投入 90，一年后预计收到 100，适当折现率为 10%。计算 NPV，并解释是否等于“保证赚 10”。',answer:'① 未来现金流现值 = 100 / 1.10 ≈ 90.91。② NPV = 90.91 − 90 ≈ 0.91，为正。③ 在这些估计与折现率合理的前提下，项目预期增加约 0.91 的现值。④ 现金流只是预计，且名义差额 10 没有扣除资金时间成本，不能说保证赚 10。'}
    },
    equity: {
      sections:[
        {title:'买股票是买一份剩余权利',body:'普通股代表公司所有权的一部分。公司未来赚钱、分红或资产价值增加，股东可能受益；经营失败时也可能损失。股利不是公司必须像债息一样支付的承诺。股票价格是市场交易形成的数字，估计价值则来自现金流、风险和增长等假设，两者可能不同。'},
        {title:'订单在价格和成交之间作取舍',body:'市价单通常追求尽快按市场可得价格成交，但快速波动或流动性不足时，成交价可能偏离你看到的报价。限价买单给出最高愿付价，限价卖单给出最低愿收价；有价格保护，却可能一直无法成交。看到 guarantee 要格外谨慎。'},
        {title:'估值公式背后都有条件',body:'P/E 用每股价格除以每股收益，比较时要区分历史收益与预期收益，并注意负利润时指标的局限。固定增长股利贴现模型把未来股利折现，假设增长长期稳定且要求回报率大于增长率。公式算得再精确，也无法修复不合理的输入假设。'}
      ],
      pitfalls:['把股票分红当作无条件固定债息，或把高历史收益当作未来保证。','在固定增长模型里误用当期股利 D₀，或忽视 r 必须大于 g。'],
      selfCheck:{prompt:'某股刚支付股利 D₀ = 1.50，预计以后每年增长 4%，要求回报率为 12%。用固定增长模型求估值。',answer:'① 模型要用下一期股利：D₁ = 1.50 × 1.04 = 1.56。② 检查 r = 12% 大于 g = 4%。③ 估值 = 1.56 / (0.12 − 0.04) = 19.50。④ 若直接用 1.50 除以 0.08，会漏掉下一期股利增长。'}
    },
    fixed: {
      sections:[
        {title:'先画现金流，再给债券定价',body:'普通固定利率债券可以理解为未来几笔现金：每期票息，到期再加本金。票息金额由面值与票息率决定，不会因为交易价格每天变化而自动变化。价格则等于这些现金流按市场要求收益率折现的总和；如存在违约等风险，简单承诺现金流模型有局限。'},
        {title:'票息率与收益率不是一回事',body:'一张面值 100、每年付息 5 的债券，票息率是 5%。如果你用 95 买入，单看当年票息除以价格，当前收益率为 5 / 95；但到期收益率还需要考虑到期收回本金的价格差、剩余时间和全部现金流。题目问哪种率，就计算哪种率。'},
        {title:'久期先帮助判断利率变化的影响',body:'在其他条件相同的普通固定现金流债券中，收益率上升通常使价格下降。修正久期可以把小幅收益率变动近似换成价格百分比变化，前面要有负号。变动较大时凸性等因素更重要；含期权债券的行为也可能不同，不要把简化规则套到所有产品。'}
      ],
      pitfalls:['混淆票息率、当前收益率和到期收益率。','久期计算忘记负号，或把 50 个基点写成 0.50。'],
      selfCheck:{prompt:'某普通债券修正久期 5，其他条件不变，收益率下降 50 个基点。忽略凸性，价格预计变化多少？',answer:'① 50 个基点 = 0.50 个百分点 = 0.005，下降所以 Δy = −0.005。② ΔP/P ≈ −5 × (−0.005) = +0.025，即约上涨 2.5%。③ 用“收益率下降、价格上涨”的方向关系检查符号。④ 这是近似，不是精确报价。'}
    },
    derivatives: {
      sections:[
        {title:'先辨认谁有权利、谁有义务',body:'远期合约约定双方未来按条件交易，双方通常都有履约义务。期权不同：买方支付权利金，取得是否行权的选择权；如果行权不利，可以放弃。期权卖方收取权利金，却在对方行权时承担相应义务。不要只背名字，要把双方现金流分别写出。'},
        {title:'Call 买入权，put 卖出权',body:'看涨期权让买方有权按执行价买入标的，标的上涨时这种权利通常更有价值；看跌期权让买方有权按执行价卖出，标的下跌时通常更有价值。到期只比较标的价格与执行价，先求非负的到期收益，再考虑买入权利金，得到利润。'},
        {title:'套期保值是改变风险结构',body:'企业担心未来采购价格上涨，可以使用适当衍生品管理风险。但合约数量、到期时间、标的与真实需求未必完全匹配，还可能有交易对手、保证金和流动性问题。因此“使用衍生品就没有风险”是错误直觉；杠杆还可能放大不利变动。'}
      ],
      pitfalls:['把看涨期权买方的权利误写为必须买入的义务。','题目问利润却只算到期收益，漏扣权利金。'],
      selfCheck:{prompt:'你花 3 买入看跌期权，执行价 50。到期标的价格为 42，忽略资金时间价值。是否行权？到期收益与利润各多少？',answer:'① 有权用 50 卖出市场上值 42 的标的，行权有利。② 到期收益 = max(50 − 42, 0) = 8。③ 买方利润 = 8 − 3 = 5。④ 8 是合约到期收益，5 才是扣初始权利金后的利润；二者不能互换。'}
    },
    alternatives: {
      sections:[
        {title:'“另类”包括很多不同东西',body:'私募股权、房地产、商品和基础设施的现金流来源与风险并不相同，有的依赖企业退出，有的依赖租金或使用费。即使归为同一大类，杠杆、期限、法律结构和管理方式也可能差异很大。先理解投资者怎样投入、怎样退出、靠什么获得收益。'},
        {title:'少报价不代表价值不波动',body:'公开股票每天交易，价格变动容易看到；私募资产可能只定期估值，报告值看起来平滑。经济状况仍在变化，交易不频繁还可能使退出更困难。分析风险时要把流动性、估值方法和数据滞后放在一起，不能仅凭报告波动低就认定风险低。'},
        {title:'先核对费用基础和样本偏差',body:'管理费可能按承诺资本、资产规模或其他基础收取，业绩报酬也可能受门槛和高水位线影响。不能看到“2 和 20”就机械地从收益减 22%。历史数据库还可能漏掉倒闭基金，或事后补录表现较好的记录，从而使回报看起来偏高。'}
      ],
      pitfalls:['把“交易少、报告价格平稳”理解为风险必然小。','忽略费用的计费基础，直接把管理费率和业绩费率相加。'],
      selfCheck:{prompt:'一个简化例子：年初投资 100，费用前盈利 10；管理费按年初金额的 1% 收取，无业绩报酬及其他费用。投资者净收益率是多少？',answer:'① 费用前期末金额为 110。② 管理费 = 100 × 1% = 1。③ 净盈利 = 10 − 1 = 9，净收益率 = 9 / 100 = 9%。④ 真实基金可能用不同计费基础；这里之所以可以直接相减，是题目已明确按同一个年初金额计算。'}
    },
    portfolio: {
      sections:[
        {title:'组合收益率用资金权重连接起来',body:'如果一半钱放在资产 A，一半放在 B，组合收益由两部分共同贡献。预期收益可以按权重加权平均；但组合波动通常不能把标准差直接加权，因为两项资产是否同涨同跌也影响风险。计算时先检查权重是否用小数表示，是否合计为 1。'},
        {title:'分散化不能让市场整体风险消失',body:'只持有一家公司的股票，容易受该公司事故影响；持有许多不同公司的股票，部分公司特有的好坏消息可以相互抵消。但经济衰退等冲击可能同时影响大量资产，这部分系统性风险仍存在。分散效果还取决于相关性，而不是仅仅数一数持有多少项资产。'},
        {title:'先了解投资者，再选择组合',body:'投资目标不只是“收益越高越好”。需要确认愿意和能够承担多大损失、何时要用钱、是否有税务法律等限制。年轻不自动等于能够承担高风险，短期必需资金也不宜只追求长期高回报。投资政策说明书把目标与约束记录下来，指导后续选择。'}
      ],
      pitfalls:['把组合标准差当成各资产标准差的简单加权平均。','以为多买几只高度相关股票，就能消除所有风险。'],
      selfCheck:{prompt:'组合有 25% 资金放在预期收益 12% 的资产，75% 放在预期收益 4% 的资产。预期收益是多少？能否据此确定组合标准差？',answer:'① 权重和 = 0.25 + 0.75 = 1。② 预期收益 = 0.25 × 12% + 0.75 × 4% = 3% + 3% = 6%。③ 无法仅凭这些数据确定标准差，还需要各资产波动及相关性等信息。④ 6% 是期望值，不是下一年保证回报。'}
    }
  };
  window.STUDY_DATA.topics.forEach(topic => Object.assign(topic,teaching[topic.id]));
  window.STUDY_DATA.methodsSources = [
    {title:'Dunlosky et al. (2013) · Improving Students’ Learning With Effective Learning Techniques',url:'https://doi.org/10.1177/1529100612453266',note:'关于练习测试、分散练习等技术的综述。一般学习研究不等于 CFA 二十天通过保证；本环境未联网核验文献。',verified:false},
    {title:'Roediger & Karpicke (2006) · Test-Enhanced Learning',url:'https://doi.org/10.1111/j.1467-9280.2006.01693.x',note:'关于提取练习与长期保持的研究。1 / 3 / 7 天是本站可执行的起始节奏，不是适用于每个人的最优间隔；本环境未联网核验文献。',verified:false}
  ];
}
