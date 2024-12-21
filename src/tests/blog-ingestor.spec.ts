import { BlogIngestor } from "../blog-ingestor";
import { ScraperService } from "../scraper-service";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mockDeep, DeepMockProxy } from "vitest-mock-extended";

describe("blog ingestor", () => {
  let blogIngestor: BlogIngestor;
  let mockScraperService: DeepMockProxy<ScraperService>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockScraperService = mockDeep<ScraperService>();
    blogIngestor = new BlogIngestor(mockScraperService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ingest", () => {
    const url =
      "https://thehackersplaybook.substack.com/p/first-just-ship-software-that-works";
    const mockResponse = {
      content: `First, Just Ship Software that Works\nThe Hacker's Playbook\nAs a Software Engineer, get into the habit of shipping software that just works and is easy to maintain.\nWhen in doubt, focus on 'getting it to work' instead of prematurely optimising for future requirements. When in doubt, focus on "getting it to work" instead of prematurely optimising for future requirements.`,
    };

    it("accepts a blog URL and retrieves the markdown content", async () => {
      mockScraperService.scrape.mockResolvedValue(mockResponse);

      const { content } = await blogIngestor.ingest({ url });

      expect(content).toContain("First, Just Ship Software that Works");
      expect(content).toContain("The Hacker's Playbook");
      expect(content).toContain(
        "As a Software Engineer, get into the habit of shipping software that just works and is easy to maintain."
      );
      expect(content).toContain(
        'When in doubt, focus on "getting it to work" instead of prematurely optimising for future requirements.'
      );
    });

    it("throws an error if the URL is invalid", async () => {
      const invalidUrl = "https://somedomainthatdoesntexist.com";
      mockScraperService.scrape.mockRejectedValue(
        new Error(
          "Ingestion failed for URL: https://somedomainthatdoesntexist.com"
        )
      );

      await expect(
        blogIngestor.ingest({ url: invalidUrl })
      ).rejects.toThrowError(
        "Ingestion failed for URL: https://somedomainthatdoesntexist.com"
      );
    });
  });
});
