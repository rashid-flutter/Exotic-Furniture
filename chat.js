// ==========================================
// RASHI AI - Exotic Furniture Palakkad
// Google Review Assistant
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const chatMessages =
        document.getElementById("chatMessages");

    const chatInput =
        document.getElementById("chatInput");

    const sendButton =
        document.getElementById("sendButton");


    // ==========================================
    // CHECK ELEMENTS
    // ==========================================

    if (!chatMessages || !chatInput || !sendButton) {
        console.error("Rashi AI: Chat elements not found.");
        return;
    }


    // ==========================================
    // INITIAL MESSAGE
    // ==========================================

    addAIMessage(
        "Hi! I'm Rashi AI 👋\n\n" +
        "I can help you write a natural Google review for Exotic Furniture Palakkad.\n\n" +
        "Tell me about your actual experience — for example, the furniture you purchased, showroom experience, staff behaviour, quality or service."
    );


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    async function sendMessage() {

        const message =
            chatInput.value.trim();

        if (!message) return;


        // Show user message
        addUserMessage(message);

        // Clear input
        chatInput.value = "";

        // Disable button
        sendButton.disabled = true;
        sendButton.textContent = "Writing...";


        // Loading message
        const loadingMessage =
            addAIMessage(
                "Rashi AI is writing your review..."
            );


        try {

            const response =
                await fetch("/api/chat", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })

                });


            // Try to read JSON safely
            let data;

            try {
                data = await response.json();
            } catch {
                data = {};
            }


            // Remove loading message
            loadingMessage.remove();


            // API error
            if (!response.ok) {

                console.error(
                    "Rashi AI API Error:",
                    data
                );

                addAIMessage(
                    "⚠️ " +
                    (
                        data.error ||
                        "Rashi AI could not connect right now."
                    )
                );

                return;
            }


            // Empty response
            if (!data.reply) {

                addAIMessage(
                    "⚠️ Rashi AI returned an empty response."
                );

                return;
            }


            // Show AI response
            addAIMessage(
                data.reply
            );


        } catch (error) {

            console.error(
                "Rashi AI Connection Error:",
                error
            );


            loadingMessage.remove();


            addAIMessage(
                "⚠️ Unable to connect to Rashi AI. Please try again."
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

        const messageDiv =
            document.createElement("div");

        messageDiv.className =
            "chat-message user-message";

        messageDiv.textContent =
            message;

        chatMessages.appendChild(
            messageDiv
        );

        scrollToBottom();

    }


    // ==========================================
    // AI MESSAGE
    // ==========================================

    function addAIMessage(message) {

        const messageDiv =
            document.createElement("div");

        messageDiv.className =
            "chat-message ai-message";

        messageDiv.textContent =
            message;

        chatMessages.appendChild(
            messageDiv
        );

        scrollToBottom();

        return messageDiv;

    }


    // ==========================================
    // AUTO SCROLL
    // ==========================================

    function scrollToBottom() {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    // ==========================================
    // ENTER KEY
    // ==========================================

    chatInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    // ==========================================
    // SEND BUTTON
    // ==========================================

    sendButton.addEventListener(
        "click",
        sendMessage
    );


    // ==========================================
    // EXPOSE SEND FUNCTION
    // For quick buttons
    // ==========================================

    window.rashiAISendMessage = function(message) {

        chatInput.value = message;

        sendMessage();

    };

});