import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env file.' },
        { status: 500 }
      );
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey });

    // Call Groq API with Llama 3 model
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a creative writing companion. Analyze drafts and provide writers with a few (maximum of 5) thought provoking questions to enhance writing and make user think deeper. Focus on creative angles, deeper questions, alternative perspectives, emotional depth, and structural improvements.'
        },
        {
          role: 'user',
          content: `Analyze this draft and provide maximum 5 questions (each 1-2 sentences):

${content}

Format your response as:
1. [suggestion]
2. [suggestion]
3. [suggestion]
4. [suggestion]
5. [suggestion]`
        }
      ],
      model: 'llama-3.3-70b-versatile', // Fast and high-quality model
      temperature: 0.8,
      max_tokens: 500,
      top_p: 0.95,
    });

    // Parse the response
    const generatedText = chatCompletion.choices[0]?.message?.content || '';
    
    // Extract suggestions from the numbered list
    const suggestions: string[] = [];
    const lines = generatedText.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match && match[1]) {
        suggestions.push(match[1].trim());
      }
    }

    // If parsing failed, try to split by numbers
    if (suggestions.length === 0) {
      const parts = generatedText.split(/\d+\.\s+/).filter(s => s.trim());
      suggestions.push(...parts.slice(0, 5).map(s => s.trim()));
    }

    // Ensure we have at least some suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        'Consider exploring different perspectives in your writing.',
        'Think about the emotional journey of your readers.',
        'Try adding more sensory details to bring your content to life.',
        'Experiment with varying sentence structures for better flow.',
        'Add specific examples to make your points more concrete.'
      );
    }

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 5) // Return max 5 suggestions
    });

  } catch (error: any) {
    console.error('Error in AI suggestions:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid Groq API key. Please check your configuration.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}

// Made with Bob
