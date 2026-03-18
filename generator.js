const defaultToneLabels = {
  insight: "Insight-Led",
  value: "Value-First",
  warm: "Warm",
  direct: "Direct",
};

const platformMap = {
  contra: {
    label: "Contra",
    opener: "Saw your profile and loved how clearly your offer comes through.",
  },
  linkedin: {
    label: "LinkedIn",
    opener: "Came across your work and thought there might be a strong fit here.",
  },
  instagram: {
    label: "Instagram",
    opener: "Just found your page and had to reach out because the positioning is strong.",
  },
  email: {
    label: "Email",
    opener: "I came across your work and wanted to send a quick note.",
  },
};

const objectiveMap = {
  reply: "start a conversation",
  audit: "offer a quick audit",
  ideas: "send a few tailored ideas",
  call: "book a quick call",
};

function sentence(value) {
  return (value || "").trim().replace(/\s+/g, " ");
}

function clampChannel(channel) {
  return channel === "email" ? "email" : "dm";
}

function clampPlatform(platform) {
  return platformMap[platform] ? platform : "contra";
}

function clampObjective(objective) {
  return objectiveMap[objective] ? objective : "reply";
}

function clampEnergy(energy) {
  return ["casual", "sharp", "premium"].includes(energy) ? energy : "sharp";
}

export function buildContext(input) {
  const channel = clampChannel(input.channel);
  const platform = clampPlatform(input.platform);
  const objective = clampObjective(input.objective);
  const energy = clampEnergy(input.energy);
  return {
    freelancerName: sentence(input.freelancerName) || "a freelancer",
    service: sentence(input.service) || "freelance services",
    idealClient: sentence(input.idealClient) || "growing businesses",
    niche: sentence(input.niche) || "their space",
    proof: sentence(input.proof) || "help clients improve conversion and response rates",
    offer: sentence(input.offer) || "share a few tailored ideas",
    cta: sentence(input.cta) || "open to a quick chat next week?",
    channel,
    platform,
    platformLabel: platformMap[platform].label,
    objective,
    objectiveLabel: objectiveMap[objective],
    energy,
    energyLabel: energy.charAt(0).toUpperCase() + energy.slice(1),
  };
}

function channelWord(channel) {
  return channel === "email" ? "email" : "DM";
}

export function generateMessages(input) {
  const context = buildContext(input);
  const opener = platformMap[context.platform].opener;
  const templates = {
    insight: {
      headline: "Pattern-Spotter Opener",
      why: "Leads with an observation so the DM feels less generic.",
      body: `${salutation(context)} ${opener} I work with ${context.idealClient} on ${context.service}, and one thing I keep noticing in ${context.niche} is that small messaging tweaks create outsized reply lift. ${capitalize(
        context.proof
      )}. Happy to ${context.offer}. ${capitalize(context.cta)}`,
    },
    value: {
      headline: "Value-First Intro",
      why: "Gets to the value quickly and makes the offer concrete.",
      body: `${salutation(context)} I help ${context.idealClient} with ${context.service}, especially in ${context.niche}. ${capitalize(
        context.proof
      )}. If helpful, I can ${context.offer}. ${capitalize(context.cta)}`,
    },
    warm: {
      headline: "Warm Personalized DM",
      why: "Feels more relational and approachable for creator-style outreach.",
      body: `${salutation(context)} there, I work with ${
        context.idealClient
      } on ${context.service} and thought your brand looked like a strong fit. ${capitalize(
        context.proof
      )}, and I’d love to ${context.offer}. ${capitalize(context.cta)}`,
    },
    direct: {
      headline: "Short Direct Pitch",
      why: "Optimized for shorter attention spans and cold-first contact.",
      body: `${salutation(context)} I help ${context.idealClient} with ${context.service}. ${capitalize(
        context.proof
      )}. Happy to ${context.offer} if ${context.cta.toLowerCase()}`,
    },
  };

  const results = Object.entries(templates).map(([tone, template]) => ({
    tone,
    toneLabel: defaultToneLabels[tone],
    headline: template.headline,
    channelLabel: channelWord(context.channel),
    why: template.why,
    score: scoreMessage(template.body, context),
    tags: buildTags(tone, context),
    message: stylize(template.body.replace(/\s+/g, " ").trim(), context),
  }));

  const followUp = {
    tone: "followup",
    toneLabel: "Follow-Up",
    headline: "Follow-Up Message",
    channelLabel: channelWord(context.channel),
    why: "Keeps the thread alive without sounding pushy.",
    score: 84,
    tags: ["Bump", context.platformLabel, context.energyLabel],
    message: `${context.channel === "email" ? "Hi again" : "Hey, just following up"} ${
      context.channel === "email" ? "-" : ""
    } wanted to bump this in case it got buried. Still happy to ${context.offer}. ${capitalize(
      context.cta
    )}`.replace(/\s+/g, " ").trim(),
  };

  return [...results, followUp];
}

export function buildAudit(input) {
  const context = buildContext(input);
  return [
    { label: "Target client", value: context.idealClient },
    { label: "Service", value: context.service },
    { label: "Proof angle", value: context.proof },
    { label: "Offer", value: context.offer },
    { label: "Platform", value: context.platformLabel },
    { label: "Goal", value: context.objectiveLabel },
    { label: "Channel", value: channelWord(context.channel) },
  ];
}

function scoreMessage(message, context) {
  let score = 72;
  if (message.includes(context.offer)) score += 6;
  if (message.includes(context.proof)) score += 8;
  if (message.includes(context.cta)) score += 6;
  if (message.length < 320) score += 5;
  if (context.energy === "premium") score += 2;
  return Math.min(score, 96);
}

function buildTags(tone, context) {
  return [defaultToneLabels[tone], context.platformLabel, context.energyLabel];
}

function salutation(context) {
  if (context.channel === "email") return "Hi,";
  if (context.energy === "casual") return "Hey,";
  if (context.energy === "premium") return "Hi there,";
  return "Hey,";
}

function stylize(message, context) {
  if (context.energy === "casual") {
    return message.replace("I would love to", "I’d love to").replace("I am", "I’m");
  }
  if (context.energy === "premium") {
    return message.replace("Happy to", "Glad to").replace("quick", "brief");
  }
  return message;
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
