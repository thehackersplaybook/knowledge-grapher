import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { LanguageModel, generateText, generateObject } from "ai";
import { Schema } from "zod";

export interface GenerateBaseOptions {
  system: string;
  prompt: string;
}

export interface GenerateObjectOptions extends GenerateBaseOptions {
  schema: Schema;
}

export interface GenerateTextOptions extends GenerateBaseOptions {}

export interface GetClientOptions {
  model: LanguageModel;
}

export interface AiClient {
  generateObject: (
    options: GenerateObjectOptions
  ) => Promise<Record<string, any>>;
  generateText: (options: GenerateTextOptions) => Promise<string>;
}

export interface AiClientTools {
  getModelLib: (modelName: string) => LanguageModel;
}

export class AIClientFactory {
  getClient({ model }: GetClientOptions): AiClient {
    return {
      generateObject: (options: GenerateObjectOptions) =>
        this.customGenerateObject(model, options),
      generateText: (options: GenerateTextOptions) =>
        this.customGenerateText(model, options),
    };
  }

  getClientTools(): AiClientTools {
    return {
      getModelLib: (modelName: string) => this.getModelLib(modelName),
    };
  }

  private customGenerateObject = async (
    model: LanguageModel,
    options: GenerateObjectOptions
  ): Promise<Record<string, any>> =>
    generateObject({
      model,
      ...options,
    }).then((response) => response.object as Record<string, any>);

  private customGenerateText = async (
    model: LanguageModel,
    options: GenerateTextOptions
  ): Promise<string> =>
    generateText({ model, ...options }).then((response) => response.text);

  private getModelLib(modelName: string): LanguageModel {
    const [provider, model] = modelName.split(":");
    if (provider === "openai") {
      return openai(model);
    } else if (provider === "anthropic") {
      return anthropic(model);
    }

    throw new Error(`Unsupported model provider: ${provider}`);
  }
}
