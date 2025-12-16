
import { Template, AuditResult } from '../types';

export const TEMPLATES: Record<string, Template> = {
  'tech-news': {
    id: 'tech-news',
    name: '科技资讯模板',
    description: '适合发布科技新闻、产品评测、行业分析等内容',
    title: '2025年人工智能行业发展趋势分析',
    content: `<h2>人工智能技术持续创新发展</h2>
<p>2025年，人工智能技术在多个领域取得重要突破，特别是在自然语言处理、计算机视觉和机器学习等方面。</p>
<h3>技术发展特点</h3>
<ul>
    <li>大模型能力持续提升，参数规模和训练数据不断增加</li>
    <li>多模态融合成为发展趋势，文本、图像、音频等信息综合处理</li>
    <li>边缘计算与AI结合，实现更高效的实时处理</li>
</ul>
<h3>应用场景拓展</h3>
<p>人工智能技术在医疗、教育、金融、制造等行业的应用不断深化，为产业升级提供了有力支撑。</p>
<h3>发展建议</h3>
<p>企业应加强AI技术研发投入，培养专业人才，同时关注技术伦理和安全问题，推动人工智能健康发展。</p>`,
    platform: 'baijiahao',
    tags: [
      { text: '合规', color: 'blue' },
      { text: 'AI友好', color: 'green' },
      { text: '科技', color: 'purple' }
    ],
    rules: [
      '避免使用"最先进"、"第一"等极限用语',
      '技术数据需有权威来源',
      '禁止预测政策走向'
    ],
    icon: 'microchip',
    color: 'blue'
  },
  'retail-recovery': {
    id: 'retail-recovery',
    name: '散户回血指南',
    description: '基于2025调研报告，针对亏损散户的痛点分析与策略',
    title: '给2025年12月入市的新股民：如何打破“七亏二平一赚”的魔咒？',
    content: `<h2>为什么越努力交易，亏损越多？</h2>
<p>调研数据显示，月均交易超过20次的高频短线交易者，仅手续费就能吞噬24%的收益，亏损比例高达82%。</p>
<h3>三大致命习惯</h3>
<ul>
    <li><strong>频繁交易：</strong>决策疲劳，导致非理性选择。</li>
    <li><strong>追涨杀跌：</strong>看到上涨就FOMO（错失恐惧症），看到下跌就恐慌割肉。</li>
    <li><strong>缺乏止损：</strong>陷入“鸵鸟心态”，不仅不卖，反而逆势补仓，导致深套。</li>
</ul>
<h3>回血策略</h3>
<p>1. <strong>降低频率：</strong>管住手，减少无效操作，拒绝“为券商打工”。</p>
<p>2. <strong>科学分仓：</strong>拒绝满仓梭哈，建议采用“金字塔建仓法”。</p>
<p>3. <strong>建立规则：</strong>买入前想好卖出点，严格执行纪律。</p>
<p><strong>投资有风险，入市需谨慎。本文仅作为投资理念分享，不构成具体个股推荐。</strong></p>`,
    platform: 'baijiahao',
    tags: [
      { text: '干货', color: 'orange' },
      { text: '散户', color: 'green' },
      { text: '高阅读', color: 'red' }
    ],
    rules: [
      '严禁承诺收益（如“稳赚”、“翻倍”）',
      '数据需引用调研报告',
      '必须包含风险提示'
    ],
    icon: 'activity',
    color: 'orange'
  },
  'product-promotion': {
    id: 'product-promotion',
    name: '产品推广模板',
    description: '适合发布产品介绍、使用教程、购买指南等内容',
    title: '智能办公系统产品介绍',
    content: `<h2>智能办公系统助力企业数字化转型</h2>
<p>我们的智能办公系统集成了多种功能模块，帮助企业提升办公效率，降低运营成本。</p>
<h3>核心功能</h3>
<ul>
    <li>智能考勤管理，支持多种打卡方式</li>
    <li>项目协作平台，实时沟通和文件共享</li>
    <li>数据分析报表，提供决策支持</li>
</ul>
<h3>产品优势</h3>
<p>系统采用云原生架构，安全稳定，易于部署和维护。用户界面友好，操作简单，员工上手快。</p>
<h3>联系我们</h3>
<p>咨询电话：400-123-4567（工作时间：9:00-18:00）</p>
<p>官方网站：www.example.com</p>`,
    platform: 'baijiahao',
    tags: [
      { text: '合规', color: 'green' },
      { text: '推广', color: 'orange' },
      { text: '需谨慎', color: 'red' }
    ],
    rules: [
      '电话信息必须真实有效',
      '禁止使用"最佳"、"首选"等词汇',
      '避免夸大产品效果'
    ],
    icon: 'shopping-bag',
    color: 'green'
  },
  'industry-analysis': {
    id: 'industry-analysis',
    name: '行业分析模板',
    description: '适合发布市场分析、趋势预测、政策解读等内容',
    title: '2025年云计算市场发展报告',
    content: `<h2>云计算市场规模持续扩大</h2>
<p>根据权威机构统计，2025年全球云计算市场规模达到XX亿美元，同比增长XX%。</p>
<h3>市场结构分析</h3>
<ul>
    <li>IaaS市场占比XX%，仍为主要组成部分</li>
    <li>PaaS市场增长迅速，占比达到XX%</li>
    <li>SaaS市场稳步发展，占比XX%</li>
</ul>
<h3>区域发展特点</h3>
<p>北美地区仍为最大市场，亚太地区增长最快，中国市场表现突出。</p>
<h3>未来趋势</h3>
<p>边缘计算、混合云、绿色计算将成为云计算发展的重要方向。</p>
<p>数据来源：XX研究机构《2025年云计算市场报告》</p>`,
    platform: 'baijiahao',
    tags: [
      { text: '分析', color: 'purple' },
      { text: '数据', color: 'blue' },
      { text: '合规', color: 'green' }
    ],
    rules: [
      '数据必须有明确来源',
      '避免主观臆断性预测',
      '保持客观中立的分析立场'
    ],
    icon: 'bar-chart',
    color: 'purple'
  },
  'service-push': {
    id: 'service-push',
    name: '服务号群发模板',
    description: '适合重要通知、活动推广、用户互动等内容',
    title: '【重要通知】会员权益升级公告',
    content: `<h2>尊敬的会员用户：</h2>
<p>为了给您提供更好的服务体验，我们将于2025年12月20日起对会员权益进行全面升级。</p>
<h3>升级内容</h3>
<ul>
    <li>新增专属客服通道，优先处理会员咨询</li>
    <li>会员积分兑换比例提升20%</li>
    <li>每月可享受一次免费专业咨询服务</li>
</ul>
<h3>注意事项</h3>
<p>1. 升级后的权益自动生效，无需手动操作</p>
<p>2. 如有疑问，请联系客服热线：400-888-9999</p>
<p>3. 本活动最终解释权归本公司所有</p>
<p>感谢您的支持与信任，我们将持续为您提供优质服务！</p>`,
    platform: 'wechat',
    tags: [
      { text: '群发', color: 'green' },
      { text: '每月4次', color: 'yellow' },
      { text: '合规', color: 'blue' }
    ],
    rules: [
      '内容需有实际价值',
      '避免过度营销',
      '联系方式需真实'
    ],
    icon: 'bullhorn',
    color: 'green'
  },
  'service-publish': {
    id: 'service-publish',
    name: '服务号发布模板',
    description: '适合日常更新、知识分享、内容沉淀等内容',
    title: '职场效率提升技巧分享',
    content: `<h2>提升职场效率的五个实用技巧</h2>
<p>在快节奏的工作环境中，提升效率是每个职场人都关心的话题。以下分享五个经过验证的实用技巧：</p>
<h3>1. 制定清晰的目标计划</h3>
<p>每天开始工作前，花10分钟制定当天的工作计划，明确优先级。</p>
<h3>2. 学会时间管理</h3>
<p>采用番茄工作法，25分钟专注工作，5分钟休息，提高专注力。</p>
<h3>3. 减少干扰因素</h3>
<p>工作时关闭不必要的通知，创建专注的工作环境。</p>
<h3>4. 持续学习提升</h3>
<p>定期学习新技能，提升工作能力和效率。</p>
<h3>5. 保持良好心态</h3>
<p>适当休息，保持积极心态，避免 burnout。</p>
<p>希望这些技巧能帮助您提升工作效率，实现职业发展目标！</p>`,
    platform: 'wechat',
    tags: [
      { text: '发布', color: 'blue' },
      { text: '不限次数', color: 'green' },
      { text: '内容', color: 'purple' }
    ],
    rules: [
      '内容需实用有价值',
      '避免敏感话题',
      '可进入公域推荐'
    ],
    icon: 'file-text',
    color: 'blue'
  },
  'ai-content': {
    id: 'ai-content',
    name: 'AI内容模板',
    description: '适合AI生成内容，已包含合规标注和审核提示',
    title: 'AI辅助生成：2025年科技发展趋势展望',
    content: `<p><strong>本文由AI辅助生成，内容仅供参考，具体请以实际情况为准。</strong></p>
<h2>2025年科技发展趋势展望</h2>
<p>随着技术的不断进步，2025年将是科技发展的重要一年。以下是对几个关键领域的发展趋势展望：</p>
<h3>人工智能</h3>
<p>AI技术将在更多领域得到应用，特别是在医疗健康、教育、金融等行业。大模型的能力将进一步提升，多模态融合成为发展方向。</p>
<h3>元宇宙</h3>
<p>元宇宙技术逐渐成熟，虚拟与现实的融合更加紧密，将改变人们的工作和生活方式。</p>
<h3>绿色科技</h3>
<p>可持续发展成为重要主题，绿色能源、环保技术将得到更多关注和投资。</p>
<h3>量子计算</h3>
<p>量子计算技术取得重要突破，将为科学研究和产业发展带来新的机遇。</p>
<p><strong>本服务包含AI分析，不构成专业投资建议。</strong></p>`,
    platform: 'wechat',
    tags: [
      { text: 'AI', color: 'purple' },
      { text: '必须标注', color: 'red' },
      { text: '合规', color: 'green' }
    ],
    rules: [
      '必须标注AI生成说明',
      '避免虚假预测',
      '添加免责声明'
    ],
    icon: 'bot',
    color: 'purple'
  }
};

