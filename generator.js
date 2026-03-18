const defaultToneLabels = {
  value: "Value-First",
  warm: "Warm",
  direct: "Direct",
};

function sentence(value) {
  return (value || "").trim().replace(/\s+/g, " ");
}

function clampChannel(channel) {
  return channel === "email" ? "email" : "dm";
}

export function buildContext(input) {
  const channel = clampChannel(input.channel);
  return {
    freelancerName: sentence(input.freelancerName) || "a freelancer",
    service: sentence(input.service) || "freelance services",
    idealClient: sentence(input.idealClient) || "growing businesses",
    niche: sentence(input.niche) || "their space",
    proof: sentence(input.proof) || "help clients improve conversion and response rates",
    offer: sentence(input.offer) || "share a few tailored ideas",
    cta: sentence(input.cta) || "open to a quick chat next week?",
    channel,
  };
}

function channelWord(channel) {
  return channel === "email" ? "email" : "DM";
}

export function generateMessages(input) {
  const context = buildContext(input);
  const introLead =
    context.channel === "email"
      ? `Hi, I came across your work and wanted to reach out.`
      : `Hey, came across your work and wanted to reach out.`;

  const templates = {
    value: {
      headline: "Value-First Intro",
      body: `${introLead} I help ${context.idealClient} with ${context.service}, especially in ${context.niche}. ${capitalize(
        context.proof
      )}. If helpful, I can ${context.offer}. ${capitalize(context.cta)}`,
    },
    warm: {
      headline: "Warm Personalized DM",
      body: `${context.channel === "email" ? "Hi" : "Hey"} there, I work with ${
        context.idealClient
      } on ${context.service} and thought your brand looked like a strong fit. ${capitalize(
        context.proof
      )}, and I’d love to ${context.offer}. ${capitalize(context.cta)}`,
    },
    direct: {
      headline: "Short Direct Pitch",
      body: `${context.channel === "email" ? "Hi" : "Hey"} ${
        context.channel === "email" ? "" : ""
      }I help ${context.idealClient} with ${context.service}. ${capitalize(
        context.proof
      )}. Happy to ${context.offer} if ${context.cta.toLowerCase()}`,
    },
  };

  const results = Object.entries(templates).map(([tone, template]) => ({
    tone,
    toneLabel: defaultToneLabels[tone],
    headline: template.headline,
    channelLabel: channelWord(context.channel),
    message: template.body.replace(/\s+/g, " ").trim(),
  }));

  const followUp = {
    tone: "followup",
    toneLabel: "Follow-Up",
    headline: "Follow-Up Message",
    channelLabel: channelWord(context.channel),
    message: `${context.channel === "email" ? "Hi again" : "Hey, just following up"} ${
      context.channel === "email" ? "-" : ""
    } wanted to bump this in case it got buried. Still happy to ${context.offer}. ${capitalize(
      context.cta
    )}`,
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
    { label: "Channel", value: channelWord(context.channel) },
  ];
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
