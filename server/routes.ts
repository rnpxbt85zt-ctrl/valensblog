import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { calculateReadingTime } from "./utils";
import { insertArticleSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles({ status: 'published' });
      
      const articlesWithMetadata = articles.map((article) => ({
        ...article,
        readingTime: calculateReadingTime(article.content),
        coverUrl: article.coverImageUrl,
      }));
      
      res.json(articlesWithMetadata);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/article/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article || article.status !== 'published') {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const articleWithMetadata = {
        ...article,
        readingTime: calculateReadingTime(article.content),
        coverUrl: article.coverImageUrl,
      };
      
      res.json(articleWithMetadata);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/article/:slug/view", async (req, res) => {
    try {
      const { slug } = req.params;
      const newCount = await storage.incrementArticleViews(slug);
      res.json({ count: newCount });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).json({ error: "Failed to update view count" });
    }
  });

  // Protected admin article routes
  app.get("/api/admin/articles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const articles = await storage.getArticles({ authorId: userId });
      
      const articlesWithMetadata = articles.map((article) => ({
        ...article,
        readingTime: calculateReadingTime(article.content),
      }));
      
      res.json(articlesWithMetadata);
    } catch (error) {
      console.error("Error fetching admin articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/admin/article/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const article = await storage.getArticleById(id);
      
      if (!article || article.authorId !== userId) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/admin/articles", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const articleData = {
        ...req.body,
        authorId: userId,
        publishedAt: req.body.status === 'published' ? new Date() : null,
      };
      const validatedData = insertArticleSchema.parse(articleData);
      
      const article = await storage.createArticle(validatedData);
      res.json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/admin/article/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check ownership
      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle || existingArticle.authorId !== userId) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const updateData = {
        ...req.body,
        publishedAt: req.body.status === 'published' && !existingArticle.publishedAt ? new Date() : existingArticle.publishedAt,
      };
      
      const article = await storage.updateArticle(id, updateData);
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/admin/article/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check ownership
      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle || existingArticle.authorId !== userId) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const success = await storage.deleteArticle(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics", isAuthenticated, async (req, res) => {
    try {
      const popularArticles = await storage.getPopularArticles(5);
      const popularWithMetadata = popularArticles.map((article) => ({
        ...article,
        readingTime: calculateReadingTime(article.content),
      }));
      
      res.json({
        popularArticles: popularWithMetadata,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Object storage routes for image uploads
  app.post("/api/upload/image", isAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/upload/image/confirm", isAuthenticated, async (req: any, res) => {
    try {
      const { imageURL } = req.body;
      const userId = req.user.claims.sub;
      
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        imageURL,
        {
          owner: userId,
          visibility: "public", // Blog images are public
        },
      );

      res.json({ objectPath });
    } catch (error) {
      console.error("Error confirming image upload:", error);
      res.status(500).json({ error: "Failed to confirm upload" });
    }
  });

  // Serve uploaded images
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving image:", error);
      res.status(404).json({ error: "Image not found" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
