import { useState } from "react";
import { TextField, Button, CircularProgress, Alert, MenuItem } from "@mui/material";
import { authStore } from "../../stores/AuthStore";

interface AuthFormProps {
    mode: "login" | "register";
    onSuccess: () => void;
}

const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"Admin" | "Member">("Member");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            if (mode === "login") {
                await authStore.login({ username, password });
            } else {
                await authStore.register({ username, password, role });
            }

            if (authStore.isAuthenticated) {
                onSuccess();
            } else {
                setError(
                    mode === "login"
                        ? "Authentication failed. Please try again."
                        : "Registration failed. Please try again."
                );
            }
        } catch (err) {
            setError(
                mode === "login"
                    ? "An error occurred during authentication. Please try again."
                    : "An error occurred during registration. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = username.trim() && password.trim();

    return (
        <>
            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

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

                {mode === "register" && (
                    <TextField
                        select
                        label="Role"
                        fullWidth
                        margin="normal"
                        value={role}
                        onChange={(e) => setRole(e.target.value as "Admin" | "Member")}
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
                    disabled={loading || !isFormValid}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : mode === "login" ? (
                        "Login"
                    ) : (
                        "Register"
                    )}
                </Button>
            </form>
        </>
    );
};

export default AuthForm;
