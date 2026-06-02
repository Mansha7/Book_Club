import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ hints: [] });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ hints: [] });
    }

    const groq = new Groq({ apiKey });

    // Generate subtle, thought-provoking questions
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a subtle writing coach. Generate 1-2 brief, thought-provoking questions (5-8 words each) that make writers think deeper about their content. Be gentle, curious, and non-intrusive. Focus on: unexplored angles, emotional depth, reader perspective, or clarity.'
        },
        {
          role: 'user',
          content: `Content: "${content.substring(0, 500)}..."

Generate 1-2 short questions (5-8 words each) that gently nudge the writer to think deeper. Format as a simple list, one per line.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = chatCompletion.choices[0]?.message?.content || '';
    
    // Parse hints from response
    const hints = response
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0 && line.length < 100)
      .slice(0, 3);

    return NextResponse.json({ hints });

  } catch (error) {
    console.error('Error generating AI hints:', error);
    return NextResponse.json({ hints: [] });
  }
}
