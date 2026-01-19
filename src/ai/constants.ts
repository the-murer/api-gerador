import { ModelMessage } from "ai";
import { Message, MessageRole } from "./schemas/message.schema";
import { Document } from "./schemas/document.schema";

export const SYSTEM_PROMPT = `
Você é um assistente de IA`

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 100;
export const BATCH_SIZE = 100;


export interface SearchResult {
  content: string;
  score: number;
  metadata: Document;
  chunkIndex: number;
}
export type Embed = number[];


export const parseMessages = (messages: Message[], userMessage: string): ModelMessage[] => {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  })).concat({
    role: MessageRole.USER,
    content: userMessage,
  });
}



export const TITLE_PROMPT = `
Você é um gerador de títulos para conversas de chat do sistema de financiamentos da Ideal veículos. Sua tarefa é analisar a primeira mensagem ou trecho inicial da conversa e criar um título conciso, descritivo e relevante.

Diretrizes:
- O título deve ter entre 3-8 palavras
- Deve capturar o tema principal ou intenção da conversa
- Use linguagem clara e direta, evite jargões desnecessários
- Não inclua aspas, pontos finais ou formatação especial
- Se a conversa for técnica, mantenha termos técnicos relevantes
- Se houver múltiplos tópicos, priorize o primeiro/principal
- Mantenha o tom consistente com o contexto (formal/informal)

Exemplos:
- Prompt: "Como faço para resetar minha senha?" → Título: "Redefinição de Senha"
- Prompt: "Preciso de ajuda com um bug no código Python..." → Título: "Correção de Bug Python"
- Prompt: "Quais são as melhores práticas para..." → Título: "Melhores Práticas de [tema]"

Retorne APENAS o título, sem explicações adicionais.`;
