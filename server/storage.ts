import { 
  users, 
  environmentalData,
  recommendations,
  demandTrends,
  type User, 
  type InsertUser,
  type EnvironmentalData,
  type InsertEnvironmentalData,
  type Recommendation,
  type InsertRecommendation,
  type DemandTrend,
  type InsertDemandTrend
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCurrentEnvironmentalData(): Promise<EnvironmentalData | undefined>;
  createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData>;
  getEnvironmentalDataHistory(hours: number): Promise<EnvironmentalData[]>;
  
  getActiveRecommendations(): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined>;
  
  getDemandTrends(hours: number): Promise<DemandTrend[]>;
  createDemandTrend(trend: InsertDemandTrend): Promise<DemandTrend>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private environmentalDataList: Map<number, EnvironmentalData>;
  private recommendationsList: Map<number, Recommendation>;
  private demandTrendsList: Map<number, DemandTrend>;
  private currentUserId: number;
  private currentEnvId: number;
  private currentRecId: number;
  private currentTrendId: number;

  constructor() {
    this.users = new Map();
    this.environmentalDataList = new Map();
    this.recommendationsList = new Map();
    this.demandTrendsList = new Map();
    this.currentUserId = 1;
    this.currentEnvId = 1;
    this.currentRecId = 1;
    this.currentTrendId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with current environmental data
    const now = new Date();
    const envData: EnvironmentalData = {
      id: this.currentEnvId++,
      temperature: 78.0,
      humidity: 65.0,
      aqi: 42,
      timestamp: now,
    };
    this.environmentalDataList.set(envData.id, envData);

    // Initialize recommendations
    const recommendations: Omit<Recommendation, 'id'>[] = [
      {
        title: "Cold Beverages & Ice",
        description: "Recommended due to high temperature (78°F)",
        category: "Beverages",
        priority: "high",
        score: 94,
        expectedImpact: 2400,
        suggestedPlacement: "Front entrance display",
        inventoryImpact: "+85% demand",
        timeSensitivity: "Next 4 hours",
        imageUrl: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
        createdAt: now,
      },
      {
        title: "Summer Accessories",
        description: "Seasonal trend and weather conditions",
        category: "Seasonal",
        priority: "medium",
        score: 76,
        expectedImpact: 1200,
        suggestedPlacement: "Seasonal end cap",
        inventoryImpact: "+45% demand",
        timeSensitivity: "This week",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
        createdAt: now,
      },
      {
        title: "4th of July Prep",
        description: "Holiday in 5 days - BBQ & party supplies",
        category: "Holiday",
        priority: "high",
        score: 82,
        expectedImpact: 1800,
        suggestedPlacement: "Store entrance",
        inventoryImpact: "+120% demand",
        timeSensitivity: "Urgent",
        imageUrl: "https://images.unsplash.com/photo-1530841344095-36d6e3a8cf66?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
        createdAt: now,
      },
    ];

    recommendations.forEach(rec => {
      const recommendation: Recommendation = { ...rec, id: this.currentRecId++ };
      this.recommendationsList.set(recommendation.id, recommendation);
    });

    // Initialize demand trends (24 hours)
    const trendData = [
      { hour: 0, temperature: 65.0, salesVolume: 120 },
      { hour: 3, temperature: 62.0, salesVolume: 80 },
      { hour: 6, temperature: 68.0, salesVolume: 150 },
      { hour: 9, temperature: 72.0, salesVolume: 250 },
      { hour: 12, temperature: 75.0, salesVolume: 380 },
      { hour: 15, temperature: 78.0, salesVolume: 450 },
      { hour: 18, temperature: 76.0, salesVolume: 420 },
      { hour: 21, temperature: 74.0, salesVolume: 300 },
    ];

    trendData.forEach(data => {
      const trend: DemandTrend = {
        id: this.currentTrendId++,
        hour: data.hour,
        temperature: data.temperature,
        salesVolume: data.salesVolume,
        date: now,
      };
      this.demandTrendsList.set(trend.id, trend);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCurrentEnvironmentalData(): Promise<EnvironmentalData | undefined> {
    const allData = Array.from(this.environmentalDataList.values());
    return allData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData> {
    const id = this.currentEnvId++;
    const envData: EnvironmentalData = {
      ...data,
      id,
      timestamp: new Date(),
    };
    this.environmentalDataList.set(id, envData);
    return envData;
  }

  async getEnvironmentalDataHistory(hours: number): Promise<EnvironmentalData[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.environmentalDataList.values())
      .filter(data => data.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getActiveRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendationsList.values())
      .filter(rec => rec.isActive)
      .sort((a, b) => b.score - a.score);
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecId++;
    const rec: Recommendation = {
      ...recommendation,
      id,
      createdAt: new Date(),
    };
    this.recommendationsList.set(id, rec);
    return rec;
  }

  async updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined> {
    const existing = this.recommendationsList.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.recommendationsList.set(id, updated);
    return updated;
  }

  async getDemandTrends(hours: number): Promise<DemandTrend[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.demandTrendsList.values())
      .filter(trend => trend.date >= cutoff)
      .sort((a, b) => a.hour - b.hour);
  }

  async createDemandTrend(trend: InsertDemandTrend): Promise<DemandTrend> {
    const id = this.currentTrendId++;
    const demandTrend: DemandTrend = {
      ...trend,
      id,
      date: new Date(),
    };
    this.demandTrendsList.set(id, demandTrend);
    return demandTrend;
  }
}

export const storage = new MemStorage();
