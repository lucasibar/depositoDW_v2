import React from 'react';
import { Box, Container, Paper, useMediaQuery, useTheme } from '@mui/material';
import { LoginFooter, LoginForm, LoginHeader } from '../../components/Login';
import { getContainerStyles, getPaperStyles } from '../../styles/login/loginStyles';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={getPaperStyles(isMobile)}>
          <LoginHeader isMobile={isMobile} />
          <LoginForm />
          <LoginFooter />
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;