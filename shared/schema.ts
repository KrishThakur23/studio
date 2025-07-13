import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const environmentalData = pgTable("environmental_data", {
  id: serial("id").primaryKey(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  aqi: integer("aqi").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  score: integer("score").notNull(),
  expectedImpact: integer("expected_impact").notNull(),
  suggestedPlacement: text("suggested_placement").notNull(),
  inventoryImpact: text("inventory_impact").notNull(),
  timeSensitivity: text("time_sensitivity").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const demandTrends = pgTable("demand_trends", {
  id: serial("id").primaryKey(),
  hour: integer("hour").notNull(),
  temperature: real("temperature").notNull(),
  salesVolume: integer("sales_volume").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEnvironmentalDataSchema = createInsertSchema(environmentalData).omit({
  id: true,
  timestamp: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertDemandTrendSchema = createInsertSchema(demandTrends).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEnvironmentalData = z.infer<typeof insertEnvironmentalDataSchema>;
export type EnvironmentalData = typeof environmentalData.$inferSelect;

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

export type InsertDemandTrend = z.infer<typeof insertDemandTrendSchema>;
export type DemandTrend = typeof demandTrends.$inferSelect;
