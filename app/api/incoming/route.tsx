import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "../../../emails/EmailTemplate";
import * as React from "react";
import { Confirmation } from "@/emails/Confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const postBody = await request.json();
    const emailText = postBody.body;

    console.log("Received email from", postBody.from);

    const { data, error } = await resend.emails.send({
      from: "dawbell@tomasmaillo.com",
      to: postBody.from,
      subject: "We're working on it",
      react: <Confirmation />,
    });

    console.log({ data, error });
    console.log("Email sent to", postBody.from);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
