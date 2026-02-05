import React from "react";
import Skeleton from "./Skeleton";
import { Box } from "../layout";

/**
 * SummaryTableSkeleton Component
 * Loading placeholder for the summary table section
 * Follows Single Responsibility Principle - provides table loading state
 */
const SummaryTableSkeleton = () => {
  return (
    <Box>
      <Skeleton
        variant="text"
        width="30%"
        height={32}
        style={{ marginBottom: "24px" }}
      />

      {/* Table header */}
      <Box className="flex" style={{ marginBottom: "16px" }}>
        <Skeleton
          variant="text"
          width="25%"
          height={24}
          style={{ marginRight: "16px" }}
        />
        <Skeleton
          variant="text"
          width="25%"
          height={24}
          style={{ marginRight: "16px" }}
        />
        <Skeleton
          variant="text"
          width="25%"
          height={24}
          style={{ marginRight: "16px" }}
        />
        <Skeleton variant="text" width="25%" height={24} />
      </Box>

      {/* Table rows */}
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} className="flex" style={{ marginBottom: "8px" }}>
          <Skeleton
            variant="text"
            width="25%"
            height={20}
            style={{ marginRight: "16px" }}
          />
          <Skeleton
            variant="text"
            width="25%"
            height={20}
            style={{ marginRight: "16px" }}
          />
          <Skeleton
            variant="text"
            width="25%"
            height={20}
            style={{ marginRight: "16px" }}
          />
          <Skeleton variant="text" width="25%" height={20} />
        </Box>
      ))}

      {/* Delete all button */}
      <Skeleton
        variant="rectangular"
        width="120px"
        height={36}
        style={{ marginTop: "16px" }}
      />
    </Box>
  );
};

export default SummaryTableSkeleton;
