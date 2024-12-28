import { KnowledgeGrapher } from "knowledge-grapher";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const urls = [
  "https://thehackersplaybook.substack.com/p/prototyping-101-talk-is-cheap-show-me-the-code",
  "https://thehackersplaybook.substack.com/p/building-chatgpt-llm-wrapper-products",
  "https://thehackersplaybook.substack.com/p/a-guide-to-navigating-large-codebases",
  "https://thehackersplaybook.substack.com/p/first-just-ship-software-that-works",
];

const main = async () => {
  const knowledgeGrapher = KnowledgeGrapher.getInstance();
  const results: any[] = [];

  for (const url of urls) {
    console.log(`Generating knowledge graph for ${url}`);
    const result = await knowledgeGrapher
      .generateKnowledgeGraph({
        url,
        model: "openai:gpt-4o",
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    console.log(`Generated knowledge graph for ${url}`, result);
    results.push(result);
  }

  console.log(`Writing results to results.json`);

  await fs.writeFile("results.json", JSON.stringify(results, null, 2));

  console.log(`Results written to results.json`);
};

main();
