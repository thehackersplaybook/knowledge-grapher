import { ScraperService } from "./scraper-service";

type URL = string;

interface BlogIngestOptions {
  url: URL;
}

interface BlogIngestResult {
  content: string;
}

export class BlogIngestor {
  constructor(private readonly scraperService: ScraperService) {}

  public async ingest(options: BlogIngestOptions): Promise<BlogIngestResult> {
    const { content } = await this.scraperService.scrape(options.url);
    return { content };
  }
}
