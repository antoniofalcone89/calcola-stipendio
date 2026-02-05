import React from "react";
import Skeleton from "./Skeleton";
import { Box } from "../layout";

/**
 * WorkHoursInputSkeleton Component
 * Loading placeholder for the work hours input section
 * Follows Single Responsibility Principle - provides input form loading state
 */
const WorkHoursInputSkeleton = () => {
  return (
    <Box>
      <Skeleton
        variant="text"
        width="40%"
        height={32}
        style={{ marginBottom: "24px" }}
      />

      {/* Date input */}
      <Box style={{ marginBottom: "16px" }}>
        <Skeleton
          variant="text"
          width="20%"
          height={20}
          style={{ marginBottom: "8px" }}
        />
        <Skeleton variant="rectangular" width="100%" height={56} />
      </Box>

      {/* Hours input */}
      <Box style={{ marginBottom: "16px" }}>
        <Skeleton
          variant="text"
          width="25%"
          height={20}
          style={{ marginBottom: "8px" }}
        />
        <Skeleton variant="rectangular" width="100%" height={56} />
      </Box>

      {/* Add button */}
      <Skeleton
        variant="rectangular"
        width="100px"
        height={36}
        style={{ marginTop: "16px" }}
      />
    </Box>
  );
};

export default WorkHoursInputSkeleton;
