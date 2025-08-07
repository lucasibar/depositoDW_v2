import React from "react";
import { useSelector } from "react-redux";
import { Box, Alert, useTheme, useMediaQuery } from "@mui/material";
import { selectRemitosLoading, selectRemitosError } from "../../../../features/remitos/model/selectors";
import { RemitosList } from "../RemitosTab/components/RemitosList/RemitosList";

export const RemitosListTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const isLoading = useSelector(selectRemitosLoading);
  const error = useSelector(selectRemitosError);

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <RemitosList />
    </Box>
  );
}; 