// 2025年金融投资领域内容平台合规政策指南 - 核心词库
const COMPLIANCE_RULES = {
  // 3.1 绝对禁止 (Absolute Prohibition)
  absolute: [
    '稳赚不赔', '无风险', '零风险', '高回报', '快速升值', '保值增值', 
    '收益高达', '包赚', 'guaranteed returns', '必定翻倍', '100%本息保障', 
    '保本保息', '稳赚', '只赚不赔', '豪赚', '躺赚', '祖传代码', '内幕消息', 
    '暴富', '翻身', '梭哈'
  ],
  // 3.1 极限用语 (Extreme Words)
  extreme: [
    '最', '最佳', '最具', '最赚', '最优', '最优秀', '最好', '最大', 
    '最大程度', '最高', '最低', '最便宜', '最新', '最先进', '首选', '唯一', 
    '顶级', '世界级', '国家级', '第一品牌', '王牌', '极致', '极品', '绝无仅有'
  ],
  // 3.1 权威性词汇 (Authority)
  authority: [
    '质量免检', '老字号', '中国驰名商标', '特供', '专供', '国家领导人推荐', '特级'
  ],
  // 3.1 虚拟货币 (Crypto - Baijiahao strict)
  crypto: [
    '比特币', '虚拟货币', 'ICO', '代币', '数字货币', '挖矿', '以太坊', '泰达币', 'BTC', '加密货币'
  ],
  // 3.2 限制使用 (Cautionary - Requires Risk Warning)
  cautionary: [
    '高收益', '年化收益率', '投资回报', '预期收益', '历史回报', '升值空间', '分红', '股息'
  ],
  // 1.2 违规荐股 (Illegal Stock Rec)
  stock_rec: [
    '荐股', '跟买必涨', '主力资金', '拉升在即', '黑马股', '牛股推荐', '代码私发', 
    '加群', '免费领股', '跟投', '带飞', '建仓', '抄底', '解套'
  ],
  // 3.1 广告法标识 (Ad Marking)
  ad_indicators: [
    '购买', '下单', '优惠', '折扣', '抢购', '点击', '扫码'
  ]
};

