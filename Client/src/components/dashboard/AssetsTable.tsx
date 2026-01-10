import { observer } from "mobx-react-lite";
import { Table, TableBody,  TableCell, TableContainer, TableHead,
    TableRow, Paper, CircularProgress, Box} from "@mui/material";
import { assetStore } from "../../stores/AssetStore";

const AssetsTable = observer(() => {
    if (assetStore.loading) {
        return (
            <Box display="flex" justifyContent="center" padding={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
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
    );
});

export default AssetsTable;
