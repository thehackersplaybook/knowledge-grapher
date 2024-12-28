import { ScraperService } from "./scraper-service";
type URL = string;
interface BlogIngestOptions {
    url: URL;
}
interface BlogIngestResult {
    content: string;
}
export declare class BlogIngestor {
    private readonly scraperService;
    constructor(scraperService: ScraperService);
    ingest(options: BlogIngestOptions): Promise<BlogIngestResult>;
}
export {};
