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

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Требуется поле prompt' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Ты генератор мудрых и красивых цитат. Создавай цитаты на основе заданной темы или слова.
          Возвращай ТОЛЬКО массив из 5-7 цитат в JSON формате.
          Цитаты должны быть на русском языке, вдохновляющими и содержательными.
          Формат ответа: {"quotes": ["цитата1", "цитата2", ...]}`
        },
        {
          role: "user",
          content: `Создай несколько вдохновляющих цитат на тему: "${prompt}"`
        }
      ],
      max_tokens: 300,
      temperature: 0.9,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    try {
      const parsedResponse = JSON.parse(responseText);
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      // Если OpenAI вернул не JSON, создаем структуру вручную
      const quotes = responseText
        .split('\n')
        .filter(line => line.trim() && line.length > 10)
        .map(line => line.replace(/^[\d\.\-\*\s"]+/, '').replace(/["]+$/, '').trim())
        .slice(0, 7);
      
      return NextResponse.json({ quotes });
    }

  } catch (error) {
    console.error('Ошибка OpenAI API:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации цитат' },
      { status: 500 }
    );
  }
} 