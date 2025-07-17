import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY не настроен в .env.local' },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Требуется поле message' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Ты помощник, который генерирует красивые и точные эпитеты (синонимы, прилагательные, описательные слова) для заданного слова. 
          Возвращай ТОЛЬКО массив из 10 эпитетов в JSON формате. 
          Эпитеты должны быть на русском языке, разнообразными и подходящими по смыслу.
          Формат ответа: {"epithets": ["эпитет1", "эпитет2", ...]}`
        },
        {
          role: "user",
          content: `Сгенерируй 10 эпитетов для слова: "${message}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    try {
      const parsedResponse = JSON.parse(responseText);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // Если OpenAI вернул не JSON, создаем структуру вручную
      const epithets = responseText
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[\d\.\-\*\s]+/, '').trim())
        .slice(0, 10);
      
      return NextResponse.json({ epithets });
    }

  } catch (error) {
    console.error('Ошибка OpenAI API:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации эпитетов' },
      { status: 500 }
    );
  }
} 