import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: "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" });

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, world" }],
});
console.log(message.content);