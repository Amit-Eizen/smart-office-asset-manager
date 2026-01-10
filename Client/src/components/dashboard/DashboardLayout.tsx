import { observer } from "mobx-react-lite";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../stores/AuthStore";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = observer(({ children }: DashboardLayoutProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authStore.logout();
        navigate("/auth");
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Smart Office Asset Manager
                    </Typography>
                    <Typography sx={{ marginRight: 2 }}>
                        {authStore.role}: {authStore.username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: 4 }}>{children}</Box>
        </Box>
    );
});

export default DashboardLayout;
