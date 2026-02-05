import React from "react";
import Skeleton from "./Skeleton";
import { Grid } from "../layout";

/**
 * HourlyRateInputSkeleton Component
 * Loading placeholder for the hourly rate input section
 * Follows Single Responsibility Principle - provides hourly rate input loading state
 */
const HourlyRateInputSkeleton = () => {
  return (
    <Grid item xs={12} sm={6}>
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
