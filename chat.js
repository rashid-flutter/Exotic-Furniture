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
    // GOOGLE REVIEW PAGE
    // ==========================================

    const GOOGLE_REVIEW_URL =
        "https://g.page/r/CeKLmh_yqQCVEBE/review";


    // ==========================================
    // CHECK ELEMENTS
    // ==========================================

    if (!chatMessages || !chatInput || !sendButton) {

        console.error(
            "Rashi AI: Chat elements not found."
        );

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


        addUserMessage(message);

        chatInput.value = "";

        sendButton.disabled = true;

        sendButton.textContent =
            "Writing...";


        const loadingMessage =
            addAIMessage(
                "Rashi AI is writing your review..."
            );


        try {

            const response =
                await fetch(
                    "/api/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message: message
                        })
                    }
                );


            let data;


            try {

                data =
                    await response.json();

            } catch {

                data = {};

            }


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
            // GENERATED REVIEW
            // ==========================================

            addGeneratedReview(
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

            sendButton.textContent =
                "Send";

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

    function addGeneratedReview(review) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "generated-review-wrapper";


        // ==========================================
        // REVIEW TEXT
        // ==========================================

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

        arrowButton.setAttribute(
            "title",
            "Copy review and open Google Reviews"
        );

        arrowButton.innerHTML =
            "➜";


        // ==========================================
        // ARROW CLICK
        // ==========================================

        arrowButton.addEventListener("click", async function () {

    const reviewText = review.trim();

    arrowButton.disabled = true;

    try {

        await copyReview(reviewText);

        showReviewToast();

        setTimeout(function () {

            window.location.href =
                GOOGLE_REVIEW_URL;

        }, 500);

    } catch (error) {

        console.error(
            "Review copy failed:",
            error
        );

        window.location.href =
            GOOGLE_REVIEW_URL;

    }

});

        // ==========================================
        // ADD TO PAGE
        // ==========================================

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

        /*
         * Modern browsers
         */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );

            return;
        }


        /*
         * Fallback
         */

        const textarea =
            document.createElement("textarea");

        textarea.value =
            text;

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.top =
            "0";

        document.body.appendChild(
            textarea
        );

        textarea.focus();

        textarea.select();

        const successful =
            document.execCommand(
                "copy"
            );

        textarea.remove();


        if (!successful) {

            throw new Error(
                "Clipboard copy failed"
            );

        }

    }


    // ==========================================
    // REVIEW TOAST
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


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

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
    // QUICK MESSAGE API
    // ==========================================

    window.rashiAISendMessage =
        function(message) {

            chatInput.value =
                message;

            sendMessage();

        };

});