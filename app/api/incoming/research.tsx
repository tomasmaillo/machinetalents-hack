import { EmailTemplate } from "@/emails/EmailTemplate";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function research(query: string, email: string) {
  try {
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required for sending results" }, { status: 400 });
    }

    // Step 1: Fetch news from SearchAPI
    const searchApiUrl = `https://www.searchapi.io/api/v1/search?engine=google_news&q=${encodeURIComponent(query)}&time_period=last_day&sort_by=most_recent&api_key=${process.env.SEARCHAPI_API_KEY}`;

    const response = await fetch(searchApiUrl);

    if (!response.ok) {
      throw new Error(`SearchAPI request failed with status: ${response.status}`);
    }

    const data = await response.json();

    // Extract news articles from organic_results
    const articles = data.organic_results || [];

    if (articles.length === 0) {
      return NextResponse.json({
        content: `No recent news found for: ${query}`,
        emailSent: false,
      });
    }

    console.log({ articles });


    // Step 3: Transform data for email template
    const emailArticles = articles.slice(0, 10).map((article: any) => ({
      title: article.title || "No title",
      url: article.link || "#",
      description: article.snippet || "No description available",
      editorial: `${article.source || "Unknown source"} • ${article.date || "No date"}`,
    }));

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "dawbell@tomasmaillo.com",
      to: email,
      subject: "Your Research Results",
      react: <EmailTemplate articles={emailArticles} />,
    });

    console.log({ emailData, emailError });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch news data",
        details: error instanceof Error ? error.message : "Unknown error",
        emailSent: false,
      },
      { status: 500 }
    );
  }
}
