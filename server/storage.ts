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
  getAllRecommendations(): Promise<Recommendation[]>;
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

    // Initialize recommendations with more diverse options
    const recommendations: Omit<Recommendation, 'id' | 'createdAt'>[] = [
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
      },
      {
        title: "Air Conditioners & Fans",
        description: "Temperature trending upward, cooling demand high",
        category: "Electronics",
        priority: "high",
        score: 88,
        expectedImpact: 3200,
        suggestedPlacement: "Electronics section entrance",
        inventoryImpact: "+95% demand",
        timeSensitivity: "Next 2 hours",
        imageUrl: "https://images.unsplash.com/photo-1628566470685-7b1c35bb3db1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "Sunscreen & Summer Care",
        description: "High UV index expected this week",
        category: "Health & Beauty",
        priority: "medium",
        score: 73,
        expectedImpact: 1500,
        suggestedPlacement: "Health & beauty endcap",
        inventoryImpact: "+55% demand",
        timeSensitivity: "Today",
        imageUrl: "https://images.unsplash.com/photo-1556909114-46b3ad9d4ba7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "Pool & Beach Supplies",
        description: "Weekend weather forecast shows perfect pool conditions",
        category: "Seasonal",
        priority: "medium",
        score: 79,
        expectedImpact: 2100,
        suggestedPlacement: "Seasonal display center",
        inventoryImpact: "+70% demand",
        timeSensitivity: "Next 24 hours",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "MLB Game Day Snacks",
        description: "Baseball season driving demand for stadium-style food",
        category: "Sports & Snacks",
        priority: "medium",
        score: 71,
        expectedImpact: 1600,
        suggestedPlacement: "Sports section endcap",
        inventoryImpact: "+60% demand",
        timeSensitivity: "Game days",
        imageUrl: "https://images.unsplash.com/photo-1628294896516-211d5565e8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "Red, White & Blue Decor",
        description: "4th of July patriotic decorations and party items",
        category: "Holiday Decor",
        priority: "high",
        score: 87,
        expectedImpact: 2800,
        suggestedPlacement: "Main entrance display",
        inventoryImpact: "+150% demand",
        timeSensitivity: "Urgent - 3 days left",
        imageUrl: "https://images.unsplash.com/photo-1498335746397-6d4b1dd05a6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "Back-to-School Prep Items",
        description: "Early prep for upcoming school season trends",
        category: "Education",
        priority: "low",
        score: 65,
        expectedImpact: 1300,
        suggestedPlacement: "Education aisle entrance",
        inventoryImpact: "+35% demand",
        timeSensitivity: "Next month",
        imageUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
      {
        title: "Fitness & Wellness Products",
        description: "Summer fitness trend driving health product demand",
        category: "Health & Fitness",
        priority: "medium",
        score: 74,
        expectedImpact: 1900,
        suggestedPlacement: "Health section front",
        inventoryImpact: "+55% demand",
        timeSensitivity: "This week",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        isActive: true,
      },
    ];

    recommendations.forEach(rec => {
      const recommendation: Recommendation = { 
        ...rec, 
        id: this.currentRecId++,
        createdAt: now,
        imageUrl: rec.imageUrl || null,
        isActive: rec.isActive || true
      };
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

  async getAllRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendationsList.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
