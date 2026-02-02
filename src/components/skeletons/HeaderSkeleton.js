import { Skeleton, Box } from "@mui/material";

const HeaderSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Skeleton 
        variant="text" 
        width="60%" 
        height={48} 
        sx={{ 
          flex: 1,
          textAlign: "center",
        }} 
      />
      <Skeleton variant="circular" width={40} height={40} />
    </Box>
  );
};

export default HeaderSkeleton;
