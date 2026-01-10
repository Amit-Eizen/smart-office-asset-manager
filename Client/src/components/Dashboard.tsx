import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Typography, Button, Alert } from "@mui/material";
import { authStore } from "../stores/AuthStore";
import { assetStore } from "../stores/AssetStore";
import DashboardLayout from "./dashboard/DashboardLayout";
import AssetsTable from "./dashboard/AssetsTable";
import CreateAssetDialog from "./dashboard/CreateAssetDialog";

const Dashboard = observer(() => {
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        assetStore.fetchAssets();
    }, []);

    return (
        <DashboardLayout>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <Typography variant="h4">Assets</Typography>
                {authStore.role === "Admin" && (
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>
                        Add Asset
                    </Button>
                )}
            </Box>

            {assetStore.error && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => assetStore.clearError()}>
                    {assetStore.error}
                </Alert>
            )}

            <AssetsTable />

            <CreateAssetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </DashboardLayout>
    );
});

export default Dashboard;