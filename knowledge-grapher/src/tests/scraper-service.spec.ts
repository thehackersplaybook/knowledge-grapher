import { ScraperService } from "../scraper-service";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("scraper service", () => {
  let scraperService: ScraperService;

  beforeEach(() => {
    vi.clearAllMocks();
    scraperService = new ScraperService(process.env.FIRECRAWL_API_KEY!);
  });

  it("scrapes a URL successfully", async () => {
    const url = "https://example.com";
    const mockResponse = { content: "Example Content" };
    vi.spyOn(scraperService, "scrape").mockResolvedValue(mockResponse);

    const result = await scraperService.scrape(url);
    expect(result).toEqual(mockResponse);
  });

  it("throws an error if scraping fails", async () => {
    const url = "https://invalidurl.com";
    vi.spyOn(scraperService, "scrape").mockRejectedValue(
      new Error("Scraping failed")
    );

    await expect(scraperService.scrape(url)).rejects.toThrowError(
      "Scraping failed"
    );
  });
});
