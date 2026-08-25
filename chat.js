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
    // GOOGLE REVIEW URL
    // ==========================================

    const GOOGLE_REVIEW_URL =
        "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review";


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


            // ==========================================
            // READ JSON SAFELY
            // ==========================================

            let data;

            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


            // Remove loading message
            loadingMessage.remove();


            // ==========================================
            // API ERROR
            // ==========================================

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


            // ==========================================
            // EMPTY RESPONSE
            // ==========================================

            if (!data.reply) {

                addAIMessage(
                    "⚠️ Rashi AI returned an empty response."
                );

                return;
            }


            // ==========================================
            // SHOW GENERATED REVIEW
            // ==========================================

            addAIReview(
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
    // NORMAL AI MESSAGE
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
    // GENERATED REVIEW
    // ==========================================

    function addAIReview(review) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "generated-review-wrapper";


        // Review text
        const reviewDiv =
            document.createElement("div");

        reviewDiv.className =
            "chat-message ai-message generated-review";

        reviewDiv.textContent =
            review.trim();


        // ==========================================
        // ARROW BUTTON
        // ==========================================

        const arrowButton =
            document.createElement("button");

        arrowButton.type =
            "button";

        arrowButton.className =
            "review-arrow-button";

        arrowButton.setAttribute(
            "aria-label",
            "Copy review and open Google Reviews"
        );

        arrowButton.innerHTML =
            "➜";


        // ==========================================
        // ARROW CLICK
        // ==========================================

        arrowButton.addEventListener(
            "click",
            async () => {

                const reviewText =
                    review.trim();

                try {

                    await copyReview(
                        reviewText
                    );

                    showReviewToast();

                    // Small delay so user sees confirmation
                    setTimeout(() => {

                        window.location.href =
                            GOOGLE_REVIEW_URL;

                    }, 500);


                } catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );

                    // Still open Google Reviews
                    window.location.href =
                        GOOGLE_REVIEW_URL;

                }

            }
        );


        // Add elements
        wrapper.appendChild(
            reviewDiv
        );

        wrapper.appendChild(
            arrowButton
        );


        chatMessages.appendChild(
            wrapper
        );

        scrollToBottom();

    }


    // ==========================================
    // COPY REVIEW
    // ==========================================

    async function copyReview(text) {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );

            return;

        }


        // Fallback for older browsers
        const textarea =
            document.createElement("textarea");

        textarea.value =
            text;

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        document.body.appendChild(
            textarea
        );

        textarea.focus();

        textarea.select();

        document.execCommand(
            "copy"
        );

        textarea.remove();

    }


    // ==========================================
    // TOAST
    // ==========================================

    function showReviewToast() {

        let toast =
            document.getElementById(
                "rashiReviewToast"
            );


        if (!toast) {

            toast =
                document.createElement("div");

            toast.id =
                "rashiReviewToast";

            toast.className =
                "rashi-review-toast";

            toast.textContent =
                "✅ Review copied! Opening Google Reviews...";

            document.body.appendChild(
                toast
            );

        }


        toast.classList.add(
            "show"
        );


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 1800);

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
    // ==========================================

    window.rashiAISendMessage =
        function(message) {

            chatInput.value =
                message;

            sendMessage();

        };

});