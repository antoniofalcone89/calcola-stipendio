import React from "react";
import Skeleton from "./Skeleton";
import { Box } from "../layout";

/**
 * HeaderSkeleton Component
 * Loading placeholder for the header section
 * Follows Single Responsibility Principle - provides header loading state
 */
const HeaderSkeleton = () => {
  return (
    <Box className="flex-between">
      <Skeleton
        variant="text"
        width="60%"
        height={48}
        style={{
          flex: 1,
          textAlign: "center",
        }}
      />
      <Skeleton variant="circular" width={40} height={40} />
    </Box>
  );
};

export default HeaderSkeleton;
