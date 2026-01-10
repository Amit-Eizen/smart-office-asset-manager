import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import { Box, Card, TextField, Button, ToggleButtonGroup, ToggleButton, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Auth = observer(() => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'Admin' | 'Member'>('Member');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await authStore.login({ username, password });
            } else {
                await authStore.register({ username, password, role });
            }

            if (authStore.isAuthenticated) {
                navigate('/dashboard');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during authentication. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Card sx={{ padding: 4, width: 400 }}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, newMode) => newMode && setMode(newMode)}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                >
                    <ToggleButton value="login">Login</ToggleButton>
                    <ToggleButton value="register">Register</ToggleButton>
                </ToggleButtonGroup>

                {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {mode === 'register' && (
                        <TextField
                            select
                            label="Role"
                            fullWidth
                            margin="normal"
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'Admin' | 'Member')}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Member">Member</MenuItem>
                        </TextField>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : mode === 'login' ? 'Login' : 'Register'}
                    </Button>
                </form>
            </Card>
        </Box>
    );
});

export default Auth;
