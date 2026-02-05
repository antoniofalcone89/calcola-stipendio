import React from "react";
import Skeleton from "./Skeleton";
import { Box } from "../layout";

/**
 * TotalSummarySkeleton Component
 * Loading placeholder for the total summary section
 * Follows Single Responsibility Principle - provides summary loading state
 */
const TotalSummarySkeleton = () => {
  return (
    <Box>
      <Skeleton
        variant="text"
        width="35%"
        height={32}
        style={{ marginBottom: "24px" }}
      />

      {/* Total hours */}
      <Box style={{ marginBottom: "16px" }}>
        <Skeleton
          variant="text"
          width="30%"
          height={20}
          style={{ marginBottom: "8px" }}
        />
        <Skeleton variant="text" width="50%" height={28} />
      </Box>

      {/* Total earnings */}
      <Box style={{ marginBottom: "16px" }}>
        <Skeleton
          variant="text"
          width="35%"
          height={20}
          style={{ marginBottom: "8px" }}
        />
        <Skeleton variant="text" width="60%" height={28} />
      </Box>

      {/* Average hourly rate */}
      <Box>
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          style={{ marginBottom: "8px" }}
        />
        <Skeleton variant="text" width="45%" height={28} />
      </Box>
    </Box>
  );
};

export default TotalSummarySkeleton;
