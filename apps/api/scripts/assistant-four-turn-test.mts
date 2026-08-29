import { assistantChatSchema } from "../src/ai/assistantValidation.js";
import { generateAssistantReply } from "../src/ai/assistantChat.js";

function assertSchemaAccepts(label: string, body: unknown) {
  const parsed = assistantChatSchema.safeParse(body);
  if (!parsed.success) {
    console.error(`FAIL ${label}`, parsed.error.issues);
    process.exitCode = 1;
    return false;
  }

  console.log(`PASS ${label}`);
  return true;
}

const longAssistantReply = "Recovery squads are small accountability groups. ".repeat(120);
console.log(`Long assistant reply length: ${longAssistantReply.length}`);

assertSchemaAccepts("first user message only", {
  messages: [{ role: "user", content: "How do squads work?" }],
});

assertSchemaAccepts("second turn with long assistant history", {
  messages: [
    { role: "user", content: "How do squads work?" },
    { role: "assistant", content: longAssistantReply },
    { role: "user", content: "What about Healing Chain?" },
  ],
});

assertSchemaAccepts("extra client fields are stripped", {
  messages: [
    {
      role: "user",
      content: "Hello",
      id: "ignored",
      createdAt: "2026-01-01T00:00:00.000Z",
      kind: "normal",
    },
  ],
});

if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.log("SKIP live 4-turn test: no AI API key configured.");
  process.exit(process.exitCode ?? 0);
}

const history: Array<{ role: "user" | "assistant"; content: string }> = [];
const prompts = [
  "How do recovery squads work on ZeroOne?",
  "How is that different from Healing Chain?",
  "Can you point me to the Healing Journal?",
  "Thanks — what should I try first this week?",
];

for (const [index, prompt] of prompts.entries()) {
  history.push({ role: "user", content: prompt });
  const parsed = assistantChatSchema.safeParse({ messages: history });
  if (!parsed.success) {
    console.error(`FAIL schema before live turn ${index + 1}`, parsed.error.issues);
    process.exit(1);
  }

  const result = await generateAssistantReply(history);
  console.log(`Turn ${index + 1}: status=${result.status}, model=${result.model ?? "none"}`);

  if (!result.message?.content) {
    console.error(`FAIL live turn ${index + 1}: no assistant message`, result);
    process.exit(1);
  }

  history.push(result.message);
}

console.log(`PASS live 4-turn conversation (${history.length} messages total)`);
