import { streamText } from 'ai';
import { getModel, BODYWISE_SYSTEM_PROMPT, DEFAULT_MODEL, type ModelId } from '@/ai/providers';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json();

    // validate models selection
   // so that we avoid runtime errors when one model is not responding *_*
    const selectedModel = (modelId || DEFAULT_MODEL) as ModelId;

    const result = streamText({
      model: getModel(selectedModel),
      system: BODYWISE_SYSTEM_PROMPT,
      messages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request. Please try again.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
