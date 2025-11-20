
import { GoogleGenAI } from "@google/genai";

// This is a placeholder for the real API key which would be in process.env.API_KEY
// In a real application, ensure this is handled securely and not hardcoded.
const FAKE_API_KEY = "YOUR_API_KEY_HERE";

// A mock implementation of the Gemini service.
// In a real app, this would make network requests to the Gemini API.
export const getQuestFeedback = async (questTitle: string, userSubmission: string): Promise<string> => {
  console.log(`Getting feedback for "${questTitle}"...`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real scenario, you'd use the Gemini API like this:
  /*
  try {
    if (!process.env.API_KEY) {
      // In a real app, you might show a message to the user to configure their key
      return "Erro: Chave de API não configurada. A análise de IA está indisponível.";
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `O usuário completou a missão de comunicação: "${questTitle}".
      A submissão do usuário foi: "${userSubmission}".
      Forneça um feedback construtivo e encorajador em português, com 2-3 frases, sobre como ele pode melhorar.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Não foi possível obter o feedback da IA no momento. Tente novamente mais tarde.";
  }
  */

  // Mocked response for demonstration
  if (questTitle.toLowerCase().includes('respiração')) {
    return "Ótimo começo! Sua respiração pareceu calma. Tente focar em tornar a expiração um pouco mais longa que a inspiração para um efeito ainda mais relaxante.";
  }
  if (questTitle.toLowerCase().includes('apresentação')) {
    return "Excelente energia! Você sorriu e falou claramente. Na próxima vez, tente adicionar um gesto com a mão para dar mais ênfase a uma de suas qualidades.";
  }
  if (questTitle.toLowerCase().includes('trava-línguas')) {
    return "Muito bem! A velocidade aumentou progressivamente. Notei uma pequena hesitação na última repetição. Pratique mais uma vez para uma execução perfeita!";
  }

  return "Bom trabalho ao completar esta missão! Continue praticando para aprimorar ainda mais suas habilidades. A consistência é a chave para o sucesso.";
};
