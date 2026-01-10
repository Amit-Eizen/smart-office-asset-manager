import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { assetStore } from "../../stores/AssetStore";
import type { CreateAssetRequest } from "../../types";

interface CreateAssetDialogProps {
    open: boolean;
    onClose: () => void;
}

const CreateAssetDialog = ({ open, onClose }: CreateAssetDialogProps) => {
    const [newAsset, setNewAsset] = useState<CreateAssetRequest>({
        name: "",
        type: "",
        status: "",
    });

    const handleCreate = async () => {
        await assetStore.createAsset(newAsset);
        setNewAsset({ name: "", type: "", status: "" });
        onClose();
    };

    const isFormValid =
        newAsset.name.trim() && newAsset.type.trim() && newAsset.status.trim();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create New Asset</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={newAsset.name}
                    onChange={(e) =>
                        setNewAsset({ ...newAsset, name: e.target.value })
                    }
                />
                <TextField
                    label="Type"
                    fullWidth
                    margin="normal"
                    value={newAsset.type}
                    onChange={(e) =>
                        setNewAsset({ ...newAsset, type: e.target.value })
                    }
                />
                <TextField
                    label="Status"
                    fullWidth
                    margin="normal"
                    value={newAsset.status}
                    onChange={(e) =>
                        setNewAsset({ ...newAsset, status: e.target.value })
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleCreate}
                    variant="contained"
                    disabled={!isFormValid}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAssetDialog;
