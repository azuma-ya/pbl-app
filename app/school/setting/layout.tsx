import { Box, Typography } from "@mui/material";
import { type ReactNode } from "react";

import { getAuthSession } from "@/lib/auth";

const SchoolSettingLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getAuthSession();

  if (!user?.isAdmin) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" fontWeight="semibold">
          権限が付与されていません
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default SchoolSettingLayout;
