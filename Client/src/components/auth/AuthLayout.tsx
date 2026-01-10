import { Box, Card } from "@mui/material";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Card sx={{ padding: 4, width: 400 }}>
                {children}
            </Card>
        </Box>
    );
};

export default AuthLayout;
