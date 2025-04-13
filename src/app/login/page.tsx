"use client";
import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Grid, Paper, Alert, IconButton } from "@mui/material";
import { Brightness4, Brightness7, LockOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import request from "@src/config/axios";
import { useRouter } from "next/navigation";
import { useThemeContext } from "@src/context/theme-context";

const LoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const router = useRouter();
  const { mode, toggleTheme } = useThemeContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await request.post("/auth/login", { email, password });
      
      if (response.data?.token) {
        localStorage.setItem('accessToken', response.data.token);
      }
      
      router.push("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Invalid email or password, please try again.";
      setError(errorMessage);
      console.error("Login failed:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <IconButton 
        onClick={toggleTheme}
        sx={{ 
          position: 'absolute',
          top: 16,
          right: 16
        }}
      >
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Container
        maxWidth="xs"
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, 
            borderRadius: 3, 
            backgroundColor: theme.palette.background.paper,
            width: '100%'
          }}
        >
          <Box textAlign="center" mb={4}>
            <LockOutlined sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color={theme.palette.primary.main} gutterBottom>
              Admin Login
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
              Please login to access the admin dashboard.
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Email Address"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  error={Boolean(error)}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: theme.palette.text.primary },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Password"
                  type="password"
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  error={Boolean(error)}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: theme.palette.text.primary },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  sx={{ 
                    mt: 3,
                    py: 1.5
                  }} 
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Login"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
