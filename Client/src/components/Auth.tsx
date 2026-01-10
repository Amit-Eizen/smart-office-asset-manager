import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import AuthForm from "./auth/AuthForm";

const Auth = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "register">("login");

    const handleSuccess = () => {
        navigate("/dashboard");
    };

    return (
        <AuthLayout>
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

            <AuthForm mode={mode} onSuccess={handleSuccess} />
        </AuthLayout>
    );
};

export default Auth;
