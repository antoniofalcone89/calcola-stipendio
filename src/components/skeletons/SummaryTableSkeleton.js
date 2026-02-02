import { Skeleton, Box } from "@mui/material";

const SummaryTableSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
      
      {/* Table header */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Skeleton variant="text" width="25%" height={24} sx={{ mr: 2 }} />
        <Skeleton variant="text" width="25%" height={24} sx={{ mr: 2 }} />
        <Skeleton variant="text" width="25%" height={24} sx={{ mr: 2 }} />
        <Skeleton variant="text" width="25%" height={24} />
      </Box>
      
      {/* Table rows */}
      {[1, 2, 3, 4, 5].map((item) => (
        <Box key={item} sx={{ display: 'flex', mb: 1 }}>
          <Skeleton variant="text" width="25%" height={20} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="25%" height={20} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="25%" height={20} sx={{ mr: 2 }} />
          <Skeleton variant="text" width="25%" height={20} />
        </Box>
      ))}
      
      {/* Delete all button */}
      <Skeleton variant="rectangular" width="120px" height={36} sx={{ mt: 2 }} />
    </Box>
  );
};

export default SummaryTableSkeleton;
