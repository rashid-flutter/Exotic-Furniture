const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const messagesContainer = document.getElementById("messages");
const chatStatus = document.getElementById("chatStatus");
const quickActions = document.getElementById("quickActions");

function formatTime() {
  const date = new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function appendMessage(role, text) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}`;

  const messageText = document.createElement("div");
  messageText.className = "message-text";
  messageText.innerText = text;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.innerText = formatTime();

  messageEl.appendChild(messageText);
  messageEl.appendChild(meta);
  messagesContainer.appendChild(messageEl);
  scrollMessages();
}

function scrollMessages() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setStatus(text, isError = false) {
  chatStatus.innerText = text;
  chatStatus.style.color = isError ? "#f87171" : "#475569";
}

async function sendChatMessage(message) {
  setStatus("Sending message...");

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
      throw new Error(data.error || "Failed to send message.");
    }

    appendMessage("bot", data.reply || "Sorry, I couldn't generate a response.");
    setStatus("");
  } catch (error) {
    appendMessage("bot", "Sorry, something went wrong. Please try again later.");
    setStatus(error.message, true);
  }
}

function handleQuickAction(event) {
  const button = event.target.closest(".quick-action");
  if (!button) return;
  const text = button.innerText;
  chatInput.value = text;
  chatInput.focus();
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  chatInput.value = "";
  chatInput.disabled = true;

  await sendChatMessage(text);

  chatInput.disabled = false;
  chatInput.focus();
});

quickActions.addEventListener("click", handleQuickAction);
window.addEventListener("load", scrollMessages);
