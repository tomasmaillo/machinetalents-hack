import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { EmailTemplate } from '../../../emails/EmailTemplate'
import * as React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, articles } = await request.json()
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Research Results',
      react: <EmailTemplate articles={articles} />,
    })

    if (error) {
      return NextResponse.json({ error })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error })
  }
}
