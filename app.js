import { generateMessages, buildAudit } from "./generator.js";

const form = document.querySelector("#generator-form");
const cardsRoot = document.querySelector("#message-cards");
const auditRoot = document.querySelector("#audit-list");
const statusRoot = document.querySelector("#status-pill");
const presetButton = document.querySelector("#load-preset");
const previewMessageRoot = document.querySelector("#preview-message");
const previewMetaRoot = document.querySelector("#preview-meta");
const personaButtons = document.querySelectorAll(".persona-chip");
const hero = document.querySelector(".hero");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const tiltPanels = document.querySelectorAll(".panel-3d");

const personas = {
  videoEditor: {
    freelancerName: "Dasia",
    service: "short-form video editing and content systems",
    idealClient: "coaches and service businesses",
    niche: "personal brands",
    proof: "I help clients turn scattered content into cleaner offers and more consistent posting",
    offer: "send over 3 custom content hooks you could test this week",
    cta: "would you be open to me sending those over?",
    channel: "dm",
    platform: "contra",
    objective: "ideas",
    energy: "sharp",
  },
  designer: {
    freelancerName: "Dasia",
    service: "brand design and landing page polish",
    idealClient: "founders and coaches",
    niche: "service businesses",
    proof: "I help clients look more premium so their pages convert with less friction",
    offer: "mock up 2 quick improvements based on your current branding",
    cta: "want me to send those over?",
    channel: "dm",
    platform: "instagram",
    objective: "audit",
    energy: "premium",
  },
  copywriter: {
    freelancerName: "Dasia",
    service: "sales copy and email funnel strategy",
    idealClient: "course creators",
    niche: "digital products",
    proof: "I help tighten messaging so offers feel clearer and easier to buy",
    offer: "share 3 message angles you could test in your next campaign",
    cta: "would that be helpful?",
    channel: "email",
    platform: "email",
    objective: "ideas",
    energy: "sharp",
  },
  developer: {
    freelancerName: "Dasia",
    service: "conversion-focused web development",
    idealClient: "startups and agencies",
    niche: "B2B SaaS",
    proof: "I help teams turn messy sites into clearer funnels with stronger user flow",
    offer: "send a quick teardown of one high-impact page",
    cta: "open to that?",
    channel: "dm",
    platform: "linkedin",
    objective: "audit",
    energy: "casual",
  },
};

function getFormData() {
  return Object.fromEntries(new FormData(form).entries());
}

function render() {
  const data = getFormData();
  const messages = generateMessages(data);
  const audit = buildAudit(data);
  const featured = messages[0];

  statusRoot.textContent = `${messages.length} outreach variants ready`;
  cardsRoot.innerHTML = "";
  auditRoot.innerHTML = "";
  previewMessageRoot.textContent = featured.message;
  previewMetaRoot.innerHTML = `
    <span>${featured.toneLabel}</span>
    <span>${featured.score}/100</span>
    <span>${featured.channelLabel}</span>
  `;

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
      <p class="message-why">${escapeHtml(item.why)}</p>
      <div class="tag-row">${item.tags
        .map((tag) => `<span class="mini-chip">${escapeHtml(tag)}</span>`)
        .join("")}</div>
      <div class="remix-row">
        <button type="button" class="remix-button" data-mode="shorter">Shorter</button>
        <button type="button" class="remix-button" data-mode="spicier">Spicier</button>
        <button type="button" class="remix-button" data-mode="softer">Softer</button>
      </div>
      <div class="card-footer">
        <span>${item.message.length} characters · ${item.score}/100</span>
        <button type="button" class="copy-button">Copy</button>
      </div>
    `;

    const bodyNode = article.querySelector(".message-body");
    const scoreNode = article.querySelector(".card-footer span");

    article.querySelector(".copy-button").addEventListener("click", async () => {
      await navigator.clipboard.writeText(bodyNode.textContent);
      const button = article.querySelector(".copy-button");
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    });

    article.querySelectorAll(".remix-button").forEach((button) => {
      button.addEventListener("click", () => {
        const remixed = remixMessage(bodyNode.textContent, button.dataset.mode);
        bodyNode.textContent = remixed;
        scoreNode.textContent = `${remixed.length} characters · ${scoreFromText(remixed)}/100`;
        previewMessageRoot.textContent = remixed;
      });
    });

    cardsRoot.appendChild(article);
  });
}

function loadPreset() {
  applyPersona(personas.videoEditor);
}

function applyPersona(preset) {
  Object.entries(preset).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });

  render();
}

function remixMessage(message, mode) {
  if (mode === "shorter") {
    return message
      .replace("and thought your brand looked like a strong fit. ", "")
      .replace("If helpful, ", "")
      .replace("Still ", "")
      .trim();
  }

  if (mode === "spicier") {
    return message
      .replace("wanted to", "had to")
      .replace("strong fit", "serious opportunity")
      .replace("help", "help directly")
      .trim();
  }

  if (mode === "softer") {
    return message
      .replace("Glad to", "Happy to")
      .replace("had to", "wanted to")
      .replace("serious opportunity", "nice fit")
      .trim();
  }

  return message;
}

function scoreFromText(message) {
  let score = 78;
  if (message.length < 260) score += 6;
  if (message.includes("?")) score += 4;
  if (message.includes("help")) score += 3;
  return Math.min(score, 96);
}

function wireParallax() {
  if (!hero) return;

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 12);
      const moveX = (offsetX / rect.width) * depth;
      const moveY = (offsetY / rect.height) * depth;

      if (layer.classList.contains("phone-preview")) {
        layer.style.transform =
          `rotateY(${-22 + moveX * 0.35}deg) rotateX(${11 - moveY * 0.25}deg) ` +
          `rotateZ(${-3 + moveX * 0.05}deg) translate3d(${moveX * 0.7}px, ${moveY * 0.5}px, 0)`;
        return;
      }

      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  hero.addEventListener("mouseleave", () => {
    parallaxLayers.forEach((layer) => {
      layer.style.transform = "";
    });
  });
}

function wirePanelTilt() {
  tiltPanels.forEach((panel) => {
    panel.addEventListener("mousemove", (event) => {
      const rect = panel.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      const rotateY = (offsetX / rect.width) * 5;
      const rotateX = (offsetY / rect.height) * -4;
      panel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    panel.addEventListener("mouseleave", () => {
      panel.style.transform = "";
    });
  });
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
personaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPersona(personas[button.dataset.persona]);
  });
});

wireParallax();
wirePanelTilt();
render();
