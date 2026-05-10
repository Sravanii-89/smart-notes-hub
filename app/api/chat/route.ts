import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const question =
      body.question;

    const context =
      body.context;

    if (!question) {

      return NextResponse.json(
        {
          error:
            "No question provided",
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
You are an AI academic assistant for engineering students.

Answer clearly and simply.

Explain concepts in student-friendly language.
`,
              },

              {
                role: "user",

                content:
                  `
Context:
${context}

Question:
${question}
`,
              },

            ],

          }),

        }
      );

    const data =
      await response.json();

    return NextResponse.json({

      answer:
        data?.choices?.[0]
          ?.message?.content ||
        "No response generated.",

    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "AI chat failed",
      },
      {
        status: 500,
      }
    );
  }
}