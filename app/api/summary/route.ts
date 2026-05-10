import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const text =
      body.text;

    if (!text) {

      return NextResponse.json(
        {
          error:
            "No text provided",
        },
        {
          status: 400,
        }
      );
    }

    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            model:
  "openai/gpt-3.5-turbo",

            messages: [

              {
                role: "system",

                content:
                  `
You are an academic AI assistant.

Summarize uploaded engineering notes.

Provide:
1. Short summary
2. Important topics
3. Key concepts
4. Quick revision points

Keep response clean and student-friendly.
`,
              },

              {
                role: "user",

                content: text,
              },

            ],

          }),

        }
      );

    const data =
      await response.json();

    return NextResponse.json({

      summary:
        data?.choices?.[0]
          ?.message?.content ||
        "No summary generated.",

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "AI summary failed",
      },
      {
        status: 500,
      }
    );
  }
}