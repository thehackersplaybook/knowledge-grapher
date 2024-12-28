import { AIClientFactory } from "./ai-client-factory";
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
export declare class KnowledgeGrapher {
    private readonly aiClientFactory;
    private readonly blogIngestor;
    constructor(aiClientFactory: AIClientFactory, blogIngestor: BlogIngestor);
    static getInstance(): KnowledgeGrapher;
    generateKnowledgeGraph(options: GenerateKnowledgeGraphOptions): Promise<GenerateKnowledgeGraphResult>;
    private getAIClient;
    private getBlogContent;
    private getKnowledgeGraphPrompt;
    private getKnowledgeGraphSchema;
}
