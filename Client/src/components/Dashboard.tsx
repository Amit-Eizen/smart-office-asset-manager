import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "../stores/AuthStore";
import { assetStore } from "../stores/AssetStore";
import { Box, AppBar, Toolbar, Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Dialog, 
    DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CreateAssetRequest } from "../types";

const Dashboard = observer(() => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newAsset, setNewAsset] = useState<CreateAssetRequest>({ name: "", type: "", status: "" });

    useEffect(() => { 
        assetStore.fetchAssets(); 
    }, []);

    const handleLogout = () => { 
        authStore.logout(); 
        navigate("/auth"); 
    };

    const handleCreateAsset = async () => {
        await assetStore.createAsset(newAsset);
        setDialogOpen(false);
        setNewAsset({ name: "", type: "", status: "" });
    };

    return (
        <Box>
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Smart Office Asset Manager
                    </Typography>
                    <Typography sx={{ marginRight: 2 }}>
                        {authStore.role}: {authStore.userId}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ padding: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Typography variant="h4">Assets</Typography>
                    {/*Add Asset Button - only for Admins*/}
                    {authStore.role === "Admin" && (
                        <Button variant="contained" onClick={() => setDialogOpen(true)}>Add Asset</Button>
                    )}
                </Box>

                {/*Error Message*/}
                {assetStore.error && <Alert severity="error" sx={{ marginBottom: 2 }}>{assetStore.error}</Alert>}

                {/*Loading State*/}
                {assetStore.loading ? (
                    <Box display="flex" justifyContent="center" padding={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    /*Assets Table*/
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assetStore.assets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell>{asset.id}</TableCell>
                                        <TableCell>{asset.name}</TableCell>
                                        <TableCell>{asset.type}</TableCell>
                                        <TableCell>{asset.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/*Create Asset Dialog*/}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Create New Asset</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={newAsset.name}
                        onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    />
                    <TextField
                        label="Type"
                        fullWidth
                        margin="normal"
                        value={newAsset.type}
                        onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                    />
                    <TextField
                        label="Status"
                        fullWidth
                        margin="normal"
                        value={newAsset.status}
                        onChange={(e) => setNewAsset({ ...newAsset, status: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateAsset} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

export default Dashboard;