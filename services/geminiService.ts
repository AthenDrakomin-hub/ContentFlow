import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate errors, though we will handle calls gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const optimizeContent = async (title: string, content: string): Promise<{ title: string; content: string }> => {
  if (!ai) {
    throw new Error("未找到 API Key。请配置环境变量。");
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      你是一个专业的跨境发布平台内容编辑。
      请优化以下文章标题和内容，以提高参与度、清晰度和 SEO 效果。
      
      当前标题: ${title}
      当前内容: ${content}

      请以 JSON 格式返回结果，包含 'title' 和 'content' 字段。
      保持内容长度相近，但改善流畅度。请用中文回复。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    const result = response.text;
    if (!result) throw new Error("AI 没有响应");
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Gemini 优化错误:", error);
    throw error;
  }
};

export const fixComplianceIssues = async (content: string, violations: string[]): Promise<string> => {
  if (!ai) {
    throw new Error("未找到 API Key。请配置环境变量。");
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      你是一个专业的金融内容合规审核员。
      以下内容包含违规词汇或不合规描述，请重写内容以符合金融投资领域合规要求。

      违规点: ${violations.join(', ')}
      
      原始内容: ${content}

      要求：
      1. 替换绝对化用语。
      2. 补充必要的风险提示。
      3. 保持原意，但语气更客观中立。
      4. 仅返回修复后的内容字符串，不要返回JSON。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const result = response.text;
    if (!result) throw new Error("AI 没有响应");
    
    return result;
  } catch (error) {
    console.error("Gemini 合规修复错误:", error);
    throw error;
  }
};

export const generateCourseScript = async (topic: string, sentiment: string, points: string[]): Promise<string> => {
  if (!ai) {
    throw new Error("未找到 API Key。请配置环境变量。");
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      你是一个名为“夜风”的资深股票讲师，正在为国际版飞书群的学员准备【图文讲义】。
      
      讲义主题: ${topic}
      当前市场情绪: ${sentiment} (Bullish=看多, Bearish=看空, Neutral=震荡)
      核心知识点: ${points.join(', ')}

      生成要求：
      1. **格式友好**：使用 Emoji (📈, 📉, 💡, 🚫) 来作为段落标记，适合IM群聊阅读。
      2. **结构清晰**：包含【盘面观点】、【核心逻辑】、【操作建议】、【风险提示】。
      3. **风格**：专业、犀利、干货满满。
      4. 直接返回Markdown格式的内容。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const result = response.text;
    if (!result) throw new Error("AI 没有响应");
    
    return result;
  } catch (error) {
    console.error("Gemini 脚本生成错误:", error);
    throw error;
  }
};