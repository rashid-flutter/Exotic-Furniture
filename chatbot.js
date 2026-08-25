// ==========================================
// RASHI AI CHATBOT
// Exotic Furniture Palakkad
// ==========================================

document.addEventListener("DOMContentLoaded", () => {


    // ==========================================
    // CREATE FLOATING CHATBOT BUTTON
    // ==========================================

    const chatbotButton = document.createElement("button");

    chatbotButton.id = "rashiAIButton";
    chatbotButton.className = "rashi-ai-button";

    chatbotButton.innerHTML = `
        <span class="rashi-ai-icon">R</span>
        <span class="rashi-ai-label">Rashi</span>
    `;

    document.body.appendChild(chatbotButton);


    // ==========================================
    // CREATE CHATBOT WINDOW
    // ==========================================

    const chatbotWindow = document.createElement("div");

    chatbotWindow.id = "rashiAIWindow";
    chatbotWindow.className = "rashi-ai-window";


    // ==========================================
    // CHATBOT HTML
    // ONE HEADER ONLY
    // ==========================================

    chatbotWindow.innerHTML = `

        <!-- ==================================
             RASHI AI HEADER
             ================================== -->

        <header class="rashi-ai-header">

            <div class="rashi-ai-profile">

                <div class="rashi-ai-avatar">
                    R
                </div>

                <div class="rashi-ai-info">

                    <h3>
                        Rashi AI
                    </h3>

                    <span>
                        <b>●</b> Exotic Furniture Palakkad
                    </span>

                </div>

            </div>


            <button
                type="button"
                id="rashiAIClose"
                class="rashi-ai-close"
                aria-label="Close Rashi AI"
            >
                ×
            </button>

        </header>


        <!-- ==================================
             CHAT CONTENT
             ================================== -->

        <iframe
            src="chatbot.html?v=21"
            class="rashi-ai-iframe"
            title="Rashi AI"
            frameborder="0"
            scrolling="no"
        ></iframe>

    `;


    document.body.appendChild(chatbotWindow);


    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const openButton =
        document.getElementById("rashiAIButton");

    const closeButton =
        document.getElementById("rashiAIClose");

    const windowElement =
        document.getElementById("rashiAIWindow");

    const header =
        windowElement.querySelector(".rashi-ai-header");

    const iframe =
        windowElement.querySelector(".rashi-ai-iframe");


    // ==========================================
    // FORCE CORRECT WINDOW LAYOUT
    // ==========================================

    windowElement.style.display = "flex";

    windowElement.style.flexDirection = "column";

    windowElement.style.overflow = "hidden";


    // ==========================================
    // FORCE HEADER TO STAY VISIBLE
    // ==========================================

    header.style.position = "relative";

    header.style.flex = "0 0 88px";

    header.style.height = "88px";

    header.style.minHeight = "88px";

    header.style.width = "100%";

    header.style.boxSizing = "border-box";

    header.style.zIndex = "100";

    header.style.display = "flex";

    header.style.alignItems = "center";

    header.style.justifyContent = "space-between";


    // ==========================================
    // FORCE IFRAME BELOW HEADER
    // ==========================================

    iframe.style.position = "relative";

    iframe.style.top = "auto";

    iframe.style.left = "auto";

    iframe.style.right = "auto";

    iframe.style.bottom = "auto";

    iframe.style.width = "100%";

    iframe.style.height = "auto";

    iframe.style.flex = "1 1 auto";

    iframe.style.minHeight = "0";

    iframe.style.border = "0";

    iframe.style.margin = "0";

    iframe.style.padding = "0";

    iframe.style.display = "block";

    iframe.style.zIndex = "1";


    // ==========================================
    // OPEN CHATBOT
    // ==========================================

    openButton.addEventListener("click", () => {

        windowElement.classList.add("active");

        openButton.classList.add("active");

    });


    // ==========================================
    // CLOSE CHATBOT
    // ==========================================

    closeButton.addEventListener("click", () => {

        windowElement.classList.remove("active");

        openButton.classList.remove("active");

    });


    // ==========================================
    // ESC KEY
    // ==========================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            windowElement.classList.remove("active");

            openButton.classList.remove("active");

        }

    });


    // ==========================================
    // RECEIVE CLOSE MESSAGE
    // ==========================================

    window.addEventListener("message", (event) => {

        if (
            event.data &&
            event.data.type === "closeRashiAI"
        ) {

            windowElement.classList.remove("active");

            openButton.classList.remove("active");

        }

    });


});