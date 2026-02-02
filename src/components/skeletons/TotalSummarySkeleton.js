import { Skeleton, Box, Grid } from "@mui/material";

const TotalSummarySkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={80} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" width="100%" height={80} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalSummarySkeleton;
