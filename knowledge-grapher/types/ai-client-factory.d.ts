import { LanguageModel } from "ai";
import { Schema } from "zod";
export interface GenerateBaseOptions {
    system: string;
    prompt: string;
}
export interface GenerateObjectOptions extends GenerateBaseOptions {
    schema: Schema;
}
export interface GenerateTextOptions extends GenerateBaseOptions {
}
export interface GetClientOptions {
    model: LanguageModel;
}
export interface AiClient {
    generateObject: (options: GenerateObjectOptions) => Promise<Record<string, any>>;
    generateText: (options: GenerateTextOptions) => Promise<string>;
}
export interface AiClientTools {
    getModelLib: (modelName: string) => LanguageModel;
}
export declare class AIClientFactory {
    getClient({ model }: GetClientOptions): AiClient;
    getClientTools(): AiClientTools;
    private customGenerateObject;
    private customGenerateText;
    private getModelLib;
}
