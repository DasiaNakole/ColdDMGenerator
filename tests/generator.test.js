import test from "node:test";
import assert from "node:assert/strict";

import { buildContext, generateMessages, buildAudit } from "../generator.js";

test("buildContext fills defaults and normalizes channel", () => {
  const context = buildContext({ channel: "something-else" });
  assert.equal(context.channel, "dm");
  assert.equal(context.idealClient, "growing businesses");
  assert.equal(context.platform, "contra");
});

test("generateMessages returns multiple variants plus follow-up", () => {
  const messages = generateMessages({
    service: "landing page design",
    idealClient: "coaches",
    niche: "wellness",
    proof: "I help improve conversion rates",
    offer: "share 2 ideas",
    cta: "would that be useful?",
    channel: "email",
    platform: "linkedin",
    energy: "premium",
  });

  assert.equal(messages.length, 5);
  assert.match(messages[0].message, /coaches/);
  assert.match(messages[4].headline, /Follow-Up/);
  assert.ok(messages[0].score >= 70);
});

test("buildAudit exposes the strategy summary", () => {
  const audit = buildAudit({
    service: "email marketing",
    idealClient: "founders",
    proof: "I help improve response rates",
    offer: "send 3 ideas",
    channel: "dm",
  });

  assert.equal(audit.length, 7);
  assert.equal(audit[1].value, "email marketing");
});
