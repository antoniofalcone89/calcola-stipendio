import { Grid } from "../ui/layout";
import { Skeleton } from "../ui/skeleton";

const HourlyRateInputSkeleton = () => {
  return (
    <Grid item xs={12} md={6}>
      <Skeleton
        variant="text"
        width="40%"
        height={32}
        style={{ marginBottom: "16px" }}
      />
      <Skeleton variant="rectangular" width="100%" height={56} />
    </Grid>
  );
};

export default HourlyRateInputSkeleton;
