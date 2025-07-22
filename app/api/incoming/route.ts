import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const postBody = await request.json()
    const emailText = postBody.body;

    console.log({emailText});
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
