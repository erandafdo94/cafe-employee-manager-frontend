// src/services/cafeService.ts
import { ApiResponse, Cafe } from "../types";
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

  getById: async (id: string): Promise<Cafe> => {
    const { data } = await api.get<ApiResponse<Cafe>>(`/cafe/${id}`);
    return data.data;
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

  update: async (id: string, cafeData: any): Promise<Cafe> => {
    const updateData = {
      ...cafeData,
      logo: "string",
    };

    const { data } = await api.put<ApiResponse<Cafe>>(
      `/cafe/${id}`,
      updateData
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/cafe/${id}`);
  },
};
