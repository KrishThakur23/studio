import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEnvironmentalDataSchema, insertRecommendationSchema, insertDemandTrendSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Environmental data routes
  app.get("/api/environmental/current", async (req, res) => {
    try {
      const data = await storage.getCurrentEnvironmentalData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental data" });
    }
  });

  app.get("/api/environmental/history/:hours", async (req, res) => {
    try {
      const hours = parseInt(req.params.hours);
      if (isNaN(hours) || hours < 1) {
        return res.status(400).json({ message: "Invalid hours parameter" });
      }
      const data = await storage.getEnvironmentalDataHistory(hours);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch environmental history" });
    }
  });

  app.post("/api/environmental", async (req, res) => {
    try {
      const validatedData = insertEnvironmentalDataSchema.parse(req.body);
      const data = await storage.createEnvironmentalData(validatedData);
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: "Invalid environmental data" });
    }
  });

  // Recommendations routes
  app.get("/api/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getActiveRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const validatedData = insertRecommendationSchema.parse(req.body);
      const recommendation = await storage.createRecommendation(validatedData);
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ message: "Invalid recommendation data" });
    }
  });

  app.patch("/api/recommendations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recommendation ID" });
      }
      const recommendation = await storage.updateRecommendation(id, req.body);
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update recommendation" });
    }
  });

  // Demand trends routes
  app.get("/api/trends/:hours", async (req, res) => {
    try {
      const hours = parseInt(req.params.hours);
      if (isNaN(hours) || hours < 1) {
        return res.status(400).json({ message: "Invalid hours parameter" });
      }
      const trends = await storage.getDemandTrends(hours);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demand trends" });
    }
  });

  app.post("/api/trends", async (req, res) => {
    try {
      const validatedData = insertDemandTrendSchema.parse(req.body);
      const trend = await storage.createDemandTrend(validatedData);
      res.json(trend);
    } catch (error) {
      res.status(400).json({ message: "Invalid trend data" });
    }
  });

  // Simulate real-time environmental data updates
  app.post("/api/environmental/simulate", async (req, res) => {
    try {
      const current = await storage.getCurrentEnvironmentalData();
      if (!current) {
        return res.status(404).json({ message: "No current data found" });
      }
      
      // Generate slight variations
      const newData = {
        temperature: current.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, current.humidity + (Math.random() - 0.5) * 5)),
        aqi: Math.max(10, Math.min(100, current.aqi + (Math.random() - 0.5) * 5)),
      };
      
      const data = await storage.createEnvironmentalData(newData);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate environmental data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
