const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const rootDir = __dirname;
const envFile = path.join(rootDir, ".env");

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .reduce((env, line) => {
        const idx = line.indexOf("=");
        if (idx === -1) return env;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        env[key] = value;
        return env;
      }, {});
  } catch (err) {
    return {};
  }
}

const env = parseEnvFile(envFile);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY;
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJSON(res, status, data) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function serveStatic(req, res) {
  const parsedUrl = url.parse(req.url);
  let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname));
  if (safePath.includes("..")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (safePath === "/") {
    safePath = "/index.html";
  }

  const filePath = path.join(rootDir, safePath);

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function handleApiChat(req, res) {
  if (req.method !== "POST") {
    return sendJSON(res, 405, { error: "Method not allowed" });
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const json = JSON.parse(body || "{}");
      const message = json.message && json.message.trim();

      if (!message) {
        return sendJSON(res, 400, { error: "Message is required" });
      }

      if (!OPENROUTER_API_KEY) {
        return sendJSON(res, 500, { error: "OpenRouter API key is not configured." });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
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
      });

      const data = await response.json();
      if (!response.ok) {
        return sendJSON(res, response.status, {
          error: data?.error?.message || "Failed to get a response from Rashi AI.",
        });
      }

      return sendJSON(res, 200, {
        reply: data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.",
      });
    } catch (error) {
      console.error(error);
      return sendJSON(res, 500, { error: "Internal Server Error" });
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === "/api/chat") {
    return handleApiChat(req, res);
  }

  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Chat API available at http://localhost:${PORT}/api/chat`);
});
