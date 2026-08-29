import { z } from "zod";

export const assistantMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(20_000),
  })
  .strip();

export const assistantChatSchema = z
  .object({
    messages: z.array(assistantMessageSchema).min(1).max(40),
  })
  .strip()
  .superRefine((body, context) => {
    const lastMessage = body.messages[body.messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      context.addIssue({
        code: "custom",
        message: "The final message must be from the user.",
        path: ["messages"],
      });
    }
  });

export type AssistantChatBody = z.infer<typeof assistantChatSchema>;
