// ==========================================
// RASHI AI - VERCEL API
// Exotic Furniture Palakkad
// ==========================================

export default async function handler(req, res) {

    // --------------------------------------
    // ONLY POST
    // --------------------------------------

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    // --------------------------------------
    // CHECK API KEY
    // --------------------------------------

    const apiKey =
        process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

        console.error(
            "OPENROUTER_API_KEY is missing"
        );

        return res.status(500).json({
            error:
                "OPENROUTER_API_KEY is not configured in Vercel."
        });

    }


    // --------------------------------------
    // GET MESSAGE
    // --------------------------------------

    const { message } = req.body || {};

    if (!message) {

        return res.status(400).json({
            error: "Message is required."
        });

    }


    // --------------------------------------
    // OPENROUTER REQUEST
    // --------------------------------------

    try {

        const openRouterResponse =
            await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${apiKey}`,

                        "HTTP-Referer":
                            "https://exoticfurniture.vercel.app",

                        "X-Title":
                            "Rashi AI - Exotic Furniture Palakkad"

                    },

                    body: JSON.stringify({

                        model:
                            "openai/gpt-5.2",

                        messages: [

                            {
                                role: "system",

                                content: `
You are Rashi AI, the review-writing assistant
for Exotic Furniture Palakkad.

Your ONLY purpose is to help customers turn their
REAL experience into a natural Google review.

Business:
Exotic Furniture Palakkad

Location:
Palakkad, Kerala, India

Rules:

- Never invent customer experiences.
- Never invent products.
- Never invent prices.
- Never invent staff names.
- Never invent delivery information.
- Never invent complaints.
- Use only information provided by the customer.
- Keep the review natural and human.
- Avoid exaggerated marketing language.
- Do not repeatedly use "excellent", "amazing", or "best".
- Keep the review suitable for Google Reviews.
- If the customer gives too little information,
  ask ONE simple question.
- Otherwise provide ONE polished review.
- You may also provide a shorter alternative.

Do not claim something happened unless the customer
actually said it happened.
`
                            },

                            {
                                role: "user",

                                content: message
                            }

                        ],

                        temperature: 0.7,

                        max_tokens: 300

                    })

                }
            );


        // --------------------------------------
        // READ OPENROUTER RESPONSE
        // --------------------------------------

        const data =
            await openRouterResponse.json();


        console.log(
            "OpenRouter status:",
            openRouterResponse.status
        );


        // --------------------------------------
        // OPENROUTER ERROR
        // --------------------------------------

        if (!openRouterResponse.ok) {

            console.error(
                "OpenRouter error:",
                JSON.stringify(data)
            );

            return res
                .status(openRouterResponse.status)
                .json({

                    error:
                        data?.error?.message ||
                        "OpenRouter request failed."

                });

        }


        // --------------------------------------
        // GET AI RESPONSE
        // --------------------------------------

        const reply =
            data?.choices?.[0]?.message?.content;


        if (!reply) {

            console.error(
                "Invalid OpenRouter response:",
                JSON.stringify(data)
            );

            return res.status(500).json({

                error:
                    "OpenRouter returned no AI response."

            });

        }


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        return res.status(200).json({

            reply: reply

        });


    } catch (error) {

        console.error(
            "Rashi AI server error:",
            error
        );

        return res.status(500).json({

            error:
                "Server error while connecting to OpenRouter."

        });

    }

}