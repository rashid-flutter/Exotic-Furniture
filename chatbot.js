// ==========================================
// RASHI AI CHATBOT
// Exotic Furniture Palakkad
// FULL SCREEN + RESPONSIVE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CREATE FLOATING R BUTTON
    // ==========================================

    const chatbotButton = document.createElement("button");

    chatbotButton.id = "rashiAIButton";
    chatbotButton.className = "rashi-ai-button";

    chatbotButton.type = "button";
    chatbotButton.setAttribute(
        "aria-label",
        "Open Rashi AI"
    );

   // ==========================================
// RASHI AI LOTTIE ANIMATION
// ==========================================

chatbotButton.innerHTML = `
    <span
        id="rashiLottie"
        class="rashi-ai-icon"
    ></span>
`;

document.body.appendChild(chatbotButton);


const rashiLottie =
    document.getElementById("rashiLottie");


lottie.loadAnimation({

    container: rashiLottie,

    renderer: "svg",

    loop: true,

    autoplay: true,

    path: "assets/ai.json"

});

// ==========================================
// RESTORE MAIN PAGE SCROLL
// ==========================================

document.documentElement.style.setProperty(
    "overflow-y",
    "auto",
    "important"
);

document.body.style.setProperty(
    "overflow-y",
    "auto",
    "important"
);

document.body.style.setProperty(
    "overflow-x",
    "hidden",
    "important"
);

    // ==========================================
    // CREATE FULL SCREEN CHATBOT
    // ==========================================

    const chatbotWindow = document.createElement("div");

    chatbotWindow.id = "rashiAIWindow";
    chatbotWindow.className = "rashi-ai-window";

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

                    <h3>Rashi AI</h3>

                    <span>
                        <b>●</b>
                        Exotic Furniture Palakkad
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
             CHATBOT
             ================================== -->

        <iframe
            src="chatbot.html?v=22"
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
        windowElement.querySelector(
            ".rashi-ai-header"
        );

    const iframe =
        windowElement.querySelector(
            ".rashi-ai-iframe"
        );


    // ==========================================
    // FULL SCREEN WINDOW
    // ==========================================

    windowElement.style.display = "flex";

    windowElement.style.flexDirection = "column";

    windowElement.style.overflow = "hidden";


    // ==========================================
    // HEADER
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
    // IFRAME
    // ==========================================

    iframe.style.position = "relative";

    iframe.style.width = "100%";

    iframe.style.height = "0";

    iframe.style.flex = "1 1 0";

    iframe.style.minHeight = "0";

    iframe.style.maxHeight = "none";

    iframe.style.border = "0";

    iframe.style.margin = "0";

    iframe.style.padding = "0";

    iframe.style.display = "block";

    iframe.style.zIndex = "1";


    // ==========================================
    // OPEN
    // ==========================================

    openButton.addEventListener("click", () => {

        windowElement.classList.add("active");

        openButton.classList.add("active");

        document.body.classList.add(
            "rashi-ai-open"
        );

    });


    // ==========================================
    // CLOSE
    // ==========================================

    function closeRashiAI() {

        windowElement.classList.remove("active");

        openButton.classList.remove("active");

        document.body.classList.remove(
            "rashi-ai-open"
        );

    }


    closeButton.addEventListener(
        "click",
        closeRashiAI
    );


    // ==========================================
    // ESC
    // ==========================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeRashiAI();

            }

        }
    );


    // ==========================================
    // MESSAGE FROM CHATBOT
    // ==========================================

    window.addEventListener(
        "message",
        (event) => {

            if (
                event.data &&
                event.data.type ===
                "closeRashiAI"
            ) {

                closeRashiAI();

            }

        }
    );

});