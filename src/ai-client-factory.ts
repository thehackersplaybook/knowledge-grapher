import { LanguageModel, generateText, generateObject } from "ai";
import { Schema } from "zod";

interface GenerateBaseOptions {
  system: string;
  prompt: string;
}

interface GenerateObjectOptions extends GenerateBaseOptions {
  schema: Schema;
}

interface GenerateTextOptions extends GenerateBaseOptions {}

interface GetClientOptions {
  model: LanguageModel;
}

interface AiClient {
  generateObject: (
    options: GenerateObjectOptions
  ) => Promise<Record<string, any>>;
  generateText: (options: GenerateTextOptions) => Promise<string>;
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
}
