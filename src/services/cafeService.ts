// src/services/cafeService.ts
import { ApiResponse, Cafe, UpdateCafeCommand } from "../types";
import api from "./api";

export const cafeService = {
  getAll: async (): Promise<Cafe[]> => {
    try {
      const response = await api.get<Cafe[]>("/cafe/all");
      console.log("Raw API response:", response);
      // API is returning array directly, no nested data structure
      return response.data;
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  },

  // In cafeService.ts
  getById: async (id: string): Promise<Cafe> => {
    const { data } = await api.get<Cafe>(`/cafe/${id}`);
    // Remove the nested .data access since the cafe data is directly in response.data
    return data;
  },

  create: async (
    cafeData: Omit<Cafe, "id" | "employeeCount">
  ): Promise<Cafe> => {
    const { data } = await api.post<ApiResponse<Cafe>>("/cafe", {
      ...cafeData,
      logo: "string.png", // Hardcoded for now
    });
    return data.data;
  },

  update: async (id: string, cafeData: UpdateCafeCommand): Promise<boolean> => {
    const updateData = {
      ...cafeData,
      logo: "string",
    };

    // Changed from `/cafe/${id}` to `/cafe?id=${id}`
    const { data } = await api.put<boolean>(`/cafe?id=${id}`, updateData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cafe/${id}`);
  },
};
