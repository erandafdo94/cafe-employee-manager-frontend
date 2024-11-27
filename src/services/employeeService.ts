import { Employee, EmployeeFormData, ApiResponse } from "../types";
import api from "./api";

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await api.get<ApiResponse<Employee[]>>("/employees");
    return data.data;
  },

  getByCafe: async (cafeId: string): Promise<Employee[]> => {
    const { data } = await api.get<ApiResponse<Employee[]>>(
      `/employees?cafeId=${cafeId}`
    );
    return data.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const { data } = await api.get<ApiResponse<Employee>>(`/employees/${id}`);
    return data.data;
  },

  create: async (employeeData: EmployeeFormData): Promise<Employee> => {
    const { data } = await api.post<ApiResponse<Employee>>(
      "/employees",
      employeeData
    );
    return data.data;
  },

  update: async (
    id: string,
    employeeData: EmployeeFormData
  ): Promise<Employee> => {
    const { data } = await api.put<ApiResponse<Employee>>(
      `/employees/${id}`,
      employeeData
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
