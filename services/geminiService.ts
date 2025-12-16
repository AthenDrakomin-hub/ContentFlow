
// 替代原有的 Gemini AI 服务
// 使用本地规则和模版引擎来模拟智能功能，无需外部 API Key

export const optimizeContent = async (title: string, content: string): Promise<{ title: string; content: string }> => {
  // 模拟网络处理延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  let optimizedTitle = title.trim();
  // 简单的标题优化规则：添加吸睛前缀
  if (!optimizedTitle.startsWith('【')) {
    const prefixes = ['【深度】', '【独家】', '【复盘】', '【干货】'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    optimizedTitle = `${randomPrefix}${optimizedTitle}`;
  }

  let optimizedContent = content.trim();
  // 简单的内容优化规则：添加摘要和排版提示
  if (!optimizedContent.includes('摘要')) {
      const summary = optimizedContent.slice(0, 60).replace(/\n/g, ' ') + '...';
      optimizedContent = `> **摘要**：${summary}\n\n${optimizedContent}`;
  }
  
  // 模拟结尾添加引导
  if (!optimizedContent.includes('关注')) {
      optimizedContent += `\n\n-------------------\n👉 点击关注，不错过每一个投资机会！`;
  }

  return { 
    title: optimizedTitle, 
    content: optimizedContent 
  };
};

export const fixComplianceIssues = async (content: string, violations: string[]): Promise<string> => {
  // 模拟处理
  await new Promise(resolve => setTimeout(resolve, 1000));

  let fixedContent = content;
  
  // 规则库：违禁词 -> 合规词
  const rules: Record<string, string> = {
      '稳赚': '具有潜力',
      '必涨': '看好',
      '暴富': '财富积累',
      '翻倍': '大幅增长',
      '无风险': '风险可控',
      '第一': '领先',
      '最': '较',
      '保证': '力争',
      '承诺': '预计',
      '100%': '极大概率'
  };

  // 执行替换
  Object.entries(rules).forEach(([bad, good]) => {
      fixedContent = fixedContent.split(bad).join(good);
  });

  // 强制添加风险提示
  const riskWarning = '\n\n【风险提示】市场有风险，投资需谨慎。本文仅代表个人观点，不构成投资建议。';
  if (!fixedContent.includes('风险') && !fixedContent.includes('谨慎')) {
      fixedContent += riskWarning;
  }

  return fixedContent;
};

export const generateCourseScript = async (topic: string, sentiment: string, points: string[]): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const sentimentEmoji = sentiment === 'bullish' ? '📈 看多 (Bullish)' : sentiment === 'bearish' ? '📉 看空 (Bearish)' : '⚖️ 震荡 (Neutral)';
  
  // 基于模版生成
  return `# ${topic}

## 1. 市场观点
当前市场情绪：**${sentimentEmoji}**

## 2. 核心要点
${points.length > 0 ? points.map((p, i) => `${i + 1}. **${p}**`).join('\n') : '1. **关注资金流向**\n2. **控制仓位节奏**'}

## 3. 详细解析
本节课我们将深入探讨 **${topic}**。

### 逻辑分析
结合当前 ${sentimentEmoji} 的市场环境，我们注意到以下几个关键信号：
- **资金面**：近期主力资金动向显示...
- **技术面**：关键均线系统呈现...

### 实战策略
${points.length > 0 ? `针对"${points[0]}"，建议投资者：` : '建议投资者：'}
> 保持理性，严格执行交易纪律，不要追涨杀跌。

## 4. 总结与作业
请大家复盘今日行情，并观察上述提到的关键点位。

---
*本讲义由系统模版自动生成*
`;
};
