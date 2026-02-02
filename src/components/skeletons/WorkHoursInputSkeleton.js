import { Grid, Skeleton } from "@mui/material";

const WorkHoursInputSkeleton = () => {
  return (
    <Grid item xs={12} md={6}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} />
    </Grid>
  );
};

export default WorkHoursInputSkeleton;
