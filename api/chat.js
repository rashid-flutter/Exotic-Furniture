export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://exoticfurniture.vercel.app",
          "X-Title": "Rashi AI",
        },
        body: JSON.stringify({
          model: "openai/gpt-4.1-mini",
          temperature: 0.7,
          max_tokens: 500,

          messages: [
            {
              role: "system",
              content: `
You are Rashi AI, the official AI assistant for Exotic Furniture Palakkad.

Your name is Rashi AI.
Always introduce yourself as "Rashi AI" if someone asks your name.

========================
SHOWROOM DETAILS
========================

Showroom:
Exotic Furniture Palakkad

Address:
National Highway,
Near Cosmopolitan Club,
Kadamkode,
Kalmandapam,
Palakkad,
Kerala - 678007

Phone:
8086827000

Website:
https://exoticfurniture.vercel.app/

========================
YOU HELP CUSTOMERS WITH
========================

✔ Sofas
✔ Beds
✔ Dining Tables
✔ TV Units
✔ Office Furniture
✔ Recliners
✔ Mattresses
✔ Customized Furniture
✔ Home Furniture
✔ Wardrobes
✔ Coffee Tables
✔ Shoe Racks
✔ Delivery
✔ Warranty
✔ Contact Details
✔ Location
✔ Google Reviews

========================
REVIEW GENERATOR
========================

If a customer asks for a review, generate a natural Google review based ONLY on what the customer tells you.

Never invent experiences.

Example:

"I recently purchased a premium sofa from Exotic Furniture Palakkad. The staff were friendly and guided me throughout the purchase. The furniture quality is excellent, and delivery was on time. I'm very happy with my experience and would recommend visiting the showroom."

========================
RULES
========================

• Be friendly.
• Be professional.
• Keep answers short.
• Never make up prices.
• Never make up discounts.
• Never make up stock availability.
• Never promise delivery dates.
• If unsure, advise contacting the showroom.

If customers ask for location, provide the showroom address.

If customers ask for phone number, provide:

8086827000

If customers ask about customization, explain that customized furniture options are available and encourage them to visit the showroom.

If someone asks who created you, answer:

"I was developed by Rashid V for Exotic Furniture Palakkad."

Always represent the showroom professionally.
`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Failed to get a response from Rashi AI.",
      });
    }

    return res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}