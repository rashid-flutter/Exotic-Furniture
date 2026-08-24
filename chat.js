// ==========================================
// RASHI AI - Exotic Furniture Palakkad
// Google Review Assistant
// ==========================================

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

// Add initial Rashi AI message
window.addEventListener("DOMContentLoaded", () => {
    addAIMessage(
        "Hi! I'm Rashi AI 👋\n\n" +
        "I can help you write a natural Google review for Exotic Furniture Palakkad.\n\n" +
        "Tell me about your actual experience — for example, the furniture you purchased, showroom experience, staff behaviour, quality or service."
    );
});


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage() {

    const message = chatInput.value.trim();

    if (!message) return;

    // Show user message
    addUserMessage(message);

    // Clear input
    chatInput.value = "";

    // Disable button
    sendButton.disabled = true;
    sendButton.textContent = "Writing...";

    // Loading message
    const loadingMessage = addAIMessage("Rashi AI is writing your review...");

    try {

        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: `
You are Rashi AI, the review-writing assistant for Exotic Furniture Palakkad.

Your ONLY purpose is to help a customer turn their REAL experience into a natural Google review.

Business:
Exotic Furniture Palakkad

Location:
Palakkad, Kerala, India

Important rules:
- Never invent a customer experience.
- Never invent a product purchased.
- Never invent prices.
- Never invent staff names.
- Never claim delivery happened unless the customer says it happened.
- Never create fake complaints or fake positive experiences.
- Use only information provided by the customer.
- Make the review sound natural and human.
- Avoid exaggerated marketing language.
- Do not repeatedly use words like "excellent", "amazing", or "best".
- Keep the review suitable for Google Reviews.
- If the customer's information is too little, ask one simple question.
- Provide one polished review.
- You may also provide a shorter alternative.

Customer's message:
${message}
                `
            })
        });

        const data = await response.json();

        // Remove loading message
        loadingMessage.remove();

        if (!response.ok) {
            addAIMessage(
                data.error || "Sorry, Rashi AI could not connect right now."
            );
            return;
        }

        addAIMessage(data.reply);

    } catch (error) {

        console.error("Rashi AI Error:", error);

        loadingMessage.remove();

        addAIMessage(
            "Sorry, I couldn't connect to Rashi AI. Please try again."
        );

    } finally {

        sendButton.disabled = false;
        sendButton.textContent = "Send";

        chatInput.focus();
    }
}


// ==========================================
// USER MESSAGE
// ==========================================

function addUserMessage(message) {

    const messageDiv = document.createElement("div");

    messageDiv.className = "chat-message user-message";

    messageDiv.textContent = message;

    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}


// ==========================================
// AI MESSAGE
// ==========================================

function addAIMessage(message) {

    const messageDiv = document.createElement("div");

    messageDiv.className = "chat-message ai-message";

    messageDiv.textContent = message;

    chatMessages.appendChild(messageDiv);

    scrollToBottom();

    return messageDiv;
}


// ==========================================
// AUTO SCROLL
// ==========================================

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// ==========================================
// ENTER KEY
// ==========================================

chatInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
});


// ==========================================
// SEND BUTTON
// ==========================================

sendButton.addEventListener("click", sendMessage);