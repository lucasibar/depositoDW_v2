import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LoginForm from '../components/Login/LoginForm';


const LoginPage = () => {
  

  return (
    <Box >
        <Paper elevation={8} >
        <Typography variant="h3" component="h1" style={{fontWeight: 700, color: 'var(--color-text-primary)', mb: 1}}> 
          Der Will
        </Typography>
        <LoginForm/>
        </Paper>
    </Box>
  );
};

export default LoginPage;