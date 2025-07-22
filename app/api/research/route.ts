import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
})

const ukNewspapers = [
  'The Guardian',
  'The Times',
  // 'The Daily Telegraph',
  // 'Financial Times',
  // 'The Independent',
  // 'Daily Mail',
  // 'Daily Express',
  'The Sun',
]

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const researchPromises = ukNewspapers.map((newspaper) => {
      return perplexity.chat.completions.create({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a research assistant. Find information from ${newspaper} about the following topic.`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
      })
    })

    const results = await Promise.all(researchPromises)

    const content = results
      .map((result, index) => {
        const newspaper = ukNewspapers[index]
        const text = result.choices[0].message.content
        return `From ${newspaper}:\n${text}`
      })
      .join('\n\n')

    return NextResponse.json({ content })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
