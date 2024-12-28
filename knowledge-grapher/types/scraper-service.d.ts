export declare class ScraperService {
    private firecrawlApp;
    constructor(apiKey: string);
    scrape(url: string): Promise<any>;
}
