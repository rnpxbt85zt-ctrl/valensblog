import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { calculateReadingTime } from "./utils";
import { insertArticleSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import multer from "multer";
import path from "path";

// Multer config: memory storage so we can pipe to object storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/webp", "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "video/mp4", "video/quicktime",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Auth routes ──────────────────────────────────────────────────────────
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = "admin";
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ── Public article routes ────────────────────────────────────────────────
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles({ status: "published" });
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
      if (!article || article.status !== "published") {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({
        ...article,
        readingTime: calculateReadingTime(article.content),
        coverUrl: article.coverImageUrl,
      });
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

  // ── Protected admin article routes ───────────────────────────────────────
  app.get("/api/admin/articles", isAuthenticated, async (req: any, res) => {
    try {
      const articles = await storage.getArticles({ authorId: "admin" });
      res.json(
        articles.map((article) => ({
          ...article,
          readingTime: calculateReadingTime(article.content),
        }))
      );
    } catch (error) {
      console.error("Error fetching admin articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // ── FIX: was missing proper fetch for single article ──
  app.get("/api/admin/article/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid article ID" });

      const article = await storage.getArticleById(id);
      if (!article || article.authorId !== "admin") {
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
      const articleData = {
        ...req.body,
        authorId: "admin",
        publishedAt: req.body.status === "published" ? new Date() : null,
      };
      const validatedData = insertArticleSchema.parse(articleData);
      const article = await storage.createArticle(validatedData);
      res.json(article);
    } catch (error: any) {
      console.error("Error creating article:", error);
      // Return Zod validation errors clearly
      if (error?.errors) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/admin/article/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid article ID" });

      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle || existingArticle.authorId !== "admin") {
        return res.status(404).json({ error: "Article not found" });
      }

      const updateData = {
        ...req.body,
        publishedAt:
          req.body.status === "published" && !existingArticle.publishedAt
            ? new Date()
            : existingArticle.publishedAt,
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
      if (isNaN(id)) return res.status(400).json({ error: "Invalid article ID" });

      const existingArticle = await storage.getArticleById(id);
      if (!existingArticle || existingArticle.authorId !== "admin") {
        return res.status(404).json({ error: "Article not found" });
      }

      const success = await storage.deleteArticle(id);
      res.json({ success });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // ── Analytics ────────────────────────────────────────────────────────────
  app.get("/api/admin/analytics", isAuthenticated, async (_req, res) => {
    try {
      const popularArticles = await storage.getPopularArticles(5);
      res.json({
        popularArticles: popularArticles.map((a) => ({
          ...a,
          readingTime: calculateReadingTime(a.content),
        })),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ── File / Image upload routes ───────────────────────────────────────────
  // Presigned URL approach (existing — for TipTap inline images)
  app.post("/api/upload/image", isAuthenticated, async (_req, res) => {
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
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(imageURL, {
        owner: "admin",
        visibility: "public",
      });
      res.json({ objectPath });
    } catch (error) {
      console.error("Error confirming upload:", error);
      res.status(500).json({ error: "Failed to confirm upload" });
    }
  });

  // Direct multipart upload — for attachments (PDFs, docs, photos, videos)
  app.post(
    "/api/upload/file",
    isAuthenticated,
    upload.single("file"),
    async (req: any, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });

        const objectStorageService = new ObjectStorageService();

        // Get a presigned URL then upload the buffer
        const uploadURL = await objectStorageService.getObjectEntityUploadURL();
        await fetch(uploadURL, {
          method: "PUT",
          body: req.file.buffer,
          headers: { "Content-Type": req.file.mimetype },
        });

        const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(uploadURL, {
          owner: "admin",
          visibility: "public",
        });

        res.json({
          objectPath,
          name: req.file.originalname,
          type: req.file.mimetype,
          size: req.file.size,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
      }
    }
  );

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "File not found" });
    }
  });

  app.get("/api/hello", (_req, res) => {
    res.json({ message: "Hola desde el servidor" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
