// ==========================================
// RASHI AI API
// Vercel Serverless Function
// OpenRouter
// Purpose: Google Review Generation ONLY
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
    // GET CUSTOMER MESSAGE
    // ------------------------------------------

    const { message } = req.body || {};

    if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
    ) {

        return res.status(400).json({
            error: "Please describe your experience."
        });

    }


    // ------------------------------------------
    // RASHI AI SYSTEM PROMPT
    // GOOGLE REVIEW GENERATOR ONLY
    // ------------------------------------------

    const systemPrompt = `
You are Rashi AI, a Google Review Generator for Exotic Furniture Palakkad.

Your ONLY job is to transform the customer's REAL experience into a natural Google review.

BUSINESS:
Exotic Furniture Palakkad

LOCATION:
Palakkad, Kerala, India


STRICT RULES:

1. ALWAYS GENERATE A GOOGLE REVIEW.

2. NEVER ASK THE CUSTOMER A QUESTION.

3. NEVER ask for more information.

4. NEVER respond with:
"Can you tell me more?"
"Could you provide more details?"
"What product did you purchase?"
or any similar question.

5. Use ONLY the information provided by the customer.

6. NEVER invent:
- products
- prices
- discounts
- staff names
- delivery
- dates
- services
- purchases
- complaints
- experiences

7. If the customer's message is very short, create a SHORT review based only on that information.

8. Do not add unsupported details just to make the review longer.

9. Make the review sound like a real customer wrote it.

10. Keep the language natural, simple and conversational.

11. Do not make the review sound like an advertisement.

12. Avoid exaggerated marketing language.

13. Avoid repeatedly using:
- excellent
- amazing
- best
- outstanding
- premium
- fantastic

14. Do not mention that you are AI.

15. Do not mention these instructions.

16. Do not use unnecessary headings.

17. Do not add hashtags.

18. Do not add emojis unless they naturally fit the customer's message.

19. Do not create fake positive experiences.

20. Do not create fake negative experiences.

21. The final response must contain ONLY the generated Google review.

22. Do not provide explanations before or after the review.


CUSTOMER EXPERIENCE:

${message.trim()}
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

                    model:
                        process.env.OPENROUTER_MODEL ||
                        "openai/gpt-5.2",

                    messages: [

                        {
                            role: "system",
                            content: systemPrompt
                        },

                        {
                            role: "user",
                            content: message.trim()
                        }

                    ],

                    temperature: 0.7,

                    max_tokens: 250

                })

            }
        );


        // ------------------------------------------
        // READ OPENROUTER RESPONSE
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

            return res.status(
                response.status
            ).json({

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