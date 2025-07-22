import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query, email } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for sending results" },
        { status: 400 }
      );
    }

    // Step 1: Fetch news from SearchAPI
    const searchApiUrl = `https://www.searchapi.io/api/v1/search?engine=google_news&q=${encodeURIComponent(query)}&time_period=last_day&sort_by=most_recent&api_key=${process.env.SEARCHAPI_API_KEY}`;

    const response = await fetch(searchApiUrl);

    if (!response.ok) {
      throw new Error(
        `SearchAPI request failed with status: ${response.status}`
      );
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

    // Step 2: Format articles for display and email
    const formattedContent = articles
      .slice(0, 10) // Limit to top 10 articles
      .map((article: any, index: number) => {
        const title = article.title || "No title";
        const snippet = article.snippet || "No description available";
        const source = article.source || "Unknown source";
        const date = article.date || "No date";
        const link = article.link || "";

        return `${index + 1}. **${title}**
Source: ${source} | Date: ${date}
${snippet}
${link ? `Link: ${link}` : ""}
`;
      })
      .join("\n\n");

    // Step 3: Transform data for email template
    const emailArticles = articles.slice(0, 10).map((article: any) => ({
      title: article.title || "No title",
      url: article.link || "#",
      description: article.snippet || "No description available",
      editorial: `${article.source || "Unknown source"} • ${article.date || "No date"}`,
    }));

    // Step 4: Send email with results
    let emailResult = null;
    let emailSent = false;

    try {
      const emailResponse = await fetch(
        `${process.env.BASE_URL || "http://localhost:3000"}/api/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            articles: emailArticles,
          }),
        }
      );

      if (emailResponse.ok) {
        emailResult = await emailResponse.json();
        emailSent = true;
      } else {
        console.error("Failed to send email:", await emailResponse.text());
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    // Step 5: Return comprehensive response
    return NextResponse.json({
      content: formattedContent,
      query,
      articlesCount: emailArticles.length,
      emailSent,
      emailResult: emailSent ? emailResult : null,
      message: emailSent
        ? `Research complete! Found ${emailArticles.length} articles about "${query}" and sent results to ${email}`
        : `Research complete! Found ${emailArticles.length} articles about "${query}" but failed to send email`,
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
