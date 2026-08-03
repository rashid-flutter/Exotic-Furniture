const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const widgetChatForm = document.getElementById("widgetChatForm");
const widgetChatInput = document.getElementById("widgetChatInput");
const widgetMessages = document.getElementById("widgetMessages");
const widgetStatus = document.getElementById("widgetStatus");
const widgetActionsPrimary = document.getElementById("widgetActionsPrimary");
const widgetActionsSecondary = document.getElementById("widgetActionsSecondary");
const openWidgetBtn = document.getElementById("chatToggle");

// Lottie animation instances
let animFab = null;
let animHeader = null;
let animMsg = null;

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function setWidgetStatus(text, isError = false) {
  widgetStatus.textContent = text;
  widgetStatus.style.color = isError ? "#dc2626" : "#475569";
}

function appendWidgetMessage(role, text) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}`;

  if (role === "bot") {
    const iconWrap = document.createElement("div");
    iconWrap.className = "message-icon message-icon-bot";
    iconWrap.setAttribute("aria-hidden", "true");
    messageEl.appendChild(iconWrap);

    if (window.lottie) {
      lottie.loadAnimation({
        container: iconWrap,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "assets/ai.json"
      });
    }
  }

  const textEl = document.createElement("div");
  textEl.className = "message-text";
  textEl.innerText = text;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.innerText = formatTime();

  messageEl.appendChild(textEl);
  messageEl.appendChild(meta);
  widgetMessages.appendChild(messageEl);
  widgetMessages.scrollTop = widgetMessages.scrollHeight;
}

function openWidget() {
  chatWidget.classList.add("open");
  // hide the floating toggle while widget is open
  if (chatToggle) chatToggle.style.display = "none";
  // pause fab animation to save CPU while open
  if (animFab && typeof animFab.pause === 'function') animFab.pause();
  widgetChatInput.focus();
  showPrimarySuggestions();
}

function closeWidget() {
  chatWidget.classList.remove("open");
  // show the floating toggle again when closed
  if (chatToggle) chatToggle.style.display = "inline-flex";
  // resume fab animation
  if (animFab && typeof animFab.play === 'function') animFab.play();
}

async function sendWidgetMessage(message) {
  setWidgetStatus("Sending message...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to send message.");
    }

    appendWidgetMessage("bot", data.reply || "Sorry, I couldn't generate a response.");
    setWidgetStatus("");
  } catch (error) {
    appendWidgetMessage("bot", "Sorry, something went wrong. Please try again later.");
    setWidgetStatus(error.message, true);
  }
}

function showPrimarySuggestions(){
  if(widgetActionsPrimary) widgetActionsPrimary.style.display = "grid";
  if(widgetActionsSecondary) widgetActionsSecondary.style.display = "none";
  if(widgetActionsSecondary) widgetActionsSecondary.setAttribute('aria-hidden','true');
}

function showSecondarySuggestions(){
  if(widgetActionsPrimary) widgetActionsPrimary.style.display = "none";
  if(widgetActionsSecondary) widgetActionsSecondary.style.display = "grid";
  if(widgetActionsSecondary) widgetActionsSecondary.setAttribute('aria-hidden','false');
}

if (chatToggle) {
  chatToggle.addEventListener("click", () => openWidget());
}
if (openWidgetBtn) {
  openWidgetBtn.addEventListener("click", () => openWidget());
}
if (chatClose) {
  chatClose.addEventListener("click", () => closeWidget());
}

if (widgetActionsPrimary) {
  widgetActionsPrimary.addEventListener("click", (event) => {
    const button = event.target.closest(".quick-action");
    if (!button) return;
    widgetChatInput.value = button.innerText;
    widgetChatInput.focus();
  });
}

if (widgetActionsSecondary) {
  widgetActionsSecondary.addEventListener("click", (event) => {
    const button = event.target.closest(".quick-action");
    if (!button) return;
    widgetChatInput.value = button.innerText;
    widgetChatInput.focus();
  });
}

widgetChatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = widgetChatInput.value.trim();
  if (!text) return;

  appendWidgetMessage("user", text);
  widgetChatInput.value = "";
  widgetChatInput.disabled = true;

  await sendWidgetMessage(text);

  // after the first exchange, show secondary suggestions
  showSecondarySuggestions();

  widgetChatInput.disabled = false;
  widgetChatInput.focus();
});

// Initialize Lottie animations for FAB, header and initial bot icon
function initLottie(){
  if (!window.lottie) return;
  try{
    const fabEl = document.getElementById('fabLottie');
    if(fabEl){
      animFab = lottie.loadAnimation({
        container: fabEl,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/ai.json'
      });
    }

    const headerEl = document.getElementById('headerLottie');
    if(headerEl){
      animHeader = lottie.loadAnimation({
        container: headerEl,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/ai.json'
      });
    }

    const msgEl = document.getElementById('initialBotIcon');
    if(msgEl){
      animMsg = lottie.loadAnimation({
        container: msgEl,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/ai.json'
      });
    }
  }catch(e){
    console.warn('Lottie init failed', e);
  }
}

// call init after DOM is ready (script is deferred)
initLottie();
