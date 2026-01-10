import axios from "axios";
import type { Asset, CreateAssetRequest } from "../types";

const API_RESOURCE_URL = import.meta.env.VITE_RESOURCE_API_URL;

export const resourceService = {
    getAssets: async (token: string): Promise<Asset[]> => {
        const response = await axios.get<Asset[]>(`${API_RESOURCE_URL}/assets`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    createAsset: async (token: string, data: CreateAssetRequest): Promise<Asset> => {
        const response = await axios.post<Asset>(`${API_RESOURCE_URL}/assets`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};