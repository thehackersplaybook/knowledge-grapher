import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { AIClientFactory } from "../ai-client-factory";
import { openai } from "@ai-sdk/openai";
import z from "zod";

describe("AIClientFactory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate text using the provided model", async () => {
    const model = openai("gpt-4o");
    const factory = new AIClientFactory();
    const client = factory.getClient({ model });
    const options = { system: "test-system", prompt: "test-prompt" };

    const result = await client.generateText(options);

    expect(result).toBeDefined();
  });

  it("should generate object using the provided model", async () => {
    const model = openai("gpt-4o");
    const factory = new AIClientFactory();
    const client = factory.getClient({ model });
    const options = {
      system: "test-system",
      prompt: "test-prompt",
      schema: z.object({
        key: z.string(),
        value: z.number(),
      }),
    };

    const result = await client.generateObject(options);

    expect(result).toBeDefined();
  });

  it("should return the client tools", () => {
    const factory = new AIClientFactory();
    const tools = factory.getClientTools();
    expect(tools.getModelLib).toBeDefined();
  });

  it("should return the correct model library for openai", () => {
    const factory = new AIClientFactory();
    const tools = factory.getClientTools();
    expect(tools.getModelLib("openai:gpt-4o")).toBeDefined();
  });

  it("should return the correct model library for anthropic", () => {
    const factory = new AIClientFactory();
    const tools = factory.getClientTools();
    expect(tools.getModelLib("anthropic:claude-3-5-sonnet")).toBeDefined();
  });

  it("should throw an error if the model provider is not supported", () => {
    const factory = new AIClientFactory();
    const tools = factory.getClientTools();
    expect(() => tools.getModelLib("unsupported:model")).toThrow(
      "Unsupported model provider: unsupported"
    );
  });
});
