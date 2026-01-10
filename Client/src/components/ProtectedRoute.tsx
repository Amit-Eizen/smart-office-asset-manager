import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
    if (!authStore.isInitialized) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }
    
    if (!authStore.isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    return <>{children}</>;
});

export default ProtectedRoute;