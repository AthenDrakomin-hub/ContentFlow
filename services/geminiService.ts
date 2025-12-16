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