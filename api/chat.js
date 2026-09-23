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

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

        console.error(
            "❌ OPENROUTER_API_KEY is missing"
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
    // CLEAN CUSTOMER MESSAGE
    // ------------------------------------------

    const customerMessage = message.trim();

    // ------------------------------------------
    // RASHI AI SYSTEM PROMPT
    // GOOGLE REVIEW GENERATOR ONLY
    // ------------------------------------------

   const systemPrompt = `
You are Rashi AI, a Google Review Writing Assistant for Exotic Furniture Palakkad.

Your task is to transform the customer's REAL experience into a natural,
authentic Google review while preserving the customer's exact meaning,
facts, and sentiment.

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

6. NEVER invent or assume:
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
   - recommendations
   - warranties
   - offers
   - payment methods

7. Preserve the customer's actual sentiment:
   - positive stays positive
   - negative stays negative
   - mixed stays mixed
   - neutral stays neutral

8. Never make a negative experience sound positive.

9. Never make a neutral experience sound positive or negative.

10. If the customer mentions a specific product, naturally include that
    product in the review.

11. If the customer mentions multiple products, include only the products
    they actually mentioned.

12. Never add a product simply because it is commonly sold by a furniture shop.

13. If the customer mentions a service such as delivery, staff assistance,
    showroom experience, or customer service, naturally reflect only that
    specific experience.

14. Do not assume the customer purchased something merely because they
    mentioned a product.

15. Do not turn a product name alone into a fake purchase experience.


PARAPHRASING AND ORIGINALITY:

16. Do NOT copy the customer's sentence word-for-word.

17. Rewrite the customer's experience using natural, conversational
    wording while preserving exactly the same meaning.

18. Change sentence structure and phrasing naturally.

19. Do NOT add new facts just to make the review sound more detailed.

20. Do NOT remove important facts provided by the customer.

21. For very short customer input, a light paraphrase is enough.
    Do not artificially make the review long.

22. If the customer's wording is already natural, make a subtle
    paraphrase rather than repeating it exactly.

23. Do not use the same sentence structure repeatedly across reviews.


LOCAL RELEVANCE:

24. When naturally appropriate, mention:
    - Exotic Furniture Palakkad
    - Exotic Furniture
    - Palakkad
    - furniture showroom
    - furniture shop

25. Do NOT force these terms into the review.

26. Do NOT repeat "Exotic Furniture Palakkad" unnecessarily.

27. Do NOT keyword-stuff.

28. Never write SEO-style phrases such as:
    "best furniture shop in Palakkad"
    "best furniture showroom in Palakkad"
    "number one furniture shop"
    "top furniture store"

    unless the customer themselves clearly expressed that sentiment.


NATURAL WRITING:

29. Make the review sound like a real customer wrote it.

30. Use simple, conversational English.

31. Avoid advertising language.

32. Avoid exaggerated words such as:
    best, amazing, outstanding, premium, fantastic, perfect

    unless the customer actually used or clearly expressed that sentiment.

33. Do not make the review sound like an advertisement.

34. Do not use corporate or promotional language.

35. Vary sentence structure naturally.

36. Do not copy previous examples.

37. Do not use headings.

38. Do not use hashtags.

39. Do not add unnecessary emojis.


LENGTH:

40. Very short customer input:
    1–2 natural sentences.

41. Normal customer input:
    2–3 natural sentences.

42. Detailed customer input:
    3–5 natural sentences.

43. Never make the review unnecessarily long.

44. Do not add sentences just to reach the requested length.

45. ALWAYS finish the review with complete sentences.

46. NEVER stop in the middle of a sentence.


OUTPUT FORMAT:

47. Return ONLY the final review text.

48. Do not output JSON.

49. Do not output markdown.

50. Do not output quotation marks around the review.

51. Do not output labels such as:
    "Review:"
    "Google Review:"
    "Here is your review:"

52. Return plain text only.


FINAL CHECK BEFORE RESPONDING:

Before generating the final review, silently verify:

- Every factual claim comes from the customer.
- No product was invented.
- No purchase was assumed.
- No service was invented.
- The original sentiment is preserved.
- The customer's wording has been naturally paraphrased.
- The review does not copy the customer's sentence word-for-word.
- No unnecessary promotional language was added.
- The review is complete and natural.

CUSTOMER EXPERIENCE:

${customerMessage}
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

                    "HTTP-Referer":
                        "https://exoticfurniture.vercel.app",

                    "X-Title":
                        "Rashi AI - Exotic Furniture Palakkad"
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
            content: customerMessage
        }
    ],

    temperature: 0.7,

    max_tokens: 500,

    reasoning: {
        enabled: false
    }

})
            }
        );

        // ------------------------------------------
        // READ RESPONSE SAFELY
        // ------------------------------------------

        let data;

        try {

            data = await response.json();

        } catch (jsonError) {

            console.error(
                "❌ OpenRouter returned invalid JSON:",
                jsonError
            );

            return res.status(502).json({
                error:
                    "AI provider returned an invalid response."
            });
        }

        // ------------------------------------------
        // OPENROUTER ERROR
        // ------------------------------------------

        if (!response.ok) {

            console.error(
                "❌ OpenRouter Error:",
                JSON.stringify(data, null, 2)
            );

            return res.status(response.status).json({

                error:
                    data?.error?.message ||
                    data?.message ||
                    "OpenRouter request failed.",

                code:
                    data?.error?.code || null

            });
        }

        // ------------------------------------------
        // DEBUG INFORMATION
        // ------------------------------------------

        console.log(
            "OpenRouter model:",
            data?.model || "unknown"
        );

        console.log(
            "OpenRouter id:",
            data?.id || "unknown"
        );

        // ------------------------------------------
        // GET FIRST CHOICE
        // ------------------------------------------

        const choice = data?.choices?.[0];

        if (!choice) {

            console.error(
                "❌ No choices returned:",
                JSON.stringify(data, null, 2)
            );

            return res.status(502).json({
                error:
                    "AI provider returned no choices."
            });
        }

        // ------------------------------------------
        // FINISH REASON
        // ------------------------------------------

        console.log(
            "Finish reason:",
            choice?.finish_reason || "unknown"
        );

        // ------------------------------------------
        // GET MESSAGE
        // ------------------------------------------

        const aiMessage = choice?.message;

        if (!aiMessage) {

            console.error(
                "❌ No message object:",
                JSON.stringify(data, null, 2)
            );

            return res.status(502).json({
                error:
                    "AI provider returned no message."
            });
        }

        // ------------------------------------------
        // GET CONTENT
        // ------------------------------------------

        let reply = aiMessage?.content;

        // ------------------------------------------
        // HANDLE NORMAL STRING RESPONSE
        // ------------------------------------------

        if (typeof reply === "string") {

            reply = reply.trim();

        }

        // ------------------------------------------
        // HANDLE ARRAY CONTENT
        // Some providers may return content blocks
        // ------------------------------------------

        else if (Array.isArray(reply)) {

            reply = reply
                .map((part) => {

                    if (typeof part === "string") {
                        return part;
                    }

                    if (
                        part &&
                        typeof part.text === "string"
                    ) {
                        return part.text;
                    }

                    return "";

                })
                .join("")
                .trim();

        }

        // ------------------------------------------
        // FINAL CONTENT VALIDATION
        // ------------------------------------------

        if (
            !reply ||
            typeof reply !== "string" ||
            !reply.trim()
        ) {

            console.error(
                "❌ No usable AI text:",
                JSON.stringify(
                    {
                        model: data?.model,
                        id: data?.id,
                        choice: choice,
                        message: aiMessage
                    },
                    null,
                    2
                )
            );

            return res.status(502).json({
                error:
                    "AI provider returned no usable text."
            });
        }

        // ------------------------------------------
        // CHECK INCOMPLETE RESPONSE
        // ------------------------------------------

        if (
            choice?.finish_reason === "length"
        ) {

            console.warn(
                "⚠️ AI response was truncated:",
                reply
            );

            return res.status(502).json({
                error:
                    "AI response was incomplete. Please try again."
            });
        }

        // ------------------------------------------
        // CLEAN FINAL REVIEW
        // ------------------------------------------

        reply = reply
            .replace(/^Review:\s*/i, "")
            .replace(/^Google Review:\s*/i, "")
            .replace(/^Here is your review:\s*/i, "")
            .trim();

        // ------------------------------------------
        // FINAL SAFETY CHECK
        // ------------------------------------------

        if (!reply) {

            return res.status(502).json({
                error:
                    "AI generated an empty review."
            });
        }

        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        console.log(
            "✅ Rashi AI generated review successfully."
        );

        return res.status(200).json({
            reply: reply
        });

    }

    // ------------------------------------------
    // SERVER ERROR
    // ------------------------------------------

    catch (error) {

        console.error(
            "❌ Rashi AI API Error:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to connect to Rashi AI."
        });
    }
}