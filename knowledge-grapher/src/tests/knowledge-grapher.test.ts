import { KnowledgeGrapher } from "../knowledge-grapher";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { BlogIngestor } from "../blog-ingestor";
import { AIClientFactory } from "../ai-client-factory";
import { openai } from "@ai-sdk/openai";

describe("knowledge grapher", () => {
  let knowledgeGrapher: KnowledgeGrapher;
  let mockBlogIngestor: DeepMockProxy<BlogIngestor>;
  let mockAIClientFactory: DeepMockProxy<AIClientFactory>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAIClientFactory = mockDeep<AIClientFactory>();
    mockBlogIngestor = mockDeep<BlogIngestor>();
    knowledgeGrapher = new KnowledgeGrapher(
      mockAIClientFactory,
      mockBlogIngestor
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a knowledge graph for a given URL", async () => {
    const url = "https://example.com";
    const mockResponse = {
      error: null,
      nodes: [{ id: "1", label: "Node 1" }],
      edges: [{ source: "1", target: "2" }],
    };
    const mockAiClient = {
      generateObject: vi
        .fn()
        .mockImplementation(() => Promise.resolve({ object: mockResponse })),
      generateText: vi.fn().mockResolvedValueOnce(""),
    };
    const mockAiTools = {
      getModelLib: vi.fn().mockResolvedValueOnce(openai("gpt-4o")),
    };

    const ingestedContent = "Ingested Content";
    mockBlogIngestor.ingest.mockResolvedValueOnce({ content: ingestedContent });
    mockAIClientFactory.getClient.mockImplementation(() => mockAiClient);
    mockAIClientFactory.getClientTools.mockImplementation(() => mockAiTools);

    const result = await knowledgeGrapher.generateKnowledgeGraph({
      url,
      model: "openai:gpt-4o",
    });

    expect(result).toEqual(mockResponse);
  });
});
