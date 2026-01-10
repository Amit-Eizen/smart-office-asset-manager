import apiClient from "../api/axiosInstance";
import type { Asset, CreateAssetRequest } from "../types";

export const resourceService = {
    getAssets: async (): Promise<Asset[]> => {
        const response = await apiClient.get<Asset[]>('/assets');
        return response.data;
    },

    createAsset: async (data: CreateAssetRequest): Promise<Asset> => {
        const response = await apiClient.post<Asset>('/assets', data);
        return response.data;
    },
};