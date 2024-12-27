import { AiClient, AIClientFactory } from "./ai-client-factory";
import z from "zod";
import { BlogIngestor } from "./blog-ingestor";

export interface GenerateKnowledgeGraphOptions {
  url: string;
  model: string;
}

export interface GenerateKnowledgeGraphResult {
  error?: string;
  nodes: {
    id: string;
    label: string;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
}

export class KnowledgeGrapher {
  constructor(
    private readonly aiClientFactory: AIClientFactory,
    private readonly blogIngestor: BlogIngestor
  ) {}

  async generateKnowledgeGraph(
    options: GenerateKnowledgeGraphOptions
  ): Promise<GenerateKnowledgeGraphResult> {
    const aiClient = this.getAIClient(options.model);
    const { url } = options;
    const pageContent = await this.getBlogContent(url).catch((err) => null);

    if (!pageContent) {
      return {
        error: "Error ingesting blog. Please try again.",
        nodes: [],
        edges: [],
      };
    }

    const { system, prompt } = await this.getKnowledgeGraphPrompt(pageContent);
    const schema = this.getKnowledgeGraphSchema();

    const { object: knowledgeGraph } = await aiClient.generateObject({
      prompt,
      system,
      schema,
    });

    return {
      error: null,
      ...knowledgeGraph,
    };
  }

  private getAIClient(model: string): AiClient {
    return this.aiClientFactory.getClient({
      model: this.aiClientFactory.getClientTools().getModelLib(model),
    });
  }

  private getBlogContent(url: string): Promise<string> {
    return this.blogIngestor
      .ingest({ url })
      .then((result) => result.content)
      .catch((err) => {
        console.error("Error ingesting blog", err);
        throw err;
      });
  }

  private getKnowledgeGraphPrompt(pageContent: string): {
    system: string;
    prompt: string;
  } {
    return {
      system: "You are a knowledge graph generator.",
      prompt: `
      You are a knowledge graph generator.
      You are given the page content of a URL and you need to generate a knowledge graph for it.

      Here is the content of the page:
      """
      ${pageContent}
      """
    `,
    };
  }

  private getKnowledgeGraphSchema(): z.ZodType<GenerateKnowledgeGraphResult> {
    return z.object({
      nodes: z.array(z.object({ id: z.string(), label: z.string() })),
      edges: z.array(z.object({ source: z.string(), target: z.string() })),
    });
  }
}
