// ==========================================
// RASHI AI API
// Vercel Serverless Function
// OpenRouter
// ==========================================

export default async function handler(req, res) {

    // ------------------------------------------
    // CORS
    // ------------------------------------------

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ------------------------------------------
    // OPTIONS
    // ------------------------------------------

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // ------------------------------------------
    // ONLY POST
    // ------------------------------------------

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });

    }


    // ------------------------------------------
    // CHECK API KEY
    // ------------------------------------------

    const apiKey =
        process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

        console.error(
            "OPENROUTER_API_KEY is missing"
        );

        return res.status(500).json({
            error:
                "OpenRouter API key is not configured on the server."
        });

    }


    // ------------------------------------------
    // GET USER MESSAGE
    // ------------------------------------------

    const { message } = req.body || {};

    if (!message || !message.trim()) {

        return res.status(400).json({
            error: "Message is required."
        });

    }


    // ------------------------------------------
    // RASHI AI SYSTEM PROMPT
    // ------------------------------------------

    const systemPrompt = `
You are Rashi AI, the review-writing assistant for Exotic Furniture Palakkad.

Your ONLY purpose is to help a customer turn their REAL experience into a natural Google review.

BUSINESS:
Exotic Furniture Palakkad

LOCATION:
Palakkad, Kerala, India

IMPORTANT RULES:

- Never invent a customer experience.
- Never invent a product purchased.
- Never invent prices.
- Never invent staff names.
- Never claim delivery happened unless the customer says it happened.
- Never create fake complaints.
- Never create fake positive experiences.
- Use only information provided by the customer.
- Make the review sound natural and human.
- Avoid exaggerated marketing language.
- Do not repeatedly use words like "excellent", "amazing", or "best".
- Keep the review suitable for Google Reviews.
- Do not make the review sound like an advertisement.
- If the customer's information is too little, ask ONE simple question.
- If enough information is provided, provide ONE polished Google review.
- You may also provide a shorter alternative.
- Keep the language natural and easy to read.
- Do not use unnecessary headings.

The customer said:

${message}
`;


    // ------------------------------------------
    // CALL OPENROUTER
    // ------------------------------------------

    try {

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${apiKey}`,

                    "Content-Type":
                        "application/json",

                    "HTTP-Referer":
                        "https://exoticfurniture.vercel.app",

                    "X-Title":
                        "Rashi AI - Exotic Furniture Palakkad"
                },

                body: JSON.stringify({

                    model: "openai/gpt-5.2",

                    messages: [

                        {
                            role: "system",
                            content: systemPrompt
                        },

                        {
                            role: "user",
                            content: message
                        }

                    ],

                    temperature: 0.7,

                    max_tokens: 400

                })
            }
        );


        // ------------------------------------------
        // READ RESPONSE
        // ------------------------------------------

        const data =
            await response.json();


        // ------------------------------------------
        // OPENROUTER ERROR
        // ------------------------------------------

        if (!response.ok) {

            console.error(
                "OpenRouter Error:",
                data
            );

            return res.status(response.status).json({

                error:
                    data?.error?.message ||
                    "OpenRouter request failed."

            });

        }


        // ------------------------------------------
        // GET AI RESPONSE
        // ------------------------------------------

        const reply =
            data?.choices?.[0]?.message?.content;


        if (!reply) {

            console.error(
                "No AI reply:",
                data
            );

            return res.status(500).json({

                error:
                    "Rashi AI returned an empty response."

            });

        }


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        return res.status(200).json({

            reply: reply.trim()

        });

    }


    // ------------------------------------------
    // SERVER ERROR
    // ------------------------------------------

    catch (error) {

        console.error(
            "Rashi AI API Error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to connect to Rashi AI."

        });

    }

}