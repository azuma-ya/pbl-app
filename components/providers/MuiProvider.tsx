import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { ReactNode } from "react";

const MuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      {children}
    </AppRouterCacheProvider>
  );
};

export default MuiProvider;
