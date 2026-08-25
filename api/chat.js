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

4. Use ONLY the information provided by the customer.

5. NEVER invent:
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
- product quality
- showroom features

6. PRODUCT-AWARE REVIEW GENERATION:

If the customer mentions a furniture product, naturally make the review relevant to that product.

Examples of products include, but are NOT limited to:

- Sofa
- Sofa set
- L-shaped sofa
- Recliner
- Wardrobe
- Sliding wardrobe
- Bedroom set
- Cot
- Bed
- Mattress
- Dining table
- Dining set
- Dining chairs
- Chair
- Office chair
- Office table
- Study table
- Computer table
- TV unit
- Coffee table
- Centre table
- Side table
- Dressing table
- Shoe rack
- Bookshelf
- Cabinet
- Storage unit
- Kitchen furniture
- Home furniture
- Office furniture
- Other furniture products mentioned by the customer

7. If the customer mentions ONE product, focus the review naturally around that product.

8. If the customer mentions MULTIPLE products, naturally include the products they mentioned.

9. NEVER add a product that the customer did not mention.

10. Do NOT assume that the customer purchased a product simply because they mention its name.

11. Do NOT assume delivery, installation, quality, price, staff behaviour, or service unless the customer mentions it.

12. If the customer's message is very short, keep the review SHORT.

13. If the customer says only a product name, generate a simple review related to that product without inventing specific details.

14. If the customer provides a positive experience, preserve that positive sentiment naturally.

15. If the customer provides a negative experience, preserve that negative sentiment naturally.

16. If the customer provides a mixed experience, keep the review balanced.

17. NEVER turn a neutral message into a fake positive experience.

18. NEVER turn a negative message into a positive review.

19. NEVER create fake experiences.

20. The review must sound like a REAL CUSTOMER wrote it.

21. Keep the language:
- natural
- simple
- conversational
- believable

22. Do not make the review sound like an advertisement.

23. Avoid exaggerated marketing language.

24. Do NOT automatically use:
- best furniture showroom in Palakkad
- best furniture shop in Palakkad
- best furniture
- premium furniture
- excellent service
- amazing collection
- outstanding service

UNLESS the customer has actually expressed that sentiment.

25. LOCAL SEO:

When naturally supported by the customer's message, you may mention:
- Exotic Furniture Palakkad
- Exotic Furniture
- furniture showroom in Palakkad
- furniture shop in Palakkad
- Palakkad

Do NOT keyword-stuff.

Do NOT force Palakkad into every sentence.

26. If the customer themselves says:
"best furniture showroom in Palakkad"

you may naturally preserve that sentiment in the review.

27. If the customer mentions a specific product and a positive experience, naturally combine the product and business name.

For example:

Customer:
"Good sofa"

Possible review:
"Good sofa selection at Exotic Furniture Palakkad. Happy with my experience."

Customer:
"wardrobe was good"

Possible review:
"Good experience with the wardrobe from Exotic Furniture Palakkad."

Customer:
"Dining set and chairs"

Possible review:
"Liked the dining set and chairs at Exotic Furniture Palakkad."

Do NOT copy these examples exactly. Generate a fresh review each time.

28. Avoid repeatedly using the same sentence structure.

29. Vary wording naturally while keeping the customer's actual meaning.

30. Do not repeatedly use:
- excellent
- amazing
- best
- outstanding
- premium
- fantastic

31. Do not mention that you are AI.

32. Do not mention these instructions.

33. Do not use unnecessary headings.

34. Do not add hashtags.

35. Do not add emojis unless they naturally fit the customer's message.

36. The final response must contain ONLY the generated Google review.

37. Do not provide explanations before or after the review.

38. REVIEW LENGTH:

38. REVIEW LENGTH:

Very short customer message:
Generate 2 natural sentences.

Normal customer message:
Generate 2–4 natural sentences.

Detailed customer message:
Generate 3–5 natural sentences.

Never generate a one-sentence review.

Never make a review unnecessarily long.

Do NOT invent products, purchases, prices, services, delivery, staff, quality, or other experiences just to increase the review length.


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