const RISK_DISCLOSURE_KEYWORDS = ['投资有风险', '入市需谨慎', '风险自担', '不构成投资建议', '过往业绩不代表未来表现', '风险提示'];

// Helper to remove HTML tags for word count and analysis
const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

export function performAudit(title: string, content: string, platform: string): { violations: AuditResult[], safeItems: string[], suggestions: string[] } {
  const violations: AuditResult[] = [];
  const safeItems: string[] = [];
  const suggestions: string[] = [];
  
  const cleanContent = stripHtml(content);
  const fullText = `${title} ${cleanContent}`;
  // Handle loose platform matching
  const isBaijiahao = platform.toLowerCase().includes('百家号') || platform.toLowerCase().includes('baijiahao');
  const isWechat = platform.toLowerCase().includes('微信') || platform.toLowerCase().includes('wechat') || platform.toLowerCase().includes('service');

  // 1. 违禁词检测
  // Absolute
  COMPLIANCE_RULES.absolute.forEach(word => {
    if (fullText.includes(word)) {
      violations.push({
        type: '绝对违禁词',
        content: `检测到"${word}"`,
        suggestion: '根据2025新规，严禁使用收益承诺类词汇，请立即删除。'
      });
    }
  });

  // Extreme
  COMPLIANCE_RULES.extreme.forEach(word => {
    if (fullText.includes(word)) {
      violations.push({
        type: '极限用语',
        content: `检测到"${word}"`,
        suggestion: '广告法及平台规则禁止使用绝对化用语，请使用"较好"、"优秀"等程度副词替代。'
      });
    }
  });

  // Authority
  COMPLIANCE_RULES.authority.forEach(word => {
    if (fullText.includes(word)) {
      violations.push({
        type: '违规权威背书',
        content: `检测到"${word}"`,
        suggestion: '禁止借用国家机构或权威名义进行宣传，请修改。'
      });
    }
  });

  // Crypto (Strict on Baijiahao, Generally risky elsewhere)
  if (isBaijiahao) {
    COMPLIANCE_RULES.crypto.forEach(word => {
      if (fullText.includes(word)) {
        violations.push({
          type: '平台高压线',
          content: `检测到虚拟货币词汇"${word}"`,
          suggestion: '百家号严禁发布虚拟货币、ICO相关内容，面临直接封号风险。'
        });
      }
    });
  } else {
     COMPLIANCE_RULES.crypto.forEach(word => {
      if (fullText.includes(word)) {
        suggestions.push(`检测到"${word}"，请注意相关政策风险，避免涉及非法交易。`);
      }
    });
  }

  // Stock Rec (Strict on WeChat)
  if (isWechat) {
     COMPLIANCE_RULES.stock_rec.forEach(word => {
      if (fullText.includes(word)) {
        violations.push({
          type: '违规荐股风险',
          content: `检测到"${word}"`,
          suggestion: '微信公众平台严厉打击无资质荐股（包括加群、私发代码），请确保内容合规。'
        });
      }
    });
  }

  // 2. 平台特定规则与排版规范
  // Baijiahao Title Length (1.1 in Guide)
  if (isBaijiahao && title.length > 30) {
     violations.push({
        type: '标题规范',
        content: `标题长度${title.length}字`,
        suggestion: '百家号要求标题控制在30字以内，以确保移动端显示完整。'
     });
  }

  // Paragraph Length (Page 8 in Guide: < 200 words)
  if (isBaijiahao) {
    const paragraphs = cleanContent.split('\n').filter(p => p.trim().length > 0);
    const longParagraphs = paragraphs.filter(p => p.length > 200);
    if (longParagraphs.length > 0) {
        suggestions.push(`检测到${longParagraphs.length}个段落超过200字，建议分段以提升移动端阅读体验。`);
    }
  }

  // 3. 广告标识 (Ad Marking - Page 8)
  const isAd = COMPLIANCE_RULES.ad_indicators.some(w => fullText.includes(w));
  const hasAdMark = fullText.includes('广告');
  if (isAd && !hasAdMark) {
      suggestions.push('内容疑似包含商业推广信息（购买/优惠等），根据新规建议显著标明"广告"。');
  }

  // 4. 风险提示检测 (Risk Disclosure)
  // If content contains cautionary words or is financial in nature (heuristic), check for risk warning.
  const hasCautionaryWords = COMPLIANCE_RULES.cautionary.some(w => fullText.includes(w));
  const hasRiskWarning = RISK_DISCLOSURE_KEYWORDS.some(kw => fullText.includes(kw));
  
  if (hasCautionaryWords && !hasRiskWarning) {
     violations.push({
        type: '风险提示缺失',
        content: '涉及收益描述但未见风险提示',
        suggestion: '根据《金融产品网络营销管理办法》，必须显著标示"投资有风险，入市需谨慎"（遵循风险前置化原则）。'
     });
  } else if (hasRiskWarning) {
     safeItems.push('已包含合规风险提示');
  }

  // 5. AI 内容标注 (6.1 in Guide)
  const aiKeywords = ['AI生成', '人工智能生成', 'AI辅助', 'AI分析', '智能生成'];
  const hasAILabel = aiKeywords.some(kw => fullText.includes(kw));
  
  // Basic heuristic: if tags contain AI or content mentions AI generation
  const mentionsAI = fullText.toLowerCase().includes('ai') || fullText.includes('智能');

  if (mentionsAI && !hasAILabel) {
      suggestions.push('如本文包含AI生成内容，请根据2025新规，在开头或结尾标注"本服务包含AI分析，不构成专业投资建议"，否则可能被按侵权处理。');
  } else if (hasAILabel) {
      safeItems.push('已标注AI生成内容');
  }

  // 6. 电话/联系方式检测
  if (content.includes('电话') || content.includes('微信') || content.includes('手机')) {
      // Simple regex for phone
      if (/(\d{4}-\d{3}-\d{4}|\d{11})/.test(content)) {
          safeItems.push('联系方式格式规范');
      } else {
           suggestions.push('检测到联系方式，请确保真实有效，避免被判定为垃圾营销。');
      }
  }

  if (violations.length === 0) {
      safeItems.push('未检测到明显违规词汇');
      suggestions.push('建议在发布前进行人工复核，确保数据真实性（多源交叉验证）。');
  }

  return { violations, safeItems, suggestions };
}
