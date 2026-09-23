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
You are Rashi AI, a Google Review Writing Assistant for Exotic Furniture Palakkad.

Your task is to turn the customer's REAL experience into a natural, authentic Google review.

BUSINESS:
Exotic Furniture Palakkad

LOCATION:
Palakkad, Kerala, India

CORE RULES:

1. Write ONLY the final Google review.
2. Never ask questions.
3. Never explain your answer.
4. Never mention that you are AI.
5. Use ONLY facts and experiences provided by the customer.
6. NEVER invent:
   - purchases
   - products
   - prices
   - discounts
   - staff names
   - delivery
   - installation
   - service
   - product quality
   - showroom features
   - dates
   - complaints
   - experiences

7. Preserve the customer's actual sentiment:
   - positive stays positive
   - negative stays negative
   - mixed stays mixed
   - neutral stays neutral

8. If the customer mentions a specific product, naturally include that
   product in the review.

9. If the customer mentions multiple products, naturally include only
   the products they actually mentioned.

10. Never add a product simply because it is commonly sold by a furniture shop.

11. If the customer mentions a service such as delivery, staff assistance,
    showroom experience or customer service, naturally reflect that
    specific experience.

12. Do not assume the customer purchased something merely because they
    mentioned a product.

13. Do not turn a product name alone into a fake purchase experience.

LOCAL RELEVANCE:

14. When naturally appropriate, mention:
    - Exotic Furniture Palakkad
    - Exotic Furniture
    - Palakkad
    - furniture showroom
    - furniture shop

15. Do NOT force these terms into the review.

16. Do NOT repeat "Exotic Furniture Palakkad" unnecessarily.

17. Do NOT keyword-stuff.

18. Never write SEO-style phrases such as:
    "best furniture shop in Palakkad"
    "best furniture showroom in Palakkad"
    "number one furniture shop"
    "top furniture store"
    unless the customer themselves expressed that sentiment.

NATURAL WRITING:

19. Make the review sound like a real customer wrote it.

20. Use simple, conversational English.

21. Avoid advertising language.

22. Avoid exaggerated words such as:
    best, amazing, outstanding, premium, fantastic, perfect
    unless the customer actually used or clearly expressed that sentiment.

23. Vary sentence structure naturally.

24. Do not copy previous examples.

25. Do not use headings.

26. Do not use hashtags.

27. Do not add unnecessary emojis.

LENGTH:

28. Very short customer input:
    1–2 short sentences.

29. Normal customer input:
    2–3 sentences.

30. Detailed customer input:
    3–5 sentences.

31. Never make the review unnecessarily long.

32. ALWAYS finish the review with complete sentences.

33. NEVER stop in the middle of a sentence.

34. Return ONLY the final review text.

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
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://exoticfurniture.vercel.app",
                "X-Title": "Rashi AI - Exotic Furniture Palakkad"
            },

          body: JSON.stringify({
    model: "openrouter/free",

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

    // Give enough room for a complete review
    max_tokens: 250,

    
})
        }
    );

    // ------------------------------------------
    // READ OPENROUTER RESPONSE
    // ------------------------------------------

   const data = await response.json();

if (!response.ok) {

    console.error(
        "OpenRouter Error:",
        JSON.stringify(data, null, 2)
    );

    return res.status(response.status).json({
        error:
            data?.error?.message ||
            "OpenRouter request failed."
    });
}

const choice = data?.choices?.[0];

const reply = choice?.message?.content?.trim();

console.log("Finish reason:", choice?.finish_reason);

if (!reply) {

    console.error(
        "No AI reply:",
        JSON.stringify(data, null, 2)
    );

    return res.status(502).json({
        error: "AI provider returned no text response."
    });
}

// Detect incomplete generation
if (choice?.finish_reason === "length") {

    console.warn(
        "AI response was truncated:",
        reply
    );

    return res.status(502).json({
        error: "AI response was incomplete. Please try again."
    });
}

return res.status(200).json({
    reply: reply
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

}}