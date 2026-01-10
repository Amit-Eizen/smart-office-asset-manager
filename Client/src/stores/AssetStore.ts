import { makeAutoObservable, runInAction } from "mobx";
import { resourceService } from "../services/resourceService";
import type { Asset, CreateAssetRequest } from "../types";

export class AssetStore {
    assets: Asset[] = [];
    loading: boolean = false;
    error: string | null = null

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAssets() {
        this.loading = true;
        this.error = null;
        try {
            const existingAssets = await resourceService.getAssets();
            runInAction(() => {
                this.assets = existingAssets;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to fetch assets";
                this.loading = false;
            });
        }
    }

    async createAsset(data: CreateAssetRequest) {
        this.loading = true;
        this.error = null;

        try {
            const newAsset = await resourceService.createAsset(data);
            runInAction(() => {
                this.assets.push(newAsset);
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to create asset";
                this.loading = false;
            });
        }
    }

    clearError() {
        this.error = null;
    }
}

export const assetStore = new AssetStore();