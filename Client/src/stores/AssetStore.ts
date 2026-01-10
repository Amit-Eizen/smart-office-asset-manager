import { makeAutoObservable, runInAction } from "mobx";
import { resourceService } from "../services/resourceService";
import type { Asset, CreateAssetRequest } from "../types";
import { authStore } from "./AuthStore";

export class AssetStore {
    assets: Asset[] = [];
    loading: boolean = false;
    error: string | null = null

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAssets() {
        if(!authStore.token) {
            this.error = "Not authenticated";
            return;
        }

        this.loading = true;
        this.error = null;
        try {
            const existingAssets = await resourceService.getAssets(authStore.token);
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
        if(!authStore.token) {
            this.error = "Not authenticated";
            return;
        }

        this.loading = true;
        this.error = null;

        try {
            const newAsset = await resourceService.createAsset(authStore.token, data);
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
}

export const assetStore = new AssetStore();