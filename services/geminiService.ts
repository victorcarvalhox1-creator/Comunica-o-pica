import { GoogleGenAI } from "@google/genai";

// In production, this uses the key from Vercel Environment Variables
// Ensure you add API_KEY to your Vercel Project Settings
const getApiKey = () => process.env.API_KEY;

export const getQuestFeedback = async (questTitle: string, userSubmission: string): Promise<string> => {
  console.log(`Getting feedback for "${questTitle}"...`);

  const apiKey = getApiKey();

  // If API Key is available, use the real Gemini API
  if (apiKey && apiKey !== "AIzaSyA-AssPA1IdD0UKWDn7rkyXmjcd8eDM04U") {
    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `O usuário completou a missão de comunicação: "${questTitle}".
          A submissão do usuário foi: "${userSubmission}".
          Atue como um treinador de oratória experiente.
          Forneça um feedback construtivo, motivador e curto (máximo 3 frases) em português.`,
        });
        
        if (response.text) {
            return response.text;
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback to mock if API fails
    }
  }

  // Mock implementation as fallback (or if no key is present)
  await new Promise(resolve => setTimeout(resolve, 1500));

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