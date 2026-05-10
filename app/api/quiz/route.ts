import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const subject =
      body.subject;

    if (!subject) {

      return NextResponse.json(
        {
          error:
            "No subject provided",
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
You are an AI engineering quiz generator.

Generate 5 MCQs.

Format EXACTLY like this:

[
  {
    "question": "...",
    "options": [
      "...",
      "...",
      "...",
      "..."
    ],
    "answer": "..."
  }
]

Return ONLY JSON.
`,
              },

              {
                role: "user",

                content:
                  `
Generate quiz for:
${subject}
`,
              },

            ],

          }),

        }
      );

    const data =
      await response.json();

    const raw =
      data?.choices?.[0]
        ?.message?.content;

    const quiz =
      JSON.parse(raw);

    return NextResponse.json({
      quiz,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Quiz generation failed",
      },
      {
        status: 500,
      }
    );
  }
}