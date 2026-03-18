import { generateMessages, buildAudit } from "./generator.js";

const form = document.querySelector("#generator-form");
const cardsRoot = document.querySelector("#message-cards");
const auditRoot = document.querySelector("#audit-list");
const statusRoot = document.querySelector("#status-pill");
const presetButton = document.querySelector("#load-preset");

function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

function render() {
  const data = getFormData();
  const messages = generateMessages(data);
  const audit = buildAudit(data);

  statusRoot.textContent = `${messages.length} outreach variants ready`;
  cardsRoot.innerHTML = "";
  auditRoot.innerHTML = "";

  audit.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.label}</span><strong>${item.value}</strong>`;
    auditRoot.appendChild(li);
  });

  messages.forEach((item) => {
    const article = document.createElement("article");
    article.className = "message-card";
    article.innerHTML = `
      <div class="card-header">
        <div>
          <p class="eyebrow">${item.channelLabel}</p>
          <h3>${item.headline}</h3>
        </div>
        <span class="tone-chip">${item.toneLabel}</span>
      </div>
      <p class="message-body">${escapeHtml(item.message)}</p>
      <div class="card-footer">
        <span>${item.message.length} characters</span>
        <button type="button" class="copy-button">Copy</button>
      </div>
    `;

    article.querySelector(".copy-button").addEventListener("click", async () => {
      await navigator.clipboard.writeText(item.message);
      const button = article.querySelector(".copy-button");
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    });

    cardsRoot.appendChild(article);
  });
}

function loadPreset() {
  const preset = {
    freelancerName: "Dasia",
    service: "short-form video editing and content systems",
    idealClient: "coaches and service businesses",
    niche: "personal brands",
    proof: "I help clients turn scattered content into cleaner offers and more consistent posting",
    offer: "send over 3 custom content hooks you could test this week",
    cta: "would you be open to me sending those over?",
    channel: "dm",
  };

  Object.entries(preset).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });

  render();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

form.addEventListener("input", render);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

presetButton.addEventListener("click", loadPreset);

render();
