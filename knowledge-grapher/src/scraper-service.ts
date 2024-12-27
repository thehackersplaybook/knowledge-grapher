import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

export class ScraperService {
  private firecrawlApp: FirecrawlApp;

  constructor(apiKey: string) {
    this.firecrawlApp = new FirecrawlApp({ apiKey });
  }

  async scrape(url: string) {
    return this.firecrawlApp
      .scrapeUrl(url)
      .then((response) => (response as any).markdown)
      .catch((error) => {
        console.error(`Error scraping URL: ${url}`, error);
        throw new Error(`Scraping failed for URL: ${url}`);
      });
  }
}
