import { Message as VercelChatMessage, StreamingTextResponse, experimental_StreamData } from 'ai';
import { HuggingFaceInference } from '@langchain/community/llms/hf';
import { PromptTemplate } from '@langchain/core/prompts';
import { BytesOutputParser } from '@langchain/core/output_parsers';

export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => `${message.role}: ${message.content}`;

const TEMPLATE = `あなたは優秀なJavaエンジニアです。全ての応答は簡潔に回答してください。
コードを返却する際は必ず「\`\`\`返却したコードの言語名」で囲むようにしてください。

現在の会話履歴：
{chat_history}

User: {input}
AI:`;

export async function POST(req: Request) {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const llm = new HuggingFaceInference({
        apiKey: process.env.HUGGINGFACE_API_KEY,
        model: "codellama/CodeLlama-34b-Instruct-hf",
        maxTokens: 4096,
        topP: 0.9,
        temperature: 0.7,
        topK: 20,
        stopSequences: ["</s>", "User:"]
    });
    
    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(llm).pipe(outputParser);

    const stream = await chain.stream({
        chat_history: formattedPreviousMessages.join('\n'),
        input: currentMessageContent
    })

    return new StreamingTextResponse(stream);
}