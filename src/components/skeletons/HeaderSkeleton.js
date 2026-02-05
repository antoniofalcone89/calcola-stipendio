import { Skeleton } from "../ui/skeleton";
import { Box } from "../ui/layout";

const HeaderSkeleton = () => {
  return (
    <Box className="flex flex-between flex-center mb-4">
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
